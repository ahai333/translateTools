/** 相似度 **/

import Layout from '@/layout'

const similarityRouter = {
  path: '/similarity',
  component: Layout,
  redirect: '/similarity/index',
  name: 'similarity',
  meta: {
    title: 'similarity',
    icon: 'example'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/similarity/index'),
      name: 'similarity-index',
      meta: { title: 'similarityIndex' }
    },
    {
      path: 'log',
      component: () => import('@/views/similarity/log'),
      name: 'similarity-log',
      meta: { title: 'log' }
    },
    {
      path: 'config',
      component: () => import('@/views/similarity/config'),
      name: 'similarity-config',
      meta: { title: 'config' }
    },
    {
      path: 'detail',
      component: () => import('@/views/similarity/detail'),
      name: 'similarity-detail',
      hidden: true,
      meta: { title: 'detail' }
    }
  ]
}
export default similarityRouter
