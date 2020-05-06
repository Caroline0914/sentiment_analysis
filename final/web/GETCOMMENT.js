const commentInfoDao = require('../dao/commentInfoDao');
const common = require('./tools/common');
const url = require('url');
const https = require('https');

const path = new Map();

const cheerio = require('cheerio');
const superagent = require('superagent');


/**
 * 获取评论页面(异步)
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
 * 获取评论内容(评论内容不完整)
 * @param html 页面代码
 * @returns {[]} 返回数据
 */
function getComment(html) {
    let $ = cheerio.load(html);
    let content = [];
    $('.article .review-list > div').each( function() {
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
                    }, getDuration())
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

//寄生虫id：27010768

async function final(id, start) {
    // let obj = await common.getObj(name);
    // let id = common.getMovieId(obj, name);
    let comHtml = await getMovieCommentHTML(id, start);
    let content = getComment(comHtml);
    return content;
}

async function exec(start) {
    // let con = await final("27010768", start);
    // con[0].content = await getFullComment(con[0].id);
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

// exec(3300).then(res=> {
//     console.log(res);
    // res.forEach((item) => {
    //     commentInfoDao.setMovieComment("寄生虫", item.cName, item.grade, item.time, item.title, item.content.join("a\ta"), +item.upNum, +item.downNum, +item.recallNum, function (result) {
    //         if(result == null || result.length == 0){
    //             console.log('fail');
    //         } else {
    //             console.log('success');
    //         }
    //     })
    // })
//     for(let i = 3; i < 4; i++) {
//         commentInfoDao.setMovieComment("寄生虫", res[i].cName, res[i].grade, res[i].time, res[i].title, res[i].content.join("a\ta"), +res[i].upNum, +res[i].downNum, +res[i].recallNum, function (result) {
//             if(result == null || result.length == 0){
//                 console.log('fail');
//             } else {
//                 console.log('success');
//             }
//         })
//     }
// }, err => {
//     console.log(err);
// });



/**
 * 随机时间间隔
 * @returns {number}
 */
function getDuration() {
    return Math.floor(Math.random() * 2000) + 4000;
}


