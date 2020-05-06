const dbutil = require('./dbutil');

/**
 * 获取相同评论
 * @param mName 电影名
 * @returns {Promise<unknown>}
 */
async function getSameComment(mName) {
    return new Promise((resolve, reject) => {
        let querySql = "select * from sameComment where mName=?;";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(querySql, [mName], function (error, result) {
            if(error == null) {
                resolve(result);
            } else {
                reject(error);
                // throw new Error(error);
            }
        });
        connection.end();
    });
}

/**
 * 返回需要计算的评论
 * @param mName 电影名
 * @returns {Promise<unknown>}
 */
async function getAddComment(mName) {
    return new Promise((resolve, reject) => {
        let querySql = "select * from sameComment where mName=? group by flag;";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(querySql, mName, function (error, result) {
            if(error == null) {
                resolve(result);
            } else {
                reject(error);
                // throw new Error(error);
            }
        });
        connection.end();
    });
}


module.exports = {
    "getSameComment": getSameComment,
    "getAddComment": getAddComment
};