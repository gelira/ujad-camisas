import { useRouter } from 'vue-router'

import { ROUTES } from '@/router'

export function useNavigation() {
  const router = useRouter()

  function goToHome() {
    router.push({ name: ROUTES.HOME })
  }

  function goToLogin() {
    router.push({ name: ROUTES.LOGIN })
  }

  function goToCamisas(id: string) {
    router.push({ name: ROUTES.CAMISAS, params: { id } })
  }

  return {
    goToHome,
    goToLogin,
    goToCamisas
  }
}
