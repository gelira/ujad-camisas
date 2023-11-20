import { apiClient } from './client'

export function validateGoogleCredential(credential: string) {
  return apiClient(false).post<{ token: string }>('/auth/google', { credential })
}

export function validateAccessToken() {
  return apiClient().get<UserInfo>('/auth/user-info')
}
