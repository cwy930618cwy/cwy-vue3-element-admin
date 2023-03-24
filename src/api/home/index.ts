import request from '@/utils/request';

export function searchApi(query: any) {
  return request({
    url: '/api/v1/search/info',
    method: 'post',
    data: query
  })
}

export function exportApi(query: any) {
  return request({
    url: '/api/v1/down/point/export',
    method: 'post',
    data: query
  })
}

export function detailApi(query: any) {
  return request({
    url: '/api/v1/detail/info',
    method: 'get',
    params: query
  })
}

