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
function setMovieComment(id, mName, cName, grade, cTime, cTitle, content, upNum, downNum, recallNum, success) {
    let insertSql = "insert into commentInfo (id, mName, cName, grade, cTime, cTitle, content, upNum, downNum, recallNum) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    let connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql, [id, mName, cName, grade, cTime, cTitle, content, upNum, downNum, recallNum], function (error, result) {
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
function getComment(start, end, mName) {
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

/**
 * 获取影评总数
 * @returns {Promise<unknown>}
 */
function getCommentCount(){
    return new Promise((resolve, reject) => {
        let count = "select count(1) from commentInfo;";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(count, function (error, result) {
            if(error == null) {
                resolve(result[0]['count(1)']);
            } else {
                reject(error);
                // throw new Error(error);
            }
        });
        connection.end();
    })
}

/**
 * 获取随机评论
 * @param all 评论总数
 * @returns {Promise<unknown>}
 */
function getRandomComment(all) {
    return new Promise((resolve, reject) => {
        // let from = Math.floor(Math.random() * all);
        // let to = from + 100;
        // let querySql = "select id, mName, content, cName, cTime from commentInfo where id between ? and ?;";
        let querySql = "select * from commentInfo where id > 10000;";
        let connection = dbutil.createConnection();
        connection.connect();
        // connection.query(querySql, [from, to], function (error, result) {
        connection.query(querySql, function (error, result){
            if(error == null) {
                resolve(result);
            } else {
                reject(error);
                // throw new Error(error);
            }
        });
        connection.end()
    })
}


module.exports = {
    "setMovieComment": setMovieComment,
    "getComment": getComment,
    "getCommentCount": getCommentCount,
    "getRandomComment": getRandomComment
};