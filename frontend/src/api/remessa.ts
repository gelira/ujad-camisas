import { apiClient } from './client'

export function apiFetchRemessaAberta() {
  return apiClient().get<{ remessa: Remessa }>('/remessa/aberta')
}
