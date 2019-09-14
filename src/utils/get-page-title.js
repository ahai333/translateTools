import defaultSettings from '@/settings'

const title = defaultSettings.title || 'FANYID'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
