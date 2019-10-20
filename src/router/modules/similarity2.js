/** 相似度 **/

import Layout from '@/layout'

const similarity2Router = {
  path: '/similarity2',
  component: Layout,
  redirect: '/similarity2/index',
  name: 'similarity2',
  meta: {
    title: 'similarity2',
    icon: 'example'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/similarity2/index'),
      name: 'similarity2-index',
      meta: { title: 'similarityIndex' }
    },
    {
      path: 'log',
      component: () => import('@/views/similarity2/log'),
      name: 'similarity2-log',
      meta: { title: 'log' }
    },
    {
      path: 'config',
      component: () => import('@/views/similarity2/config'),
      name: 'similarity2-config',
      meta: { title: 'config' }
    },
    {
      path: 'detail',
      component: () => import('@/views/similarity2/detail'),
      name: 'similarity2-detail',
      hidden: true,
      meta: { title: 'detail' }
    }
  ]
}
export default similarity2Router
