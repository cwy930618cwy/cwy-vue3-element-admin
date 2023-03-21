import request from '@/utils/request';

export function fetchList(query: any) {
  return request({
    url: '/api/v1/authorize/info',
    method: 'post',
    data: query
  })
}

export function detailAccount(query: any) {
  return request({
    url: '/api/v1/authorize/detail',
    method: 'get',
    params: query
  })
}

export function createAccount(data: any) {
  return request({
    url: '/api/v1/authorize/add',
    method: 'post',
    data
  })
}

export function updateAccount(data: any) {
  return request({
    url: '/api/v1/authorize/modify',
    method: 'post',
    data
  })
}

export function deleteAccount(data: any) {
  return request({
    url: '/api/v1/authorize/batch/state',
    method: 'post',
    data
  })
}