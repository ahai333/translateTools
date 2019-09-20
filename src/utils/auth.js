import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken(name = TokenKey) {
  return Cookies.get(name)
}

export function setToken(token, name = TokenKey) {
  const inFifteenMinutes = new Date(new Date().getTime() + 30 * 60 * 1000)
  return Cookies.set(name, token, { expires: inFifteenMinutes })
}

export function removeToken(name = TokenKey) {
  return Cookies.remove(name)
}
