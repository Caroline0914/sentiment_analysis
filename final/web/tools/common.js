const tool = require('./tool');

const https = require('https');

/**
 * 返回电影(演员)页面中搜索词访问返回结果
 * @param name 电影名或演员名
 */

function getObj(name) {
    return new Promise((resolve, reject) => {
        https.get(`https://movie.douban.com/j/subject_suggest?q=${name}`, {
        // https.get(`https://www.douban.com/search?cat=1002&q=${name}`, {
            headers: {
                "Connection": "keep-alive",
                "User-Agent": tool.getUserAgent()
            }
        }, function(res) {
            // let html = '';
            res.on('data', function (data) {
                resolve(JSON.parse(data.toString()))
                // html += data.toString();
            });
            // res.on('end', function () {
            //     resolve(JSON.parse(html));
            // })
        })
    });
}


/**
 * 根据结果筛选id并返回
 * @param obj 返回信息
 * @param name 电影名
 */
function getMovieId(obj, name) {
    let id;
    obj.forEach(item => {
        if(!id && (item.title === name || item.sub_title === name)){
            id = item.id;
        }
    });
    return id;
}


module.exports = {
    getObj,
    getMovieId
};