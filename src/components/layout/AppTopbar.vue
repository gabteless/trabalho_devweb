<template>
  <header class="topbar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <div class="d-flex align-items-center gap-3">
      <button class="btn-icon d-lg-none" @click="$emit('toggleMobile')">
        <i class="bi bi-list" style="font-size: 1.4rem; color: var(--text-primary);"></i>
      </button>
      <div class="topbar-title">{{ pageTitle }}</div>
    </div>

    <div class="topbar-actions">
      <div class="user-info">
        <div>
          <div class="user-name">{{ authStore.userName }}</div>
          <div class="user-role">{{ authStore.userRole }}</div>
        </div>
        <div class="user-avatar">{{ authStore.userInitials }}</div>
      </div>
      <button class="btn-icon" @click="handleLogout" title="Sair">
        <i class="bi bi-box-arrow-right" style="color: var(--text-muted); font-size: 1.15rem;"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps({
  sidebarCollapsed: Boolean
})

defineEmits(['toggleMobile'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const pageTitle = computed(() => route.meta.title || 'Dashboard')

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
