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
      <div class="col-12 col-sm-6 col-xl-3">
        <StatsCard
          label="Planos Ativos"
          :value="planosStore.totalPlanos"
          icon="bi bi-bookmark-star-fill"
          variant="accent"
        />
      </div>
      <div class="col-12 col-sm-6 col-xl-3">
        <StatsCard
          label="Pagamentos Pendentes"
          :value="financeiroStore.totalPendentes + financeiroStore.totalAtrasados"
          icon="bi bi-clock-history"
          variant="warning"
        />
      </div>
      <div class="col-12 col-sm-6 col-xl-3">
        <StatsCard
          label="Receita do Mês"
          :value="financeiroStore.receitaMes"
          icon="bi bi-currency-dollar"
          variant="success"
          :isCurrency="true"
        />
      </div>
    </div>

    <div class="row g-4">
      <!-- Últimos Pagamentos -->
      <div class="col-12 col-lg-7">
        <div class="table-container">
          <div class="table-header">
            <div class="table-title">Últimos Pagamentos</div>
            <router-link to="/financeiro" class="btn-secondary-custom" style="font-size: 0.82rem; padding: 6px 14px;">
              Ver todos
              <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>
          <table class="table-custom">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pag in ultimosPagamentos" :key="pag.id">
                <td style="color: var(--text-primary); font-weight: 500;">{{ getAlunoNome(pag.alunoId) }}</td>
                <td>{{ formatCurrency(pag.valor) }}</td>
                <td>{{ formatDate(pag.dataVencimento) }}</td>
                <td><StatusBadge :status="pag.status" /></td>
              </tr>
              <tr v-if="ultimosPagamentos.length === 0">
                <td colspan="4" class="text-center" style="color: var(--text-muted); padding: 32px;">
                  Nenhum pagamento registrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Alunos Recentes -->
      <div class="col-12 col-lg-5">
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
                <th>Plano</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aluno in ultimosAlunos" :key="aluno.id">
                <td style="color: var(--text-primary); font-weight: 500;">{{ aluno.nome }}</td>
                <td>{{ planosStore.getPlanoNome(aluno.planoId) }}</td>
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
import { usePlanosStore } from '@/stores/planos'
import { useFinanceiroStore } from '@/stores/financeiro'
import StatsCard from '@/components/ui/StatsCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const alunosStore = useAlunosStore()
const planosStore = usePlanosStore()
const financeiroStore = useFinanceiroStore()

onMounted(async () => {
  await Promise.all([
    alunosStore.fetchAlunos(),
    planosStore.fetchPlanos(),
    financeiroStore.fetchPagamentos()
  ])
})

const ultimosPagamentos = computed(() => {
  return [...financeiroStore.pagamentos]
    .sort((a, b) => new Date(b.dataVencimento) - new Date(a.dataVencimento))
    .slice(0, 5)
})

const ultimosAlunos = computed(() => {
  return [...alunosStore.alunos]
    .sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro))
    .slice(0, 5)
})

function getAlunoNome(alunoId) {
  const aluno = alunosStore.getAlunoById(alunoId)
  return aluno ? aluno.nome : '—'
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}
</script>
