import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAlunosStore = defineStore('alunos', {
  state: () => ({
    alunos: [],
    loading: false,
    error: null
  }),

  getters: {
    totalAlunos: (state) => state.alunos.length,
    alunosAtivos: (state) => state.alunos.filter((a) => a.status === 'ativo'),
    totalAtivos: (state) => state.alunos.filter((a) => a.status === 'ativo').length,
    getAlunoById: (state) => (id) => state.alunos.find((a) => a.id === id)
  },

  actions: {
    async fetchAlunos() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/alunos')
        this.alunos = response.data
      } catch (error) {
        this.error = 'Erro ao carregar alunos'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async fetchAluno(id) {
      try {
        const response = await api.get(`/alunos/${id}`)
        return response.data
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao carregar aluno')
      }
    },

    async createAluno(aluno) {
      try {
        const response = await api.post('/alunos', {
          ...aluno,
          dataCadastro: new Date().toISOString().split('T')[0]
        })
        this.alunos.push(response.data)
        return response.data
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao cadastrar aluno')
      }
    },

    async updateAluno(id, aluno) {
      try {
        const response = await api.put(`/alunos/${id}`, aluno)
        const index = this.alunos.findIndex((a) => a.id === id)
        if (index !== -1) {
          this.alunos[index] = response.data
        }
        return response.data
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao atualizar aluno')
      }
    },

    async deleteAluno(id) {
      try {
        await api.delete(`/alunos/${id}`)
        this.alunos = this.alunos.filter((a) => a.id !== id)
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao excluir aluno')
      }
    }
  }
})
