import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/log/list',
    method: 'post',
    params
  })
}

export function detail(params) {
  return request({
    url: '/log/detail',
    method: 'post',
    params
  })
}
