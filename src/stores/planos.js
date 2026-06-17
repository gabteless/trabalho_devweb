import { defineStore } from 'pinia'
import api from '@/services/api'

export const usePlanosStore = defineStore('planos', {
  state: () => ({
    planos: [],
    loading: false,
    error: null
  }),

  getters: {
    totalPlanos: (state) => state.planos.length,
    getPlanoById: (state) => (id) => state.planos.find((p) => p.id === id),
    getPlanoNome: (state) => (id) => {
      const plano = state.planos.find((p) => p.id === id)
      return plano ? plano.nome : '—'
    }
  },

  actions: {
    async fetchPlanos() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/planos')
        this.planos = response.data
      } catch (error) {
        this.error = 'Erro ao carregar planos'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async fetchPlano(id) {
      try {
        const response = await api.get(`/planos/${id}`)
        return response.data
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao carregar plano')
      }
    },

    async createPlano(plano) {
      try {
        const response = await api.post('/planos', plano)
        this.planos.push(response.data)
        return response.data
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao cadastrar plano')
      }
    },

    async updatePlano(id, plano) {
      try {
        const response = await api.put(`/planos/${id}`, plano)
        const index = this.planos.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.planos[index] = response.data
        }
        return response.data
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao atualizar plano')
      }
    },

    async deletePlano(id) {
      try {
        await api.delete(`/planos/${id}`)
        this.planos = this.planos.filter((p) => p.id !== id)
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao excluir plano')
      }
    }
  }
})
