import { apiClient } from './client'

export function validateGoogleToken(token: string) {
  return apiClient(false).post<{
    token: string
  }>('/auth/google', { token })
}

export function validateAccessToken() {
  return apiClient().get<{
    nome: string,
    email: string,
    admin: boolean
  }>('/auth/user-info')
}
