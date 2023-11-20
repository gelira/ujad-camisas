import { apiClient } from './client'

export function apiValidateGoogleCredential(credential: string) {
  return apiClient(false).post<{ token: string }>('/auth/google', { credential })
}

export function apiValidateAccessToken() {
  return apiClient().get<UserInfo>('/auth/user-info')
}
