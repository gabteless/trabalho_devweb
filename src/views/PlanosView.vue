<template>
  <div>
    <div class="page-header">
      <div>
        <h2>Planos</h2>
        <p>Gerencie os planos disponíveis na academia</p>
      </div>
      <router-link to="/planos/novo" class="btn-primary-custom">
        <i class="bi bi-plus-lg"></i>
        Novo Plano
      </router-link>
    </div>

    <div v-if="planosStore.loading" class="empty-state">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3">Carregando planos...</p>
    </div>

    <div v-else-if="planosStore.planos.length === 0" class="empty-state card-custom">
      <i class="bi bi-bookmark-star"></i>
      <p>Nenhum plano cadastrado</p>
    </div>

    <div v-else class="row g-4">
      <div v-for="plano in planosStore.planos" :key="plano.id" class="col-12 col-md-6 col-xl-4">
        <div class="card-custom plano-card">
          <div class="plano-header">
            <div class="plano-icon">
              <i class="bi bi-bookmark-star-fill"></i>
            </div>
            <div class="plano-actions">
              <router-link :to="`/planos/${plano.id}/editar`" class="btn-icon btn-edit" title="Editar">
                <i class="bi bi-pencil-square"></i>
              </router-link>
              <button class="btn-icon btn-delete" title="Excluir" @click="confirmDelete(plano)">
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </div>

          <h3 class="plano-nome">{{ plano.nome }}</h3>

          <div class="plano-price">
            <span class="price-value">{{ formatCurrency(plano.valor) }}</span>
            <span class="price-period">/ {{ plano.duracao === 1 ? 'mês' : plano.duracao + ' meses' }}</span>
          </div>

          <p class="plano-beneficios">{{ plano.beneficios }}</p>

          <div class="plano-footer">
            <span class="plano-duracao">
              <i class="bi bi-calendar3"></i>
              {{ plano.duracao }} {{ plano.duracao === 1 ? 'mês' : 'meses' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <ConfirmModal
      :show="showDeleteModal"
      title="Excluir Plano"
      :message="`Tem certeza que deseja excluir o plano '${planoToDelete?.nome}'? Esta ação não pode ser desfeita.`"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePlanosStore } from '@/stores/planos'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

const planosStore = usePlanosStore()

const showDeleteModal = ref(false)
const planoToDelete = ref(null)

onMounted(async () => {
  await planosStore.fetchPlanos()
})

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function confirmDelete(plano) {
  planoToDelete.value = plano
  showDeleteModal.value = true
}

async function handleDelete() {
  if (planoToDelete.value) {
    await planosStore.deletePlano(planoToDelete.value.id)
    showDeleteModal.value = false
    planoToDelete.value = null
  }
}
</script>

<style scoped>
.plano-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.plano-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.plano-icon {
  width: 44px;
  height: 44px;
  background: rgba(var(--primary-rgb), 0.12);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--primary-light);
}

.plano-actions {
  display: flex;
  gap: 4px;
}

.plano-nome {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.plano-price {
  margin-bottom: 16px;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-light);
}

.price-period {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-left: 2px;
}

.plano-beneficios {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.6;
  flex: 1;
  margin-bottom: 16px;
}

.plano-footer {
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.plano-duracao {
  font-size: 0.82rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
