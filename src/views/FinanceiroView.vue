<template>
  <div>
    <div class="page-header">
      <div>
        <h2>Financeiro</h2>
        <p>Controle de pagamentos e mensalidades</p>
      </div>
      <router-link to="/financeiro/novo" class="btn-primary-custom">
        <i class="bi bi-plus-lg"></i>
        Novo Pagamento
      </router-link>
    </div>

    <!-- Stats resumo -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-sm-4">
        <StatsCard
          label="Pagos"
          :value="financeiroStore.pagamentosPagos.length"
          icon="bi bi-check-circle-fill"
          variant="success"
        />
      </div>
      <div class="col-12 col-sm-4">
        <StatsCard
          label="Pendentes"
          :value="financeiroStore.totalPendentes"
          icon="bi bi-clock-history"
          variant="warning"
        />
      </div>
      <div class="col-12 col-sm-4">
        <StatsCard
          label="Atrasados"
          :value="financeiroStore.totalAtrasados"
          icon="bi bi-exclamation-triangle-fill"
          variant="danger"
        />
      </div>
    </div>

    <div class="table-container">
      <div class="table-header">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control form-control-custom"
            placeholder="Buscar por aluno..."
          />
        </div>
        <div class="filter-bar">
          <button
            class="filter-btn"
            :class="{ active: filterStatus === '' }"
            @click="filterStatus = ''"
          >Todos</button>
          <button
            class="filter-btn"
            :class="{ active: filterStatus === 'pago' }"
            @click="filterStatus = 'pago'"
          >Pagos</button>
          <button
            class="filter-btn"
            :class="{ active: filterStatus === 'pendente' }"
            @click="filterStatus = 'pendente'"
          >Pendentes</button>
          <button
            class="filter-btn"
            :class="{ active: filterStatus === 'atrasado' }"
            @click="filterStatus = 'atrasado'"
          >Atrasados</button>
        </div>
      </div>

      <div v-if="financeiroStore.loading" class="empty-state">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3">Carregando pagamentos...</p>
      </div>

      <div v-else-if="filteredPagamentos.length === 0" class="empty-state">
        <i class="bi bi-wallet2"></i>
        <p>Nenhum pagamento encontrado</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table-custom">
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th>Pagamento</th>
              <th>Status</th>
              <th style="width: 90px;">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pag in filteredPagamentos" :key="pag.id">
              <td style="color: var(--text-primary); font-weight: 500;">{{ getAlunoNome(pag.alunoId) }}</td>
              <td>{{ formatCurrency(pag.valor) }}</td>
              <td>{{ formatDate(pag.dataVencimento) }}</td>
              <td>{{ pag.dataPagamento ? formatDate(pag.dataPagamento) : '—' }}</td>
              <td><StatusBadge :status="pag.status" /></td>
              <td>
                <div class="d-flex gap-1">
                  <router-link :to="`/financeiro/${pag.id}/editar`" class="btn-icon btn-edit" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                  </router-link>
                  <button class="btn-icon btn-delete" title="Excluir" @click="confirmDelete(pag)">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ConfirmModal
      :show="showDeleteModal"
      title="Excluir Pagamento"
      message="Tem certeza que deseja excluir este registro de pagamento? Esta ação não pode ser desfeita."
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAlunosStore } from '@/stores/alunos'
import { useFinanceiroStore } from '@/stores/financeiro'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import StatsCard from '@/components/ui/StatsCard.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

const alunosStore = useAlunosStore()
const financeiroStore = useFinanceiroStore()

const searchQuery = ref('')
const filterStatus = ref('')
const showDeleteModal = ref(false)
const pagamentoToDelete = ref(null)

onMounted(async () => {
  await Promise.all([
    alunosStore.fetchAlunos(),
    financeiroStore.fetchPagamentos()
  ])
})

const filteredPagamentos = computed(() => {
  return financeiroStore.pagamentos.filter((pag) => {
    const alunoNome = getAlunoNome(pag.alunoId).toLowerCase()
    const matchSearch = alunoNome.includes(searchQuery.value.toLowerCase())
    const matchStatus = filterStatus.value === '' || pag.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

function getAlunoNome(alunoId) {
  const aluno = alunosStore.getAlunoById(alunoId)
  return aluno ? aluno.nome : '—'
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

function confirmDelete(pag) {
  pagamentoToDelete.value = pag
  showDeleteModal.value = true
}

async function handleDelete() {
  if (pagamentoToDelete.value) {
    await financeiroStore.deletePagamento(pagamentoToDelete.value.id)
    showDeleteModal.value = false
    pagamentoToDelete.value = null
  }
}
</script>
