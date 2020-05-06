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
            console.log(error);
            // throw new Error(error);
        }
    });
    connection.end();
}

module.exports = {
    "setMovieContent": setMovieContent
};