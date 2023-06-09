import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getToken } from '@/utils/auth';
import { useUserStoreHook } from '@/store/modules/user';

// 创建 axios 实例
const service = axios.create({
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    if (!config.headers) {
      throw new Error(
        `Expected 'config' and 'config.headers' not to be undefined`
      );
    }
    const user = useUserStoreHook();
    // if (user.token) {
    //   (config.headers as any).Authorization = getToken();
    // }
    const token = getToken();
    // do something before request is sent
    if (token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["open-authorization"] = "Bearer" + token;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data;
    if (code === '0') {
      return response.data;
    } else if (code === '30000') {
      ElMessageBox.confirm('当前页面已失效，请重新登录', '提示', {
        confirmButtonText: 'OK',
        confirmButtonClass: 'el-button-primary',
        cancelButtonClass: 'el-button-origin',
        type: 'warning'
      }).then(() => {
        localStorage.clear();
        window.location.href = '/';
      });
    } else if (code === '30001') {
      ElMessageBox.confirm('您的账号已在别处登录，请重试', '提示', {
        confirmButtonText: 'OK',
        confirmButtonClass: 'el-button-primary',
        cancelButtonClass: 'el-button-origin',
        type: 'warning'
      }).then(() => {
        localStorage.clear();
        window.location.href = '/';
      });
    } else if (code === '30004') {
      ElMessageBox.confirm('账号已停用', '提示', {
        confirmButtonText: 'OK',
        confirmButtonClass: 'el-button-primary',
        cancelButtonClass: 'el-button-origin',
        type: 'warning'
      }).then(() => {
        localStorage.clear();
        window.location.href = '/';
      });
    } else if (code === '30005') {
      ElMessageBox.confirm('账号已过期，请联系商务开通', '提示', {
        confirmButtonText: 'OK',
        confirmButtonClass: 'el-button-primary',
        cancelButtonClass: 'el-button-origin',
        type: 'warning'
      }).then(() => {
        localStorage.clear();
        window.location.href = '/';
      });
    } else {
      // 响应数据为二进制流处理(Excel导出)
      if (response.data instanceof ArrayBuffer) {
        return response;
      }

      ElMessage({
        message: msg || '系统出错',
        type: 'error'
      });
      return Promise.reject(new Error(msg || 'Error'));
    }
  },
  (error: any) => {
    if (error.response.data) {
      const { code, msg } = error.response.data;
      // token 过期,重新登录
      ElMessage({
        message: msg || '系统出错',
        type: 'error'
      });
    }
    return Promise.reject(error.message);
  }
);

// 导出 axios 实例
export default service;
