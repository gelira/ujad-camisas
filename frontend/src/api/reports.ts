import { apiClient } from './client'

export function apiFetchCountingCamisasReport(remessaId?: string) {
  return apiClient().get<{ report: string }>('/report/counting-camisas', {
    params: { remessaId },
  })
}

export function apiFetchListingCamisasReport(setorId?: string) {
  return apiClient().get<{ report: string }>('/report/listing-camisas', {
    params: { setorId },
  })
}
