import { defineStore } from 'pinia'
import api from '@/services/api'

export const useFinanceiroStore = defineStore('financeiro', {
  state: () => ({
    pagamentos: [],
    loading: false,
    error: null
  }),

  getters: {
    totalPagamentos: (state) => state.pagamentos.length,

    pagamentosPagos: (state) => state.pagamentos.filter((p) => p.status === 'pago'),

    pagamentosPendentes: (state) => state.pagamentos.filter((p) => p.status === 'pendente'),

    pagamentosAtrasados: (state) => state.pagamentos.filter((p) => p.status === 'atrasado'),

    totalPendentes: (state) => state.pagamentos.filter((p) => p.status === 'pendente').length,

    totalAtrasados: (state) => state.pagamentos.filter((p) => p.status === 'atrasado').length,

    receitaMes: (state) => {
      const now = new Date()
      const mesAtual = now.getMonth()
      const anoAtual = now.getFullYear()
      return state.pagamentos
        .filter((p) => {
          if (p.status !== 'pago' || !p.dataPagamento) return false
          const data = new Date(p.dataPagamento)
          return data.getMonth() === mesAtual && data.getFullYear() === anoAtual
        })
        .reduce((sum, p) => sum + p.valor, 0)
    },

    getPagamentoById: (state) => (id) => state.pagamentos.find((p) => p.id === id)
  },

  actions: {
    async fetchPagamentos() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/pagamentos')
        this.pagamentos = response.data
      } catch (error) {
        this.error = 'Erro ao carregar pagamentos'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async fetchPagamento(id) {
      try {
        const response = await api.get(`/pagamentos/${id}`)
        return response.data
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao carregar pagamento')
      }
    },

    async createPagamento(pagamento) {
      try {
        const response = await api.post('/pagamentos', pagamento)
        this.pagamentos.push(response.data)
        return response.data
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao registrar pagamento')
      }
    },

    async updatePagamento(id, pagamento) {
      try {
        const response = await api.put(`/pagamentos/${id}`, pagamento)
        const index = this.pagamentos.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.pagamentos[index] = response.data
        }
        return response.data
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao atualizar pagamento')
      }
    },

    async deletePagamento(id) {
      try {
        await api.delete(`/pagamentos/${id}`)
        this.pagamentos = this.pagamentos.filter((p) => p.id !== id)
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao excluir pagamento')
      }
    }
  }
})
