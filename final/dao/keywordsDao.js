const dbutil = require('./dbutil');

async function setKeyword(mName, word, addNum){
    return new Promise((resolve, reject) => {
        let updateSql =  "INSERT INTO keywords (mName, word, num) values(?, ?, ?) ON DUPLICATE KEY UPDATE num = num + ?;";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(updateSql, [mName, word, addNum, addNum], function (error, result) {
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

async function getKeyword(mName, num){
    return new Promise((resolve, reject) => {
        let querySql = "select word, num from keywords where mName = ? and num >= ?;"
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(querySql, [mName, num], function (error, result) {
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
    "setKeyword": setKeyword,
    "getKeyword": getKeyword
};