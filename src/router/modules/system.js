/** 设置 **/

import Layout from '@/layout'

const systemRouter = {
  path: '/sys',
  component: Layout,
  redirect: '/sys/config',
  name: 'system',
  meta: {
    title: 'system',
    icon: 'lock',
    roles: ['admin']
  },
  children: [
    {
      path: 'admin',
      component: () => import('@/views/system/admin'),
      name: 'admin',
      meta: { title: 'admin', roles: ['admin'] }
    },
    {
      path: 'config',
      component: () => import('@/views/system/config'),
      name: 'config',
      meta: { title: 'config', roles: ['admin'] }
    }
  ]
}
export default systemRouter
