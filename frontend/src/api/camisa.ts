import { apiClient } from './client'

export function apiFetchCamisas(setorId: string) {
  return apiClient().get<{ camisas: Camisa[] }>('/camisa/list', {
    params: { setorId }
  })
}

export function apiCreateCamisa(data: CreateCamisa) {
  return apiClient().post('/camisa', data)
}

export function apiUpdateCamisa(id: string, data: UpdateCamisa) {
  return apiClient().put(`/camisa/${id}`, data)
}

export function apiDeleteCamisa(id: string) {
  return apiClient().delete(`/camisa/${id}`)
}
