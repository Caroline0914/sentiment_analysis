const dbutil = require('./dbutil');

/**
 * 存电影信息
 * @param id 电影id
 * @param mName 电影名
 * @param director 导演
 * @param scriptWriter 编剧
 * @param coreActor 演员
 * @param mType 电影类型
 * @param country 国家
 * @param language 语言
 * @param mDate 上映时间
 * @param mTime 片长
 * @param plot 情节
 * @param prize 获奖情况
 * @param image 图片
 * @param success 成功回调
 */
function setMovieContent(id, mName, director, author, coreActor, mType, country, language, mDate, mTime, plot, prize, image, success) {
    let insertSql = "insert into movieInfo (id, mName, director, author, coreActor, mType, country, language, mDate, mTime, plot, prize, image) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    let connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql, [id, mName, director, author, coreActor, mType, country, language, mDate, mTime, plot, prize, image], function (error, result) {
        if(error == null) {
            success(result);
        } else {
            // console.log(error);
            // throw new Error(error);
        }
    });
    connection.end();
}

/**
 * 通过电影名获取电影信息
 * @param mName 电影名
 * @returns {Promise<unknown>}
 */
function getMovieByName(mName){
    return new Promise((resolve, reject) => {
        let querySql = "select * from movieInfo where mName = ?;";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(querySql, mName, function (error, result) {
            if(error == null) {
                resolve(result[0]);
            } else {
                reject(error);
            }
        });
        connection.end();
    })
}

/**
 * 根据包含字段获取电影
 * @param item
 * @param like
 * @returns {Promise<unknown>}
 */
function getMovieByLike(item, like) {
    return new Promise((resolve, reject) => {
        let querySql;
        like = `%${like}%`;
        if(item == 'coreActor'){
            querySql = "select * from movieInfo where coreActor like ?;";
        } else if(item == 'director') {
            querySql = "select * from movieInfo where director like ?;";
        } else if(item == 'author') {
            querySql = "select * from movieInfo where author like ?;"
        }
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(querySql, [like], function (error, result) {
            if(error == null) {
                resolve(result);
            } else {
                reject(error);
            }
        });
        connection.end();
    })
}

// getMovieByLike('coreActor', '%小罗伯特·唐尼RobertDowneyJr.%').then(res => {
//     console.log(res);
// }, err => {
//     console.log(err);
// });


module.exports = {
    "setMovieContent": setMovieContent,
    "getMovieByName": getMovieByName,
    "getMovieByLike": getMovieByLike
};