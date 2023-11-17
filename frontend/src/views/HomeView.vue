<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, RouterView } from 'vue-router'

import { removeToken } from '@/api/client'
import { validateAccessToken } from '@/api/auth'

const router = useRouter()

onMounted(() => {
  validateAccessToken()
    .then(({ data }) => {
      console.log(data)
      router.push({ name: 'setores' })
    })
    .catch(() => {
      removeToken()
      router.push({ name: 'login' })
    })
})
</script>

<template>
  <RouterView />
</template>
