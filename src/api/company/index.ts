import request from '@/utils/request';

export function fetchList(query: any) {
  return request({
    url: '/api/v1/company/companyInfo',
    method: 'post',
    data: query
  })
}

export function detailCompany(query: any) {
  return request({
    url: '/api/v1/company/companyDetail',
    method: 'get',
    params: query
  })
}

export function createCompany(data: any) {
  return request({
    url: '/api/v1/company/addCompany',
    method: 'post',
    data
  })
}

export function updateCompany(data: any) {
  return request({
    url: '/api/v1/company/updateCompany',
    method: 'post',
    data
  })
}

export function deleteCompany(data: any) {
  return request({
    url: '/api/v1/company/batch/state',
    method: 'post',
    data
  })
}