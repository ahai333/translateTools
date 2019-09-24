/** 翻译后处理 **/

import Layout from '@/layout'

const compareRouter = {
  path: '/compare',
  component: Layout,
  redirect: '/compare/index',
  name: 'compare',
  meta: {
    title: 'compare',
    icon: 'form'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/compare/index'),
      name: 'compare-index',
      meta: { title: 'compareIndex' }
    },
    {
      path: 'config',
      component: () => import('@/views/compare/config'),
      name: 'compare-config',
      meta: { title: 'config' }
    }
  ]
}
export default compareRouter
