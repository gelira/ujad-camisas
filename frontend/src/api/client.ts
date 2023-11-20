import axios from 'axios'

import { getToken } from '@/utils/token'

export function apiClient(includeToken = true) {
  const token = getToken()

  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    ...(includeToken && token && {
      headers: { Authorization: `JWT ${token}` }
    })
  })
}