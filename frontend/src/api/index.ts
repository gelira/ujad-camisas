import axios from 'axios'

import { ACCESS_TOKEN_LOCAL_STORAGE } from '@/consts'

export function apiClient(includeToken = true) {
  const token = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE)

  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    ...(includeToken && token && { headers: { Authorization: `JWT ${token}` } })
  })
}