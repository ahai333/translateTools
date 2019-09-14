import defaultSettings from '@/settings'

const title = defaultSettings.title || 'FANEID'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
