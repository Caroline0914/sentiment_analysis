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
    }
};

export default api;
