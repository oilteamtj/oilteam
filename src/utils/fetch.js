import axios from 'axios'
import {
  Message
} from 'element-ui'
import {
  removeToken,
  getToken
} from '@/utils/utils'

import router from '@/router/index'
import store from '../store'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, //API的base_url
  //timeout: 5000         //请求超时
});

// request 拦截器
service.interceptors.request.use(config => {
  let token = getToken()
  if (token && token.token) {
    config.headers['token'] = token.token; // 让每个请求携带自定义token
  }
  return config;
}, error => {
  Promise.reject(error)
});

//response 拦截器
service.interceptors.response.use(response => {
//   if (response.data.code == '401') {
//     removeToken()
//     store.commit('SET_TOKEN', '')
//     store.commit('SET_ROLES', '')
//     router.push({
//       path: '/login'
//     })
//     return false
//   }
  // if(){

  // }
  return response;
}, error => {

  const errCode = error.response.status;
  const errMessage = error.response.data;
  if (errCode == 401) {
    Message({
      message: '获取用户信息授权错误，请重新登录！',
      type: 'error',
      duration: 3000
    });
    store.commit('SET_TOKEN', '')
    store.commit('SET_ROLES', '')
    removeToken()
    router.push({
      path: '/login'
    })
  } else if (errCode == 504) {
    Message({
      message: '网络错误，服务器未响应！',
      type: 'error'
    });
  } else {
    Message({
      message: errMessage,
      type: 'error'
    });
  }
  return Promise.reject(error);
});

export default service
