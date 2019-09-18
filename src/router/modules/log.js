/** 日志 **/

import Layout from '@/layout'

const logRouter = {
  path: '/log',
  component: Layout,
  redirect: '/log/config',
  name: 'log',
  meta: {
    title: 'log',
    icon: 'example',
    roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'translog',
      component: () => import('@/views/log/translog'),
      name: 'translog',
      meta: { title: 'translog', roles: ['admin', 'editor'] }
    },
    {
      path: 'syslog',
      component: () => import('@/views/log/syslog'),
      name: 'syslog',
      meta: { title: 'syslog', roles: ['admin', 'editor'] }
    }
  ]
}
export default logRouter
