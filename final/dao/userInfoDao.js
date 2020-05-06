const dbutil = require('./dbutil');

/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 * @param success 回调
 */
function doLogin(username, password, success) {
    let querySql = "select * from userInfo where username = ? and password = ?;";
    let connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, [username, password], function (error, result) {
        if(error == null) {
            success(result);
        } else {
            console.log(error);
            // throw new Error(error);
            success(null, error);
        }
    });
    connection.end();
}

/**
 * 用户注册
 * @param username 用户名
 * @param password 密码
 * @param phone 手机号
 * @param success 回调
 */
function doRegister (username, password, phone, success) {
    let insertSql = "insert into userInfo(username, password, phone) values(?, ?, ?);"
    let connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql, [username, password, phone], function (error, result) {
        if(error == null) {
            success(result);
        } else {
            console.log(error);
            // throw new Error(error);
            success(null, error)
        }
    });
    connection.end();
}

/**
 * 判断是否已存在该用户
 * @param username 用户名
 */
function checkHasUser(username, success) {
    let querySql = "select * from userInfo where username = ?;";
    let connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, [username], function (error, result) {
        if(error == null) {
            success(result);
        } else {
            console.log(error);
            // throw new Error(error);
        }
    });
    connection.end();
}

/**
 * 获取用户信息
 * @param username 用户名
 * @returns {Promise<unknown>}
 */
async function getUserInfo(username) {
    return new Promise((resolve, reject) => {
        let querySql = "select * from userInfo where username = ?;";
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

async function updateUser(id, username, phone, sex, email, userId) {
    return new Promise((resolve, reject) => {
        let updateSql = "update userInfo set username = ?, phone = ?, sex = ?, email = ?, userId = ? where id = ?;";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(updateSql, [username, phone, sex, email, userId, id], function (error, result) {
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
 * 获取所有用户
 * @returns {Promise<unknown>}
 */
async function getAllUsers() {
    return new Promise((resolve, reject) => {
        let querySql = "select * from userInfo;";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(querySql, function (error, result) {
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
 * 删除用户
 * @param id
 * @returns {Promise<unknown>}
 */
async function deleteUser(id) {
    return new Promise((resolve, reject) => {
        let deleteSql = "delete from userInfo where id = ?";
        let connection = dbutil.createConnection();
        connection.connect();
        connection.query(deleteSql, id, function (error, result) {
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
    "doLogin": doLogin,
    "doRegister": doRegister,
    "checkHasUser": checkHasUser,
    "getUserInfo": getUserInfo,
    "getAllUsers": getAllUsers,
    "updateUser": updateUser,
    "deleteUser": deleteUser
};