const nodejieba = require('nodejieba');
const url = require('url');
const keywordsDao = require('../dao/keywordsDao');
const commentInfoDao = require('../dao/commentInfoDao');
const sameCommentDao = require('../dao/sameCommentDao');
const passCommentDao = require('../dao/passCommentDao');

const path = new Map();

/**
 * 获取需要进行分词的评论
 * @param mName 电影名
 * @param start 开始id
 * @param end 结束id
 * @returns {Promise<void>}
 */
let sameComment;
async function getComment(mName, start, end) {
    let allComment = await commentInfoDao.getComment(start, end, mName);
    sameComment = sameComment || await sameCommentDao.getSameComment(mName);
    allComment = allComment.filter(item => {
        let flag = true;
        sameComment.forEach(ele => {
            if(item.cName === ele.cName && item.cTime === ele.cTime){
                flag = false;
            }
        });
        return flag;
    });
    return allComment;
}

/**
 * 分词并存储
 * @param mName 电影名
 * @param start 开始id
 * @param end 结束id
 */
function separate(mName, start, end) {
    getComment(mName, start, end).then(res => {
        res.forEach(item => {
            let extract = nodejieba.extract(item.content.split("a\ta").join(""), 100000000);
            extract.forEach(ele => {
                if(nodejieba.tag(ele.word).length === 1) {
                    let times = item.content.match(new RegExp(ele.word, "g")) && item.content.match(new RegExp(ele.word, "g")).length;
                    // console.log(ele.word, times);
                    times && keywordsDao.setKeyword(mName, ele.word, times).then(res => {
                        // console.log(res);
                    }, err => {
                        console.log(err);
                    });
                }
            });
            passCommentDao.setItem(item.id, mName, item.cName, item.cTime).then(res => {
                // console.log(res);
            }, err => {
                console.log(err);
            })
        });
    }, err => {
        console.log(err);
    })
}

/**
 * 获取词云图数据
 * @param request
 * @param response
 */
function getKeyword(request, response) {//GET
    let params = url.parse(request.url, true).query;
    keywordsDao.getKeyword(params.mName, params.num).then(res => {
        let data = [];
        res.forEach(ele => {
            let obj = {};
            obj.name = ele.word;
            obj.num = ele.num;
            obj.weight = getWeight(ele.num);
            data.push(obj);
        });
        response.writeHead(200);
        response.write(JSON.stringify(data));
        response.end();
    }, err => {
        console.log(err);
    })
}

path.set("/api/getKeyword", getKeyword);

/**
 * 获取weight
 * @param num 出现次数
 * @returns {number} weight
 */
function getWeight(num) {
    let weight;
    switch (true) {
        case num >= 10000:
            weight = 4;
            break;
        case num >= 5000 && num < 10000:
            weight = 3.5;
            break;
        case num >= 3000 && num < 5000:
            weight = 3;
            break;
        case num >= 2000 && num < 3000:
            weight = 2.5;
            break;
        case num >= 1000 && num < 2000:
            weight = 2;
            break;
        case num >= 700 && num < 1000:
            weight = 1.5;
            break;
        case num >= 500 && num < 700:
            weight = 1;
            break;
    }
    return weight;
}

// async function test(mName, start, end) {
//     // for(let i = start; i <= end; i++) {
//     //     console.log(i);
//     //     await separate(mName, i, i);
//     // }
//     await separate(mName, start, start);
//     await separate(mName, start + 1, start + 1);
//     await separate(mName, start + 2, start + 2);
//     await separate(mName, start + 3, start + 3);
//     await separate(mName, start + 4, start + 4);
//     await separate(mName, start + 5, start + 5);
//     await separate(mName, start + 6, start + 6);
//     await separate(mName, start + 7, start + 7);
//     await separate(mName, start + 8, start + 8);
//     await separate(mName, start + 9, start + 9);
// }

// test("寄生虫", 6411, 10).then(res => {
//     // console.log(res);
// }, err => {
//     console.log(err);
// });

module.exports.path = path;

