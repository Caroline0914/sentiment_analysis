const express = require("express");
const globalConfig = require("./config");
const loader = require("./loader");
const cookie = require("cookie-parser");

const app = new express();
//支持跨域
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'x-requested-with, Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.use(express.static(globalConfig["page_path"]));
// app.use(cookie());
// app.get("/api/*", function (request, response, next) {//拦截器
//     // response.redirect("/login.html")
//     if(request.cookies.id) {
//         next();
//     } else {
//         response.redirect("/login.html");
//     }
// })
// app.get('/api/doLogin', loader.get('/api/doLogin'));
app.post('/api/doLogin', loader.get('/api/doLogin'));
app.post('/api/doRegister', loader.get('/api/doRegister'));
app.get('/api/getVerificationCode', loader.get('/api/getVerificationCode'));
app.post('/api/checkVerificationCode', loader.get('/api/checkVerificationCode'));
app.get('/api/checkHasUser', loader.get('/api/checkHasUser'));
app.get('/api/setMovieContent', loader.get('/api/setMovieContent'));
app.get('/api/setActorContent', loader.get('/api/setActorContent'));
app.get('/api/setComment', loader.get('/api/setComment'));
app.get("/api/getKeyword", loader.get("/api/getKeyword"));
app.get('/api/getUserInfo', loader.get('/api/getUserInfo'));
app.get('/api/getAllUsers', loader.get('/api/getAllUsers'));
app.get('/api/updateUser', loader.get('/api/updateUser'));
app.get('/api/deleteUser', loader.get('/api/deleteUser'));
app.get('/api/setHistory', loader.get('/api/setHistory'));
app.get('/api/getSearchWord', loader.get('/api/getSearchWord'));
app.get('/api/getRandomCommentAndSentiment', loader.get('/api/getRandomCommentAndSentiment'));
app.get('/api/getRandomCommentAndwords', loader.get('/api/getRandomCommentAndwords'));
app.post('/api/setWord', loader.get('/api/setWord'));
app.get('/api/deleteHistory', loader.get('/api/deleteHistory'));
app.get('/api/getCommentByFlag', loader.get('/api/getCommentByFlag'));
app.get('/api/getRecommendMovie', loader.get('/api/getRecommendMovie'));
// loader.init(app);
app.listen(globalConfig["port"]);
