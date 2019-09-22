/** 翻译后处理 **/

import Layout from '@/layout'

const mtRouter = {
  path: '/mt',
  component: Layout,
  redirect: '/mt/index',
  name: 'mt',
  meta: {
    title: 'mt',
    icon: 'example'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/mt/index'),
      name: 'mt-index',
      meta: { title: 'mtIndex' }
    },
    {
      path: 'log',
      component: () => import('@/views/mt/log'),
      name: 'mt-log',
      meta: { title: 'log' }
    },
    {
      path: 'config',
      component: () => import('@/views/mt/config'),
      name: 'mt-config',
      meta: { title: 'config' }
    }
  ]
}
export default mtRouter
