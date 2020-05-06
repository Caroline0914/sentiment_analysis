const studentDao = require("../dao/studentDao");
const url = require("url");

const path = new Map();

function queryAllStudent(request, response) {
    studentDao.queryAllStudent(function (result) {
        response.writeHead(200);
        response.write(JSON.stringify(result));
        response.end();
    });
}
path.set("/api/queryAllStudent", queryAllStudent);

function insertStudent(request, response) {
    let params = url.parse(request.url, true).query;
    studentDao.insertStudent(params.stuNum, params.name, params.age, params.stuClass, params.password, function () {
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        response.write("添加成功");
        response.end();
    })
}
path.set("/insertStudent", insertStudent);

function doLogin(request, response) {
    let params = url.parse(request.url, true).query;
    studentDao.queryStudentByStuNum(params.stuNum, function (result) {
        console.log(params)
        if(result && result.length > 0 && result[0].password == params.password) {
            // 写cookie
            response.cookie("id", result[0].id);
            // 重定向
            response.redirect("/queryAllStudent");
        } else {
            response.redirect("/loginError.html");
        }
    })
}
path.set("/doLogin", doLogin);

// module.exports.path = path;