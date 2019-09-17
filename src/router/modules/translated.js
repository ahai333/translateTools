/** 翻译后处理 **/

import Layout from '@/layout'

const translatedRouter = {
  path: '/trans',
  component: Layout,
  redirect: '/trans/calc-match',
  name: 'translated',
  meta: {
    title: 'translated',
    icon: 'example'
  },
  children: [
    {
      path: 'calc-match',
      component: () => import('@/views/trans/calc-match'),
      name: 'calcmatch',
      meta: { title: 'calcMatch', roles: ['admin', 'editor'] }
    },
    {
      path: 'check',
      component: () => import('@/views/trans/check'),
      name: 'check',
      meta: { title: 'check', roles: ['admin'] }
    }
  ]
}
export default translatedRouter
