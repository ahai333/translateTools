import request from '@/utils/request'

export function optLog(params) {
  return request({
    url: '/log/opt',
    method: 'post',
    params
  })
}

export function detailLog(params) {
  return request({
    url: '/log/detail',
    method: 'post',
    params
  })
}
