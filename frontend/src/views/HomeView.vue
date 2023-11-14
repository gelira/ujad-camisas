<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, RouterView } from 'vue-router'

import { useAuth } from '@/composables/auth'

const router = useRouter()

const { validateAccessToken } = useAuth()

onMounted(() => {
  validateAccessToken()
    .then(() => router.push({ name: 'setores' }))
    .catch(() => router.push({ name: 'login' }))
})
</script>

<template>
  <h1>Hello, World!</h1>
  <RouterView />
</template>
