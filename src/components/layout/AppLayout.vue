<template>
  <div class="app-layout">
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false"></div>
    <AppSidebar
      :collapsed="sidebarCollapsed"
      :mobileOpen="mobileMenuOpen"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
      @closeMobile="mobileMenuOpen = false"
    />
    <AppTopbar
      :sidebarCollapsed="sidebarCollapsed"
      @toggleMobile="mobileMenuOpen = !mobileMenuOpen"
    />
    <main class="app-main" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div class="page-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'

const sidebarCollapsed = ref(false)
const mobileMenuOpen = ref(false)
</script>
