import axios from 'axios'

const ACCESS_TOKEN_LOCAL_STORAGE = 'ACCESS_TOKEN'

export function getToken() {
  return localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE)
}

export function setToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE, token)
}

export function removeToken() {
  localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE)
}

export function apiClient(includeToken = true) {
  const token = getToken()

  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    ...(includeToken && token && {
      headers: { Authorization: `JWT ${token}` }
    })
  })
}