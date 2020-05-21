const dbutil = require('./dbutil');

/**
 * 获取历史记录
 * @param username
 * @returns {Promise<unknown>}
 */
function getSearchWord(username) {
    return new Promise((resolve, reject) => {
        let querySql = "select * from searchHistory where username = ? order by searchTime desc;";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(querySql, username, function (error, result) {
            if(error == null) {
                resolve(result);
            } else {
                // console.log(error);
                reject(error);
            }
        });
        connection.end();
    })
}


/**
 * 设置记录
 * @param username
 * @param word
 * @returns {Promise<void>}
 */
function setHistory(username, word, flag) {
    return new Promise((resolve, reject) => {
        let insertSql = "insert into searchHistory(username, searchWord, searchTime, flag) values (?, ?, NOW(), ?);";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(insertSql, [username, word, flag], function (error, result) {
            if(error == null) {
                resolve(result);
            } else {
                // console.log(error);
                reject(error);
            }
        });
        connection.end();
    })
}

/**
 * 删除历史记录
 * @param username 用户名
 * @param searchTime 搜索时间
 * @returns {Promise<unknown>}
 */
function deleteHistory(username, searchTime){
    return new Promise((resolve, reject) => {
        let deleteSql = "delete from searchHistory where username = ? and searchTime = ?;";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(deleteSql, [username, searchTime], function (error, result) {
            if(error == null) {
                resolve(result);
            } else {
                // console.log(error);
                reject(error);
            }
        });
        connection.end();
    })
}

module.exports = {
    "getSearchWord": getSearchWord,
    "setHistory": setHistory,
    "deleteHistory": deleteHistory
};