<template>
  <div>
    <div class="page-header">
      <div>
        <h2>{{ isEditing ? 'Editar Plano' : 'Novo Plano' }}</h2>
        <p>{{ isEditing ? 'Atualize as informações do plano' : 'Preencha os dados para cadastrar um novo plano' }}</p>
      </div>
      <router-link to="/planos" class="btn-secondary-custom">
        <i class="bi bi-arrow-left"></i>
        Voltar
      </router-link>
    </div>

    <div class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label for="nome" class="form-label-custom">Nome do Plano *</label>
            <input
              id="nome"
              v-model="form.nome"
              type="text"
              class="form-control form-control-custom"
              placeholder="Ex: Mensal Básico"
              required
            />
          </div>

          <div class="col-12 col-md-3">
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

          <div class="col-12 col-md-3">
            <label for="duracao" class="form-label-custom">Duração (meses) *</label>
            <input
              id="duracao"
              v-model.number="form.duracao"
              type="number"
              min="1"
              max="24"
              class="form-control form-control-custom"
              placeholder="1"
              required
            />
          </div>

          <div class="col-12">
            <label for="beneficios" class="form-label-custom">Benefícios *</label>
            <textarea
              id="beneficios"
              v-model="form.beneficios"
              class="form-control form-control-custom"
              placeholder="Descreva os benefícios inclusos neste plano..."
              rows="4"
              required
            ></textarea>
          </div>
        </div>

        <div class="d-flex gap-3 mt-4 justify-content-end">
          <router-link to="/planos" class="btn-secondary-custom">Cancelar</router-link>
          <button type="submit" class="btn-primary-custom" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-check-lg"></i>
            {{ isEditing ? 'Salvar Alterações' : 'Cadastrar Plano' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlanosStore } from '@/stores/planos'

const route = useRoute()
const router = useRouter()
const planosStore = usePlanosStore()

const saving = ref(false)

const form = reactive({
  nome: '',
  valor: '',
  duracao: 1,
  beneficios: ''
})

const isEditing = computed(() => !!route.params.id)

onMounted(async () => {
  if (isEditing.value) {
    try {
      const plano = await planosStore.fetchPlano(Number(route.params.id))
      Object.assign(form, plano)
    } catch {
      router.push('/planos')
    }
  }
})

async function handleSubmit() {
  saving.value = true
  try {
    if (isEditing.value) {
      await planosStore.updatePlano(Number(route.params.id), { ...form })
    } else {
      await planosStore.createPlano({ ...form })
    }
    router.push('/planos')
  } catch (error) {
    alert(error.message)
  } finally {
    saving.value = false
  }
}
</script>
