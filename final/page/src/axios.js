import axios from 'axios';

let instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api'
});

instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么，例如加入token
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

export default instance;
