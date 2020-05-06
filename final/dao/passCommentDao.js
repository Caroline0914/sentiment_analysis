const dbutil = require('./dbutil');

/**
 * 设置已经分词过的评论
 * @param commentId 评论id
 * @param mName 电影名
 * @param cName 评论人昵称
 * @param cTime 评论时间
 * @returns {Promise<unknown>}
 */
async function setItem(commentId, mName, cName, cTime) {
    return new Promise((resolve, reject) => {
        let insertSql = "insert into passComment (commentId, mName, cName, cTime) values (?, ?, ?, ?);";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(insertSql, [commentId, mName, cName, cTime], function (error, result) {
            if(error == null) {
                resolve(result);
            } else {
                reject(error);
            }
        });
        connection.end();
    })
}


module.exports = {
    "setItem": setItem
};
