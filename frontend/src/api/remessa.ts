import { apiClient } from './client'

export function apiFetchRemessas() {
  return apiClient().get<{ remessas: RemessaItem[] }>('/remessa/list')
}

export function apiFetchRemessaAberta() {
  return apiClient().get<{ remessa: Remessa }>('/remessa/aberta')
}
