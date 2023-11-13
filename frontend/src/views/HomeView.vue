<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@/composables/auth'

const router = useRouter()

const { validateAccessToken } = useAuth()

onMounted(() => {
  validateAccessToken()
    .then(() => {})
    .catch(() => router.push('/login'))
})
</script>

<template>
  <h1>Hello, World!</h1>
</template>
