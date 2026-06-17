<template>
  <div id="app">
    <AppLayout v-if="authStore.isAuthenticated">
      <router-view />
    </AppLayout>
    <router-view v-else />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'

const authStore = useAuthStore()
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
