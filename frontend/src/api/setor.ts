import { apiClient } from './client'

export interface Setor {
  id: string
  nome: string
}

export function fetchSetores() {
  return apiClient().get<{
    setores: Setor[]
  }>('/setor/list')
}
