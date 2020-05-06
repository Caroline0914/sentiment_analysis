const  dbutil = require("./dbutil");

/**
 * 添加影评信息
 * @param mName
 * @param cName
 * @param grade
 * @param cTime
 * @param cTitle
 * @param content
 * @param upNum
 * @param downNum
 * @param recallNum
 */
function setMovieComment(mName, cName, grade, cTime, cTitle, content, upNum, downNum, recallNum, success) {
    let insertSql = "insert into commentInfo (mName, cName, grade, cTime, cTitle, content, upNum, downNum, recallNum) values(?, ?, ?, ?, ?, ?, ?, ?, ?);";
    let connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql, [mName, cName, grade, cTime, cTitle, content, upNum, downNum, recallNum], function (error, result) {
        if(error == null) {
            success(result);
        } else {
            console.log(error);
            // throw new Error(error);
        }
    });
    connection.end();
}

/**
 * 取评论
 * @param start 开始id
 * @param end 结束id
 * @param mName 电影名
 * @returns {Promise<unknown>}
 */
async function getComment(start, end, mName) {
    return new Promise((resolve, reject) => {
        let querySql = "select * from commentInfo where mName=? and id between ? and ?;";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(querySql, [mName, start, end], function (error, result) {
            if(error == null) {
                resolve(result);
            } else {
                reject(error);
                // throw new Error(error);
            }
        });
        connection.end();
    })
}



module.exports = {
    "setMovieComment": setMovieComment,
    "getComment": getComment
};