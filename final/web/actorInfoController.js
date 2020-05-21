const common = require("./tools/common");
const cheerio = require("cheerio");
const superagent = require("superagent");
const url = require('url');
const actorInfoDao = require('../dao/actorInfoDao');

const path = new Map();

/**
 * 获取演员详情页面
 * @param id 演员id
 * @returns {Promise<unknown>}
 */
function getHtml(id){
    return new Promise((resolve, reject) => {
        superagent.get(`https://movie.douban.com/celebrity/${id}/`)
            .end((err, res) => {
                if(!err) {
                    resolve(res.text);
                } else {
                    reject(err);
                }
            })
    })
}

/**
 * 根据给定html代码整理数据
 * @param html
 */
function getContent(actId, html) {
    let $ = cheerio.load(html);
    let describe = {
        id: actId
    };
    describe.actName = $('#wrapper #content > h1').text();
    describe.actImage = $('#wrapper .article #headline .pic img')[0].attribs.src;
    $('#wrapper .article #headline .info ul li').each(function(item) {
        let key = $(this).find('span').text().trim();
        let value = $(this).text().split(':')[1].trim();
        if(key == "性别"){
            describe.actSex = value;
        } else if(key == "星座"){
            describe.constellation = value;
        } else if(key == "出生日期"){
            describe.birthday = value;
        }else if(key == "出生地"){
            describe.birthplace = value;
        } else if(key == "职业") {
            describe.job = value;
        }
    });
    let introduction = [];
    if($("#wrapper .article #intro .bd .all").length == 1){
        $("#wrapper .article #intro .bd .all")[0].children.forEach(item => {
            if(item.data){
                introduction.push(item.data.trim())
            }
        });
    } else {
        $("#wrapper .article #intro .bd")[0].children.forEach(item => {
            if(item.data){
                introduction.push(item.data.trim())
            }
        });
    }
    describe.introduction = introduction;
    if($("#wrapper .article .mod .award").length){
        let award = [];
        $("#wrapper .article .mod .award").each(function(item) {
            let each = [];
            $(this).find('li').each(function(item) {
                each.push($(this).text().trim())
            });
            award.push(each);
        });
        describe.honor = award;
    }
    if($("#wrapper .article #recent_movies .bd .list-s").length) {
        let recent = [];
        $("#wrapper .article #recent_movies .bd .list-s li").each(function (item){
            let each = {
                img: $(this).find('.pic a img')[0].attribs.src,
                name: $(this).find('.info a').text().trim()
            };
            recent.push(each);
        });
        describe.recentProd = recent;
    }
    if($("#wrapper .article #best_movies .bd .list-s").length) {
        let best = [];
        $("#wrapper .article #best_movies .bd .list-s li").each(function (item){
            let each = {
                img: $(this).find('.pic a img')[0].attribs.src,
                name: $(this).find('.info a').text().trim()
            };
            best.push(each);
        });
        describe.famousProd = best;
    }
    return describe;
}


/**
 * 数据格式转化，转成存到数据库中的格式
 * @param data
 */
function saveToMySql(data) {
    let obj = {};
    obj.id = data.id;
    obj.actName = data.actName;
    obj.actImage = data.actImage;
    obj.actSex = data.actSex;
    obj.constellation = data.constellation;
    obj.birthday = data.birthday;
    obj.birthplace = data.birthplace;
    obj.job = data.job;
    obj.introduction = data.introduction.join('a\ta');
    data.honor.forEach(ele => {
        if(!obj.honor) {
            obj.honor = `${ele[0]}:${ele[1]}:${ele[2]};`
        } else {
            obj.honor += `${ele[0]}:${ele[1]}:${ele[2]};`
        }
    });
    data.recentProd.forEach(ele => {
        if(!obj.recentProd) {
            obj.recentProd = `${ele.name}:${ele.img};`;
        } else {
            obj.recentProd += `${ele.name}:${ele.img};`;
        }
    });
    data.famousProd.forEach(ele => {
        if(!obj.famousProd) {
            obj.famousProd = `${ele.name}:${ele.img};`;
        } else {
            obj.famousProd += `${ele.name}:${ele.img};`;
        }
    });
    return obj;
}

/**
 * 获取数据，该方法用在最后存取数据
 * @param name
 * @returns {Promise<unknown>}
 */
async function getData(name, id) {
    if(name) {
        let obj = await common.getObj(name);
        id = common.getMovieId(obj, name);
    }
    let html = await getHtml(id);
    let content = getContent(id, html);
    return content;
}


/**
 * 获取并存储演员信息数据
 * @param request
 * @param response
 */
function setActorContent(request, response) {//GET
    let params = url.parse(request.url, true).query;
    getData(params.actName, params.id).then(res => {
        let obj =  saveToMySql(res);
        //存到数据库
        actorInfoDao.setActorContent(obj.id, obj.actName, obj.actImage, obj.actSex, obj.constellation, obj.birthday, obj.birthplace, obj.job, obj.introduction, obj.honor, obj.recentProd, obj.famousProd, function (result) {
            if(result == null || result.length == 0){
                console.log('fail');
            } else {
                console.log('success');
            }
        });
        response.writeHead(200);
        response.write(JSON.stringify(res));
        response.end();
    }, err => {
        console.log(err);
        response.writeHead(200);
        response.write('noData');
        response.end();
    })
}


path.set("/api/setActorContent", setActorContent);

module.exports.path = path;
