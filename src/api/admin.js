import request from '@/utils/request'

export function getAdminList(data) {
  return request({
    url: '/sys/admin',
    method: 'get',
    data
  })
}

export function modifyAdmin(data) {
  return request({
    url: '/sys/modifyadmin',
    method: 'post',
    data
  })
}
export function delAdmin(data) {
  return request({
    url: '/sys/deladmin',
    method: 'post',
    data
  })
}

export function startLog(params) {
  return request({
    url: '/sys/startlog',
    method: 'get',
    params: params
  })
}

export function endLog(params) {
  return request({
    url: '/sys/endlog',
    method: 'get',
    params: params
  })
}
