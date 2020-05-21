const userInfoDao = require('../dao/userInfoDao');
const url = require('url');
const crypto = require('crypto-js');

// let res = crypto.MD5('123456').toString();


const path = new Map();

/**
 * 登录处理 POST
 * @param request
 * @param response
 */
function doLogin (request, response) {//POST
    request.on("data", function (data) {
        let obj = JSON.parse(data.toString());
        let username = obj.username;
        let password = obj.password;
        let pwdMD5 = crypto.MD5(password).toString();
        userInfoDao.doLogin(username, pwdMD5, function (result, error) {
            let res = {
                ...result[0]
            };
            if(result == null || result.length == 0 || error){
                res.flag = "fail";
            } else {
                if(result[0]){
                    res.flag = "success";
                }
            }
            response.writeHead(200);
            response.write(JSON.stringify(res));
            response.end();
        })
    })
}

path.set("/api/doLogin", doLogin);

/**
 * 获取验证码 GET
 * @param request
 * @param response
 */
let verification = '';
function getVerificationCode(request, response) {// GET
    if(verification.length > 0) verification = "";
    let collection = "a,b,c,d,e,f,g,h,i,j,k,m,n,p,q,r,s,t,u,v,w,x,y,z,A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
    let aCode = collection.split(",");
    let aLength = aCode.length;
    for(let i = 0; i < 4; i++) {
        let random = Math.floor(Math.random() * aLength);
        verification += aCode[random];
    }
    // console.log(verification);
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    response.write(verification);
    response.end();
}
path.set("/api/getVerificationCode", getVerificationCode);

/**
 * 判断验证码是否正确 POST
 * @param request
 * @param response
 */
function checkVerificationCode(request, response) {//POST
    request.on("data", function (data) {
        let obj = JSON.parse(data.toString());
        if(obj.verificationCode.toLowerCase()== verification.toLowerCase()){
            response.writeHead(200);
            response.write('success');
            response.end();
        } else {
            response.writeHead(200);
            response.write("fail");
            response.end();
        }
    })
}
path.set("/api/checkVerificationCode", checkVerificationCode);
/**
 * 注册处理 POST
 * @param request
 * @param response
 */
function doRegister(request, response) {//POST
    request.on("data", function (data) {
        let obj = JSON.parse(data.toString());
        let username = obj.username;
        let password = obj.password;
        let pwdMD5 = crypto.MD5(password).toString();
        let phone = obj.phone;
        userInfoDao.doRegister(username, pwdMD5, phone, function (result, error) {
            let res = '';
            if(result == null || result.length == 0 || error){
                res = 'fail';
            } else {
                res = 'success';
            }
            response.writeHead(200);
            response.write(res);
            response.end();
        })
    })
}
path.set("/api/doRegister", doRegister);

/**
 * 判断用户名是否已存在 GET
 * @param request
 * @param response
 */
function checkHasUser(request, response) {// GET
    let params = url.parse(request.url, true).query;
    userInfoDao.checkHasUser(params.username, function (result) {
        let res = "";
        if(result == null || result.length == 0) {
            res = "success";
        } else if(result.length > 0){
            res = "fail";
        } else {
            res = "error";
        }
        response.writeHead(200);
        response.write(res);
        response.end();
    })
}
path.set("/api/checkHasUser", checkHasUser);

/**
 * 获取用户信息
 * @param request
 * @param response
 */
function getUserInfo(request, response) {//GET
    let parmas = url.parse(request.url, true).query;
    userInfoDao.getUserInfo(parmas.username).then(res => {
        response.writeHead(200);
        response.write(JSON.stringify(res));
        response.end();
    }, err => {
        console.log(err);
    })
}
path.set('/api/getUserInfo', getUserInfo);

/**
 * 获取所有用户信息
 * @param request
 * @param response
 */
function getAllUsers(request, response) {//GET
    userInfoDao.getAllUsers().then(res => {
        // console.log(res)
        response.writeHead(200);
        response.write(JSON.stringify(res));
        response.end();
    }, err => {
        console.log(err);
    })
}


path.set('/api/getAllUsers', getAllUsers);

/**
 * 更新用户数据
 * @param request
 * @param response
 */
function updateUser(request, response) {//GET
    let params = url.parse(request.url, true).query;
    let sex = params.sex == '男' ? 0 : params.sex == '女' ? 1 : null;
    userInfoDao.updateUser(params.username, params.phone, sex, params.email, params.userId).then(res => {
        if(res.affectedRows == 1) {
            response.writeHead(200);
            response.write("success");
            response.end();
        }
    }, err => {
        console.log(err);
    })
}
path.set('/api/updateUser', updateUser);


/**
 * 删除用户
 * @param request
 * @param response
 */
function deleteUser(request, response) {//GET
    let params = url.parse(request.url, true).query;
    userInfoDao.deleteUser(params.username).then(res => {
        if(res.affectedRows == 1) {
            response.writeHead(200);
            response.write("success");
            response.end();
        }
    }, err => {
        console.log(err);
    })
}
path.set('/api/deleteUser', deleteUser);

module.exports.path = path;