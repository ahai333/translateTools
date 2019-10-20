import request from '@/utils/request'

export function upImage(params) {
  return request({
    url: '/v1/simil/startlog',
    method: 'post'
    // params: params
  })
}
