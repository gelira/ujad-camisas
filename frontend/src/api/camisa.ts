import { apiClient } from './client'

export interface Camisa {
  id: string
  nomePessoa: string
  modeloId: string
  modeloDescricao: string
  modeloValor: number
  totalPago: number
  tamanhoId: string
  tamanhoDescricao: string
}

export interface UpdateCamisa {
  nomePessoa: string
  modeloId: string
  tamanhoId: string
  totalPago: number
}

export function fetchCamisas(setorId: any) {
  return apiClient().get<{ camisas: Camisa[] }>('/camisa/list', {
    params: { setorId }
  })
}

export function updateCamisa(id: string, data: UpdateCamisa) {
  return apiClient().put(`/camisa/${id}`, data)
}

export function deleteCamisa(id: string) {
  return apiClient().delete(`/camisa/${id}`)
}
