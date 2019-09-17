/** 翻译前预处理 **/

import Layout from '@/layout'

const preTransRouter = {
  path: '/pretrans',
  component: Layout,
  redirect: '/pretrans/mt',
  name: 'pretrans',
  meta: {
    title: 'preTrans',
    icon: 'example'
  },
  children: [
    {
      path: 'mt',
      component: () => import('@/views/trans/translate'),
      name: 'mt',
      meta: { title: 'machineTranslate', roles: ['admin', 'editor'] }
    },
    {
      path: 'prematch',
      component: () => import('@/views/trans/duplicate'),
      name: 'prematch',
      meta: { title: 'preMatch', roles: ['admin'] }
    }
  ]
}
export default preTransRouter
