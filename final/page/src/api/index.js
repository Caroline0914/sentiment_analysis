import axios from '../axios';

const api = {
    checkHasUser(params) {
        return axios.get('/checkHasUser', {params});
    },
    getKeyword (params) {//获取词云图数据
        return axios.get('/getKeyword', {params});
    },
    getVerificationCode(params) {//获取验证码
        return axios.get('/getVerificationCode', params);
    },
    updateUser(params) {//更新用户数据
        return axios.get('/updateUser', {params});
    },
    getUserInfo(params) {//获取一个用户数据
        return axios.get('/getUserInfo', {params});
    },
    deleteUser(params){//删除用户
        return axios.get('/deleteUser', {params});
    },
    getAllUsers(params) {//获取所有数据
        return axios.get('/getAllUsers', {params});
    },
    setMovieContent(params) {//获取电影信息
        return axios.get('/setMovieContent', {params});
    },
    setActorContent(params) {//获取演员信息
        return axios.get('/setActorContent', {params});
    },
    setComment(params){//获取影评
        return axios.get('/setComment', {params});
    },
    setHistory(params) {//添加历史记录
        return axios.get('/setHistory', {params});
    },
    getSearchWord(params) {//获取历史记录
        return axios.get('/getSearchWord', {params});
    },
    getRandomCommentAndSentiment(parmas) {//获取随机评论和分析结果
        return axios.get('/getRandomCommentAndSentiment');
    },
    getRandomCommentAndwords(params) {//获取随机评论和分词结果
        return axios.get('/getRandomCommentAndwords');
    },
    deleteHistory(params){//删除历史记录
        return axios.get('/deleteHistory', {params});
    },
    getCommentByFlag(params) {//根据flag获取影评
        return axios.get('/getCommentByFlag', {params});
    },
    getRecommendMovie(params){//获取推荐电影
        return axios.get('/getRecommendMovie', {params});
    }
};

export default api;
