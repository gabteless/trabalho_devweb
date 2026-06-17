<template>
  <aside class="sidebar" :class="{ collapsed, 'mobile-open': mobileOpen }">
    <div class="sidebar-brand">
      <div class="brand-icon">
        <i class="bi bi-activity"></i>
      </div>
      <span class="brand-text">Gestão Master</span>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-title">Menu Principal</div>

      <router-link
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: isActive(item.to) }"
        @click="$emit('closeMobile')"
      >
        <i :class="item.icon"></i>
        <span class="nav-text">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button class="sidebar-toggle" @click="$emit('toggle')">
        <i class="bi" :class="collapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
        <span class="nav-text">Recolher</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

defineProps({
  collapsed: Boolean,
  mobileOpen: Boolean
})

defineEmits(['toggle', 'closeMobile'])

const route = useRoute()

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'bi bi-grid-1x2-fill' },
  { to: '/alunos', label: 'Alunos', icon: 'bi bi-people-fill' },
  { to: '/planos', label: 'Planos', icon: 'bi bi-bookmark-star-fill' },
  { to: '/financeiro', label: 'Financeiro', icon: 'bi bi-wallet2' }
]

function isActive(path) {
  return route.path.startsWith(path)
}
</script>
