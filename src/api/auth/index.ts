import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LoginData, TokenResult, VerifyCode } from './types';

/**
 *
 * @param data {LoginForm}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<TokenResult> {
  return request({
    url: '/api/v1/login/getToken',
    method: 'post',
    data: data
  });
}

/**
 * 注销
 */
export function logoutApi() {
  return request({
    url: '/api/v1/common/logOut',
    method: 'post'
  });
}

/**
 * 获取图片验证码
 */
export function getCaptcha(): AxiosPromise<VerifyCode> {
  return request({
    url: '/captcha?t=' + new Date().getTime().toString(),
    method: 'get'
  });
}
