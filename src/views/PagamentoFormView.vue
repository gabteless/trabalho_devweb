<template>
  <div>
    <div class="page-header">
      <div>
        <h2>{{ isEditing ? 'Editar Pagamento' : 'Novo Pagamento' }}</h2>
        <p>{{ isEditing ? 'Atualize os dados do pagamento' : 'Registre um novo pagamento' }}</p>
      </div>
      <router-link to="/financeiro" class="btn-secondary-custom">
        <i class="bi bi-arrow-left"></i>
        Voltar
      </router-link>
    </div>

    <div class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label for="aluno" class="form-label-custom">Aluno *</label>
            <select
              id="aluno"
              v-model.number="form.alunoId"
              class="form-select form-select-custom"
              required
            >
              <option value="" disabled>Selecione um aluno</option>
              <option v-for="aluno in alunosStore.alunos" :key="aluno.id" :value="aluno.id">
                {{ aluno.nome }}
              </option>
            </select>
          </div>

          <div class="col-12 col-md-6">
            <label for="valor" class="form-label-custom">Valor (R$) *</label>
            <input
              id="valor"
              v-model.number="form.valor"
              type="number"
              step="0.01"
              min="0"
              class="form-control form-control-custom"
              placeholder="0.00"
              required
            />
          </div>

          <div class="col-12 col-md-4">
            <label for="vencimento" class="form-label-custom">Data de Vencimento *</label>
            <input
              id="vencimento"
              v-model="form.dataVencimento"
              type="date"
              class="form-control form-control-custom"
              required
            />
          </div>

          <div class="col-12 col-md-4">
            <label for="pagamento" class="form-label-custom">Data de Pagamento</label>
            <input
              id="pagamento"
              v-model="form.dataPagamento"
              type="date"
              class="form-control form-control-custom"
            />
          </div>

          <div class="col-12 col-md-4">
            <label for="status" class="form-label-custom">Status *</label>
            <select
              id="status"
              v-model="form.status"
              class="form-select form-select-custom"
              required
            >
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="atrasado">Atrasado</option>
            </select>
          </div>
        </div>

        <div class="d-flex gap-3 mt-4 justify-content-end">
          <router-link to="/financeiro" class="btn-secondary-custom">Cancelar</router-link>
          <button type="submit" class="btn-primary-custom" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-check-lg"></i>
            {{ isEditing ? 'Salvar Alterações' : 'Registrar Pagamento' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAlunosStore } from '@/stores/alunos'
import { useFinanceiroStore } from '@/stores/financeiro'

const route = useRoute()
const router = useRouter()
const alunosStore = useAlunosStore()
const financeiroStore = useFinanceiroStore()

const saving = ref(false)

const form = reactive({
  alunoId: '',
  valor: '',
  dataVencimento: '',
  dataPagamento: '',
  status: 'pendente'
})

const isEditing = computed(() => !!route.params.id)

onMounted(async () => {
  await alunosStore.fetchAlunos()

  if (isEditing.value) {
    try {
      const pagamento = await financeiroStore.fetchPagamento(Number(route.params.id))
      Object.assign(form, {
        ...pagamento,
        dataPagamento: pagamento.dataPagamento || ''
      })
    } catch {
      router.push('/financeiro')
    }
  }
})

async function handleSubmit() {
  saving.value = true
  try {
    const data = {
      ...form,
      dataPagamento: form.dataPagamento || null
    }

    if (isEditing.value) {
      await financeiroStore.updatePagamento(Number(route.params.id), data)
    } else {
      await financeiroStore.createPagamento(data)
    }
    router.push('/financeiro')
  } catch (error) {
    alert(error.message)
  } finally {
    saving.value = false
  }
}
</script>
