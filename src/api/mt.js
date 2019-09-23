import request from '@/utils/request'

export function startLog(params) {
  return request({
    url: '/v1/mt/startlog',
    method: 'get',
    params: params
  })
}

export function endLog(params) {
  return request({
    url: '/v1/mt/endlog',
    method: 'get',
    params: params
  })
}

export function mt(params) {
  return request({
    url: '/v1/mt/do',
    method: 'get',
    params
  })
}
