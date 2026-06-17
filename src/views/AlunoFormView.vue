<template>
  <div>
    <div class="page-header">
      <div>
        <h2>{{ isEditing ? 'Editar Aluno' : 'Novo Aluno' }}</h2>
        <p>{{ isEditing ? 'Atualize os dados do aluno' : 'Preencha os dados para cadastrar um novo aluno' }}</p>
      </div>
      <router-link to="/alunos" class="btn-secondary-custom">
        <i class="bi bi-arrow-left"></i>
        Voltar
      </router-link>
    </div>

    <div class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label for="nome" class="form-label-custom">Nome Completo *</label>
            <input
              id="nome"
              v-model="form.nome"
              type="text"
              class="form-control form-control-custom"
              placeholder="Nome do aluno"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <label for="cpf" class="form-label-custom">CPF *</label>
            <input
              id="cpf"
              v-model="form.cpf"
              type="text"
              class="form-control form-control-custom"
              placeholder="000.000.000-00"
              required
              maxlength="14"
              @input="maskCpf"
            />
          </div>

          <div class="col-12 col-md-6">
            <label for="telefone" class="form-label-custom">Telefone *</label>
            <input
              id="telefone"
              v-model="form.telefone"
              type="text"
              class="form-control form-control-custom"
              placeholder="(00) 00000-0000"
              required
              maxlength="15"
              @input="maskPhone"
            />
          </div>

          <div class="col-12 col-md-6">
            <label for="email" class="form-label-custom">E-mail *</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-control form-control-custom"
              placeholder="email@exemplo.com"
              required
            />
          </div>

          <div class="col-12 col-md-6">
            <label for="plano" class="form-label-custom">Plano *</label>
            <select
              id="plano"
              v-model="form.planoId"
              class="form-select form-select-custom"
              required
            >
              <option value="" disabled>Selecione um plano</option>
              <option v-for="plano in planosStore.planos" :key="plano.id" :value="plano.id">
                {{ plano.nome }} — {{ formatCurrency(plano.valor) }}
              </option>
            </select>
          </div>

          <div class="col-12 col-md-6">
            <label for="status" class="form-label-custom">Status *</label>
            <select
              id="status"
              v-model="form.status"
              class="form-select form-select-custom"
              required
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>

        <div class="d-flex gap-3 mt-4 justify-content-end">
          <router-link to="/alunos" class="btn-secondary-custom">Cancelar</router-link>
          <button type="submit" class="btn-primary-custom" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-check-lg"></i>
            {{ isEditing ? 'Salvar Alterações' : 'Cadastrar Aluno' }}
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
import { usePlanosStore } from '@/stores/planos'

const route = useRoute()
const router = useRouter()
const alunosStore = useAlunosStore()
const planosStore = usePlanosStore()

const saving = ref(false)

const form = reactive({
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  planoId: '',
  status: 'ativo'
})

const isEditing = computed(() => !!route.params.id)

onMounted(async () => {
  await planosStore.fetchPlanos()

  if (isEditing.value) {
    try {
      const aluno = await alunosStore.fetchAluno(Number(route.params.id))
      Object.assign(form, aluno)
    } catch {
      router.push('/alunos')
    }
  }
})

function maskCpf(e) {
  let v = e.target.value.replace(/\D/g, '')
  if (v.length > 11) v = v.substring(0, 11)
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  form.cpf = v
}

function maskPhone(e) {
  let v = e.target.value.replace(/\D/g, '')
  if (v.length > 11) v = v.substring(0, 11)
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
  v = v.replace(/(\d{5})(\d)/, '$1-$2')
  form.telefone = v
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function handleSubmit() {
  saving.value = true
  try {
    if (isEditing.value) {
      await alunosStore.updateAluno(Number(route.params.id), { ...form })
    } else {
      await alunosStore.createAluno({ ...form })
    }
    router.push('/alunos')
  } catch (error) {
    alert(error.message)
  } finally {
    saving.value = false
  }
}
</script>
