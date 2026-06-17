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
      <div class="d-flex align-items-center gap-2 border-start border-secondary ps-3 ms-2">
        <button class="btn-icon" @click="toggleTheme" :title="isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro'">
          <i class="bi" :class="isLight ? 'bi-moon-stars-fill' : 'bi-sun-fill'" style="color: var(--text-muted); font-size: 1.15rem;"></i>
        </button>
        <button class="btn-icon" @click="handleLogout" title="Sair">
          <i class="bi bi-box-arrow-right" style="color: var(--text-muted); font-size: 1.15rem;"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
const isLight = ref(false)

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light') {
    isLight.value = true
    document.documentElement.setAttribute('data-theme', 'light')
  }
})

function toggleTheme() {
  isLight.value = !isLight.value
  if (isLight.value) {
    document.documentElement.setAttribute('data-theme', 'light')
    localStorage.setItem('theme', 'light')
  } else {
    document.documentElement.removeAttribute('data-theme')
    localStorage.setItem('theme', 'dark')
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
