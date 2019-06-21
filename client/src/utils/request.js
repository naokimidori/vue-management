/**
 * axios请求的封装
 * 2019/06/15  by 赵龙
 */

//  引入axios
import axios from 'axios';
// 引入qs
import qs from 'qs';
// 引入local
import local from '@/utils/local';

// 设置请求的服务器默认地址更目录
axios.defaults.baseURL = 'http://127.0.0.1:9999';
// axios.defaults.baseURL = 'http://172.16.12.253:9999';

// 设置请求头
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// axios请求拦截器
axios.interceptors.request.use(config => {
    // 获取token
    const token = local.get('n_a_o_k_i');
    // const token = window.localStorage.getItem('n_a_o_k_i');
    config.headers.authorization = `Bearer ${token}`; 
    return config;
})


export default {
    // get 
    get(url,params={}){
        return new Promise((resolve,reject)=>{
            axios.get(url,{
                params
            })
            .then(response=>{
                resolve(response.data) //成功
            })
            .catch(err=>{
                reject(err) //失败
            })
        })
    },
    // post
    post(url,params={}){
        return new Promise((resolve,reject)=>{
            axios.post(url,qs.stringify(params))
            .then(response=>{
                resolve(response.data)
            })
            .catch(err=>{
                reject(err)
            })
        })
    }
}