import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  const inFifteenMinutes = new Date(new Date().getTime() + 10 * 60 * 1000)
  return Cookies.set(TokenKey, token, { expires: inFifteenMinutes })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
