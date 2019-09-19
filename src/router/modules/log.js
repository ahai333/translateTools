/** 日志 **/

import Layout from '@/layout'

const logRouter = {
  path: '/log',
  component: Layout,
  redirect: '/log/translog',
  name: 'log',
  meta: {
    title: 'log',
    icon: 'list'
  },
  children: [
    {
      path: 'translog',
      component: () => import('@/views/log/translog'),
      name: 'translog',
      meta: { title: 'translog' }
    },
    {
      path: 'syslog',
      component: () => import('@/views/log/syslog'),
      name: 'syslog',
      meta: { title: 'syslog' }
    },
    {
      path: 'detaillog',
      component: () => import('@/views/log/detaillog'),
      name: 'detaillog',
      hidden: true,
      meta: { title: 'detaillog' }
    }
  ]
}
export default logRouter
