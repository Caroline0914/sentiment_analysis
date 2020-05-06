const searchHistoryDao = require('../dao/searchHistoryDao');
const url = require('url');

let path = new Map();


/**
 * 获取历史记录
 * @param request
 * @param response
 */
function getSearchWord(request, response) {//GET
    let params = url.parse(request.url, true).query;
    searchHistoryDao.getSearchWord(params.username).then(res => {
        response.writeHead(200);
        response.write(JSON.stringify(res));
        response.end();
    }, err => {
        console.log(err);
    })
}
path.set('/api/getSearchWord', getSearchWord);


/**
 * 添加记录
 * @param request
 * @param response
 */
function setHistory(request, response) {
    let params = url.parse(request.url, true).query;
    searchHistoryDao.setHistory(params.username, params.word).then(res => {
        if(res.affectedRows == 1) {
            response.writeHead(200);
            response.write("success");
            response.end();
        }
    }, err => {
        console.log(err);
    })
}
path.set('/api/setHistory', setHistory);

module.exports.path = path;