const movieInfoDao = require('../dao/movieInfoDao');
const common = require('./tools/common');

const url = require('url');
const https = require('https');
const cheerio = require('cheerio');
const superagent = require('superagent');

const path = new Map();



/**
 * 获取电影详情页面html
 * @param movieId 电影id
 */
function getMovieContent(movieId) {
    return new Promise((resolve, reject) => {
        superagent.get(`https://movie.douban.com/subject/${movieId}/`)
            .end(function (err, res) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(filterMovieContent(movieId, res.text));
                }
            });
    })
}

/**
 * 筛选电影信息并返回，数据格式为JSON，数据返回给前端
 * @param html 电影详情页面代码
 */
function filterMovieContent(movieId, html) {
    let $ = cheerio.load(html);
    let describe = {
        id: movieId,
        prize: []
    };
    let prevDescribe = JSON.parse($('script[type="application/ld+json"]').html());
    describe.name = prevDescribe.name;//电影名
    describe.director = prevDescribe.director;//导演
    describe.author = prevDescribe.author;//编剧
    describe.actor = prevDescribe.actor;//演员
    describe.datePublished = prevDescribe.datePublished;//上映时间
    describe.genre = prevDescribe.genre;//类型
    describe.image = prevDescribe.image;//图片地址(绝对路径)
    $('.article .subjectwrap .subject #info > .pl').each(function () {
        if($(this).text().indexOf("制片国家/地区") >= 0) {
            describe.country = $(this)[0].next.data
        } else if($(this).text().indexOf("语言") >= 0) {
            describe.language = $(this)[0].next.data
        } else if($(this).text().indexOf("片长") >= 0) {
            describe.mTime = $(this).next().text()
        }
    });
    describe.plot = $('.article .related-info .indent span[property="v:summary"]').text().trim().split("\n").map(ele => {//剧情简介
        return ele.trim();
    }).filter(ele =>{
        return ele.trim();
    });
    $('.article .mod .award').each(function () {//获奖情况
        let arr = [];
        $(this).find('li').each(function () {
            arr.push($(this).text().trim());
        });
        describe.prize.push(arr);
    });
    return describe;
}


/**
 * 将数据转成数据库存储的数据格式
 * @param data
 */
function saveToMySql(data) {
    let obj = {};
    obj.id = data.id;
    obj.mName = data.name;
    obj.mDate = data.datePublished;
    obj.country = data.country;
    obj.language = data.language;
    obj.mTime = data.mTime;
    obj.image = data.image;
    data.prize.forEach(ele => {
        if(!obj.prize) {
            obj.prize = `${ele[0]}:${ele[1]}:${ele[2]};`;
        } else {
            obj.prize += `${ele[0]}:${ele[1]}:${ele[2]};`;
        }
    });
    function commonFn(data) {
        data.forEach(ele => {
            if(!obj.director) {
                obj.director = `${ele.name};`
            } else {
                obj.director += `${ele.name};`
            }
        });
    }
    commonFn(data.director);
    commonFn(data.author);
    commonFn(data.actor);
    data.genre.forEach(ele => {
        if(!obj.mType) {
            obj.mType = `${ele};`
        } else {
            obj.mType += `${ele};`
        }
    });
    data.plot.forEach(ele => {
        if(!obj.plot) {
            obj.plot = `${ele}\t`
        } else {
            obj.plot += `${ele}\t`
        }
    });
    return obj;
}

/**
 * 获取最终数据
 * @param movieName 电影名
 * @returns {Promise<unknown>}
 */
async function getData(movieName, id) {
    let movieId = id;
    if(movieName) {
        let obj = await common.getObj(movieName);
        movieId = common.getMovieId(obj, movieName);
    }
    let content = await getMovieContent(movieId);
    return content;
}


/**
 * 获取并存储电影详情数据
 * @param request
 * @param response
 */
function setMovieContent(request, response) {//GET
    let params = url.parse(request.url, true).query;
    getData(params.movieName, params.id).then(res => {
        let obj =  saveToMySql(res);
        // console.log(res);
        //存到数据库
        // movieInfoDao.setMovieContent(obj.id, obj.mName, obj.director, obj.author, obj.coreActor, obj.mType, obj.country, obj.language, obj.mDate, obj.mTime, obj.plot, obj.prize, obj.image, function (result) {
        //     if(result == null || result.length == 0){
        //         console.log('fail');
        //     } else {
        //         console.log('success');
        //     }
            response.writeHead(200);
            response.write(JSON.stringify(res));
            response.end();
        // })
    }, err => {
        console.log(err);
    });
}


path.set("/api/setMovieContent", setMovieContent);


module.exports.path = path;

















// function getHtml(url, success) {
//     superagent.get(url)
//         .set("Connection", "keep-alive")
//         .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36")
//         .end(function (err, res) {
//             if (err) {
//                 return err;
//             } else {
//                 return success(res.text);
//             }
//         });
// }
// getHtml('https://www.douban.com/search?q=%E5%B0%91%E5%B9%B4%E7%9A%84%E4%BD%A0', function (res) {
//     console.log(res)
// });