<template>
  <div>
    <div class="page-header">
      <div>
        <h2>Alunos</h2>
        <p>Gerencie os alunos da academia</p>
      </div>
      <router-link to="/alunos/novo" class="btn-primary-custom">
        <i class="bi bi-plus-lg"></i>
        Novo Aluno
      </router-link>
    </div>

    <div class="table-container">
      <div class="table-header">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control form-control-custom"
            placeholder="Buscar aluno..."
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
            :class="{ active: filterStatus === 'ativo' }"
            @click="filterStatus = 'ativo'"
          >Ativos</button>
          <button
            class="filter-btn"
            :class="{ active: filterStatus === 'inativo' }"
            @click="filterStatus = 'inativo'"
          >Inativos</button>
        </div>
      </div>

      <div v-if="alunosStore.loading" class="empty-state">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3">Carregando alunos...</p>
      </div>

      <div v-else-if="filteredAlunos.length === 0" class="empty-state">
        <i class="bi bi-people"></i>
        <p>Nenhum aluno encontrado</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table-custom">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th>Status</th>
              <th style="width: 90px;">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="aluno in filteredAlunos" :key="aluno.id">
              <td style="color: var(--text-primary); font-weight: 500;">{{ aluno.nome }}</td>
              <td>{{ aluno.cpf }}</td>
              <td>{{ aluno.telefone }}</td>
              <td>{{ aluno.email }}</td>
              <td><StatusBadge :status="aluno.status" /></td>
              <td>
                <div class="d-flex gap-1">
                  <router-link :to="`/alunos/${aluno.id}/editar`" class="btn-icon btn-edit" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                  </router-link>
                  <button class="btn-icon btn-delete" title="Excluir" @click="confirmDelete(aluno)">
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
      title="Excluir Aluno"
      :message="`Tem certeza que deseja excluir o aluno '${alunoToDelete?.nome}'? Esta ação não pode ser desfeita.`"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAlunosStore } from '@/stores/alunos'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

const alunosStore = useAlunosStore()

const searchQuery = ref('')
const filterStatus = ref('')
const showDeleteModal = ref(false)
const alunoToDelete = ref(null)

onMounted(async () => {
  await alunosStore.fetchAlunos()
})

const filteredAlunos = computed(() => {
  return alunosStore.alunos.filter((aluno) => {
    const matchSearch = aluno.nome.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      aluno.cpf.includes(searchQuery.value) ||
      aluno.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = filterStatus.value === '' || aluno.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

function confirmDelete(aluno) {
  alunoToDelete.value = aluno
  showDeleteModal.value = true
}

async function handleDelete() {
  if (alunoToDelete.value) {
    await alunosStore.deleteAluno(alunoToDelete.value.id)
    showDeleteModal.value = false
    alunoToDelete.value = null
  }
}
</script>
