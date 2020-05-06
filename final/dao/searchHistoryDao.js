const dbutil = require('./dbutil');

/**
 * 获取历史记录
 * @param username
 * @returns {Promise<unknown>}
 */
async function getSearchWord(username) {
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
async function setHistory(username, word) {
    return new Promise((resolve, reject) => {
        let insertSql = "insert into searchHistory(username, searchWord, searchTime) values (?, ?, NOW());";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(insertSql, [username, word], function (error, result) {
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
    "setHistory": setHistory
};