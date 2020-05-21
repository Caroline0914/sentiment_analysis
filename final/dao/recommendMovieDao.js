const dbutil = require('./dbutil');

/**
 * 获取前十电影id
 * @param username
 * @returns {Promise<unknown>}
 */
function getMovieId(username) {
    return new Promise((resolve, reject) => {
        let querySql = "select movieId from recommendMovie where username = ? order by sameLevel desc limit 0, 10;";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(querySql, username, function (error, result) {
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
 * 获取电影详情信息
 * @param id 电影ID
 * @returns {Promise<unknown>}
 */
function getRecommendMovie(id){
    return new Promise((resolve, reject) => {
        let querySql = "select * from movieInfo where id = ?";
        let connection = dbutil.createConnection();
        connection.query(querySql, id, function (error, result) {
            if(error == null) {
                resolve(result);
            } else {
                reject(error);
            }
        });
        connection.end();
    })
}



/**
 * 设置推荐电影
 * @param username
 * @param movieId
 * @param sameLevel
 * @returns {Promise<unknown>}
 */
function setRecommendMovie(username, movieId, sameLevel) {
    return new Promise((resolve, reject) => {
        let insertSql = "insert into recommendMovie (`username`, `movieId`, `sameLevel`) values (?, ?, ?);";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(insertSql, [username, movieId, sameLevel], function (error, result) {
            if(error == null) {
                resolve(result);
            } else {
                reject(error);
            }
        });
        connection.end();
    })
}

/**
 * 删除推荐电影
 * @param username
 */
function deleteMovie(username) {
    return new Promise((resolve, reject) => {
        let deleteSql = "delete from recommendMovie where username = ?;";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(deleteSql, username, function (error, result) {
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
    "getRecommendMovie": getRecommendMovie,
    "setRecommendMovie": setRecommendMovie,
    "getMovieId": getMovieId,
    "deleteMovie": deleteMovie
};