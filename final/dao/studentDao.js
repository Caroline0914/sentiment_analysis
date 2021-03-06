var dbutil = require("./dbutil");

function queryAllStudent(success) {
    var querySql = "select * from student;";
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, function (error, result) {
        if(error == null) {
            console.log(result);
            success(result);
        } else {
            throw new Error(error);
        }
    });
    connection.end();
}

function insertStudent(stuNum, name, age, stuClass, password, success) {
    var insertSql = "insert into student(stu_num, name, age, class, password) values(?, ?, ?, ?, ?);";
    var params = [stuNum, name, age, stuClass, password];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql, params, function (error, result) {
        if(error == null) {
            console.log(result);
            success(result);
        } else {
            throw new Error(error);
        }
    });
    connection.end();
}

function queryStudentByStuNum(stuNum, success) {
    var querySql = "select * from student where stu_num = ?;";
    var params = [stuNum];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, params, function (error, result) {
        if(error == null) {
            console.log(result);
            success(result);
        } else {
            throw new Error(error);
        }
    });
    connection.end();
}

module.exports = {
    "queryAllStudent": queryAllStudent,
    "insertStudent": insertStudent,
    "queryStudentByStuNum": queryStudentByStuNum
};