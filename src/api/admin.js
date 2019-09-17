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
