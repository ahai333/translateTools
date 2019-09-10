import request from '@/utils/request'

export function trans(params) {
  return request({
    url: '/v1/trans',
    method: 'get',
    params
  })
}

export function match(params) {
  return request({
    url: '/v1/match',
    method: 'get',
    params
  })
}

export function quality(params) {
  return request({
    url: '/v1/quality',
    method: 'get',
    params
  })
}
