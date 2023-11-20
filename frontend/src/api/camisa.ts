import { apiClient } from './client'

export function fetchCamisas(setorId: any) {
  return apiClient().get<{ camisas: Camisa[] }>('/camisa/list', {
    params: { setorId }
  })
}

export function createCamisa(data: CreateCamisa) {
  return apiClient().post('/camisa', data)
}

export function updateCamisa(id: string, data: UpdateCamisa) {
  return apiClient().put(`/camisa/${id}`, data)
}

export function deleteCamisa(id: string) {
  return apiClient().delete(`/camisa/${id}`)
}
