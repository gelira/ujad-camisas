import { apiClient } from './client'

export function apiValidateGoogleCredential(credential: string) {
  return apiClient(false).post<{ token: string }>('/auth/google', { credential })
}

export function apiValidateAccessToken() {
  return apiClient().get<UserInfo>('/auth/user-info')
}

export function apiGetAuthCode(email: string) {
  return apiClient(false).get<{ id: string }>('/auth/code', {
    params: { email }
  })
}

export function apiPostAuthCode(authCodeId: string, code: string) {
  return apiClient(false).post<{ token: string }>('/auth/code', {
    id: authCodeId,
    code
  })
}
