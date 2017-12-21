import axios from 'axios';
import qs from 'qs'


// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';           //配置请求头
axios.defaults.baseURL = 'http://192.168.1.149:8080/ccmc';
axios.defaults.timeout = 5000;
// 让每个请求携带token--['token']为自定义key
// axios.defaults.headers.common['Authorization'] = '5188c5187d48df67b0c8953813791f25ed4e367c'
// 跨域请求时是否需要使用凭证
axios.defaults.withCredentials = true

// 添加请求拦截器
axios.interceptors.request.use(config => {
    if (Array.isArray(config.data)) {
        axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
    } else {
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        if (config.method === 'post') {
            config.data = qs.stringify(config.data);
        }
    }
    return config;
}, error => {
    console.log(error);
    Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.status === 2005) {
            localStorage.clear();
            location.href = "/";
        }
        return response
    }, error => {
        console.log('err' + error);
        return Promise.reject(error);
    });

export default axios;