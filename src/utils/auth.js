//import Cookies from 'js-cookie'

const TokenKey = 'authorization'
const UserKey = 'user'

export function getToken() {
  return window.localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return window.localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return window.localStorage.removeItem(TokenKey)
}

export function getUser() {
  return JSON.parse(window.localStorage.getItem(UserKey))
}

export function setUser(token) {
  return window.localStorage.setItem(UserKey, JSON.stringify(token))
}

export function removeUser() {
  return window.localStorage.removeItem(UserKey)
}

export function isAdmin() {
  return (JSON.parse(window.localStorage.getItem(UserKey)).role == 1)
}
