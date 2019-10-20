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
    method: 'post',
    params
  })
}

export function similarity2(params) {
  return request({
    url: '/v1/simil/do2',
    method: 'post',
    params
  })
}
