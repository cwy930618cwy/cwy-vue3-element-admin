import request from '@/utils/request';

export function fetchList(query: any) {
  return request({
    url: '/api/v1/potent/infoCustomer',
    method: 'post',
    data: query
  })
}

export function updateApply(data: any) {
  return request({
    url: '/api/v1/potent/updateCustomer',
    method: 'post',
    data
  })
}
