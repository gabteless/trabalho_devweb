import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.nome || '',
    userRole: (state) => state.user?.cargo || '',
    userInitials: (state) => {
      if (!state.user?.nome) return ''
      return state.user.nome
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    }
  },

  actions: {
    async login(email, senha) {
      try {
        const response = await api.get('/usuarios', {
          params: { email }
        })

        if (response.data.length === 0 || response.data[0].senha !== senha) {
          throw new Error('E-mail ou senha inválidos')
        }

        const user = response.data[0]
        const token = 'fake-jwt-token-' + Date.now()

        this.user = user
        this.token = token

        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)

        return true
      } catch (error) {
        if (error.message === 'E-mail ou senha inválidos') {
          throw error
        }
        throw new Error('Erro ao conectar com o servidor')
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },

    checkAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        return true
      }
      return false
    }
  }
})
