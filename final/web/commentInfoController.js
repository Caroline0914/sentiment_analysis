const commentInfoDao = require('../dao/commentInfoDao');
const common = require('./tools/common');
const url = require('url');
const Sentiment = require('sentiment');
const nodejieba = require('nodejieba');

let sentiment = new Sentiment();


const path = new Map();

const cheerio = require('cheerio');
const superagent = require('superagent');


/**
 * 获取评论页面
 * @param id 电影id
 * @param start 页面起始评论索引
 */
function getMovieCommentHTML(id, start) {
    return new Promise((resolve, reject) => {
        superagent.get(`https://movie.douban.com/subject/${id}/reviews?start=${start}`)
            .end(function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.text);
                }
            });
    })
}

/**
 * 获取评论内容(不完整)
 * @param html 页面代码
 * @returns {[]} 返回数据
 */
function getComment(html) {
    let $ = cheerio.load(html);
    let content = [];
    $('.article .review-list > div').each(function () {
        let obj = {};
        obj.id = $(this)[0].attribs['data-cid'];
        obj.cName = $(this).find('.main-hd .name').text().trim();
        obj.grade = $(this).find('.main-hd span')[0].attribs['title'] || "无";
        obj.time = $(this).find('.main-hd .main-meta').text().trim();
        obj.title = $(this).find('.main-bd h2').text().trim();
        obj.upNum = $(this).find('.main-bd .action .up').text().trim();
        obj.downNum = $(this).find('.main-bd .action .down').text().trim();
        obj.recallNum = $(this).find('.main-bd .action .reply').text().trim().replace(/\D/g, '');
        content.push(obj);
    });
    return content;
}

/**
 * 获取完整评论内容
 * @param id 评论id
 */
function getFullComment(id) {
    return new Promise((resolve, reject) => {
        superagent.get(`https://movie.douban.com/j/review/${id}/full`)
            .end(function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    setTimeout(() => {
                        resolve(cleanComment(res.text));
                    }, 0)
                }
            });
    })
}

/**
 * 清洗评论
 * @param comment 接口直接访问得到的数据
 */
function cleanComment(comment) {
    let $ = cheerio.load(JSON.parse(comment).body);
    let contArr = [];
    $('p').each(function () {
        if(!$(this)[0].attribs['class'] && $(this).text().trim() != '') {
            contArr.push($(this).text().trim());
        }
    });
    return contArr;
}


/**
 * 随机时间间隔
 * @returns {number}
 */
function getDuration() {
    return Math.floor(Math.random() * 2000) + 4000;
}

/**
 * 获取评论页面不完整评论
 * @param name 电影名
 * @param start 起始页
 * @returns {Promise<{id: *, content: *}>}
 */
async function final(name, id, start) {
    if(!id) {
        let obj = await common.getObj(name);
        id = common.getMovieId(obj, name);
    }
    let comHtml = await getMovieCommentHTML(id, start);
    let content = getComment(comHtml);
    return {
        id: id,
        allContent: content
    }
}

/**
 * 获取完整评论
 * @param name 电影名
 * @param start 起始页
 * @returns {Promise<*[]>}
 */
async function exec(name, id, start) {
    let con = await final(name, id, start);
    con.allContent[0].content = await getFullComment(con.allContent[0].id);
    con.allContent = con.allContent.splice(0, 1);
    // con[1].content = await getFullComment(con[1].id);
    // con[2].content = await getFullComment(con[2].id);
    // con[3].content = await getFullComment(con[3].id);
    // con[4].content = await getFullComment(con[4].id);
    // con[5].content = await getFullComment(con[5].id);
    // con[6].content = await getFullComment(con[6].id);
    // con[7].content = await getFullComment(con[7].id);
    // con[8].content = await getFullComment(con[8].id);
    // con[9].content = await getFullComment(con[9].id);
    // con[10].content = await getFullComment(con[10].id);
    // con[11].content = await getFullComment(con[11].id);
    // con[12].content = await getFullComment(con[12].id);
    // con[13].content = await getFullComment(con[13].id);
    // con[14].content = await getFullComment(con[14].id);
    // con[15].content = await getFullComment(con[15].id);
    // con[16].content = await getFullComment(con[16].id);
    // con[17].content = await getFullComment(con[17].id);
    // con[18].content = await getFullComment(con[18].id);
    // con[19].content = await getFullComment(con[19].id);
    return con;
}

// exec("天气之子", '', 0).then(res => {
//     // console.log(res);
// }, err => {
//     console.log(err);
// });

/**
 * 获取并存储影评信息
 * @param response
 * @param request
 */
function setComment(request, response) {//GET
    let params = url.parse(request.url, true).query;
    exec(params.mName, params.id, params.start).then(res => {
        // 存数据库
        res.allContent.forEach((item) => {
            commentInfoDao.setMovieComment(item.id, res.id, item.cName, item.grade, item.time, item.title, item.content.join("a\ta"), +item.upNum, +item.downNum, +item.recallNum, function (result) {
                if(result == null || result.length == 0){
                    console.log('fail');
                } else {
                    console.log('success');
                }
            })
        });
        response.writeHead(200);
        response.write(JSON.stringify(res));
        response.end();
    }, err => {
        console.log(err);
    })
}


path.set("/api/setComment", setComment);

/**
 * 获取随机评论和分析结果
 * @param request
 * @param response
 */
function getRandomCommentAndSentiment(request, response) {//GET
    commentInfoDao.getCommentCount().then(res => {
        return res;
    }, err => {
        console.log(err);
    }).then(res => {
        commentInfoDao.getRandomComment(res).then(data => {
            let result = {};
            let length = data.length;
            let single = data[Math.floor(Math.random() * length)];
            result.mName = single.mName;
            result.content = single.content;
            result.sentimentResult = sentiment.analyze(single.content);
            response.writeHead(200);
            response.write(JSON.stringify(result));
            response.end();
        }, err => {
            console.log(err);
        })
    }, err => {
        console.log(err)
    })
}

path.set('/api/getRandomCommentAndSentiment', getRandomCommentAndSentiment);


/**
 * 获取随机评论和分词结果
 * @param request
 * @param response
 */
function getRandomCommentAndwords(request, response) {
    // commentInfoDao.getCommentCount().then(res => {
    //     return res;
    // }, err => {
    //     console.log(err);
    // }).then(res => {
    //     commentInfoDao.getRandomComment(res).then(data => {
        commentInfoDao.getRandomComment(0).then(data => {
            let result = {};
            let length = data.length;
            let single = data[Math.floor(Math.random() * length)];
            result.commentId = single.id;
            result.cName = single.cName;
            result.cTime = single.cTime;
            result.mName = single.mName;
            result.content = single.content;
            words = nodejieba.cut(single.content.split("a\ta")
                .join("")
                .replace(/\n/g, '')
                .replace(/[.,!?$%\^&\*;:{}=_`\"~()。，？！：\/（）“”‘’；#￥……——0-9]/g, '')
                .replace(/\s\s+/g, ''), true);
            keyWord = nodejieba.extract(single.content.split("a\ta").join(""), 100000000).map(item => item.word);
            result.words = words.filter(item => keyWord.includes(item));
            response.writeHead(200);
            response.write(JSON.stringify(result));
            response.end();
        }, err => {
            console.log(err);
        })
    // }, err => {
    //     console.log(err);
    //     response.writeHead(200);
    //     response.write("noData");
    //     response.end();
    // })
}

path.set('/api/getRandomCommentAndwords', getRandomCommentAndwords);

module.exports.path = path;