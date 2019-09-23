import request from '@/utils/request'

export function startLog(params) {
  return request({
    url: '/v1/simil/startlog',
    method: 'get',
    params: params
  })
}

export function endLog(params) {
  return request({
    url: '/v1/simil/endlog',
    method: 'get',
    params: params
  })
}

export function similarity(params) {
  return request({
    url: '/v1/simil/do',
    method: 'get',
    params
  })
}
