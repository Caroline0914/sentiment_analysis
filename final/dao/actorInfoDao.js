const dbutil = require('./dbutil');

/**
 * 存演员信息
 * @param id
 * @param actName
 * @param actImage
 * @param actSex
 * @param constellation
 * @param birthday
 * @param birthPlace
 * @param job
 * @param introduction
 * @param honor
 * @param recentProd
 * @param famousProd
 * @param success
 */
function setActorContent(id, actName, actImage, actSex, constellation, birthday, birthPlace, job, introduction, honor, recentProd, famousProd, success) {
    let insertSql = "insert into actorInfo (id, actName, actImage, actSex, constellation, birthday, birthPlace, job, introduction, honor, recentProd, famousProd) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    let connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql, [id, actName, actImage, actSex, constellation, birthday, birthPlace, job, introduction, honor, recentProd, famousProd], function (error, result) {
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
    "setActorContent": setActorContent
};