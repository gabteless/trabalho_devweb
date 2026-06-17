<template>
  <div>
    <div class="page-header">
      <div>
        <h2>Dashboard</h2>
        <p>Visão geral do sistema</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-4 mb-4">
      <div class="col-12 col-sm-6 col-xl-3">
        <StatsCard
          label="Total de Alunos"
          :value="alunosStore.totalAtivos"
          icon="bi bi-people-fill"
          variant="primary"
        />
      </div>
    </div>

    <div class="row g-4">
      <!-- Alunos Recentes -->
      <div class="col-12">
        <div class="table-container">
          <div class="table-header">
            <div class="table-title">Alunos Recentes</div>
            <router-link to="/alunos" class="btn-secondary-custom" style="font-size: 0.82rem; padding: 6px 14px;">
              Ver todos
              <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>
          <table class="table-custom">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aluno in ultimosAlunos" :key="aluno.id">
                <td style="color: var(--text-primary); font-weight: 500;">{{ aluno.nome }}</td>
                <td>{{ aluno.email }}</td>
                <td><StatusBadge :status="aluno.status" /></td>
              </tr>
              <tr v-if="ultimosAlunos.length === 0">
                <td colspan="3" class="text-center" style="color: var(--text-muted); padding: 32px;">
                  Nenhum aluno cadastrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAlunosStore } from '@/stores/alunos'
import StatsCard from '@/components/ui/StatsCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const alunosStore = useAlunosStore()

onMounted(async () => {
  await alunosStore.fetchAlunos()
})

const ultimosAlunos = computed(() => {
  return [...alunosStore.alunos]
    .sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro))
    .slice(0, 5)
})
</script>
