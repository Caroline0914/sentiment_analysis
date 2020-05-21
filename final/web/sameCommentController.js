const sameCommentDao = require('../dao/sameCommentDao');
const url = require('url');

const path = new Map();


/**
 * 根据flag获取影评
 * @param request
 * @param response
 */
function getCommentByFlag(request, response) {//GET
    let params = url.parse(request.url, true).query;
    sameCommentDao.getCommentByFlag(params.mName, params.flag).then(res => {
        response.writeHead(200);
        response.write(JSON.stringify(res));
        response.end();
    }, err => {
        console.log(err);
    })
}
path.set('/api/getCommentByFlag', getCommentByFlag);


module.exports.path = path;