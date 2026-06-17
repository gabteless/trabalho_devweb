<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-brand">
        <div class="brand-icon">
          <i class="bi bi-activity"></i>
        </div>
        <h1>Gestão Master</h1>
        <p>Acesse sua conta para continuar</p>
      </div>

      <div v-if="errorMessage" class="login-error">
        <i class="bi bi-exclamation-circle-fill"></i>
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label-custom">E-mail</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-control form-control-custom"
            placeholder="seu@email.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="mb-4">
          <label for="senha" class="form-label-custom">Senha</label>
          <div class="position-relative">
            <input
              id="senha"
              v-model="form.senha"
              :type="showPassword ? 'text' : 'password'"
              class="form-control form-control-custom"
              placeholder="••••••"
              required
              autocomplete="current-password"
              style="padding-right: 42px !important;"
            />
            <button
              type="button"
              class="btn-icon position-absolute"
              style="right: 4px; top: 50%; transform: translateY(-50%);"
              @click="showPassword = !showPassword"
            >
              <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'" style="color: var(--text-muted);"></i>
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="btn-primary-custom w-100 justify-content-center"
          :disabled="loading"
          style="padding: 12px; font-size: 0.95rem;"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          <span v-else>
            <i class="bi bi-box-arrow-in-right"></i>
            Entrar
          </span>
        </button>
      </form>

      <div class="mt-3 text-center" style="font-size: 0.8rem; color: var(--text-muted);">
        Use: <strong>admin@academia.com</strong> / <strong>123456</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  senha: ''
})

const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  try {
    await authStore.login(form.email, form.senha)
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}
</script>
