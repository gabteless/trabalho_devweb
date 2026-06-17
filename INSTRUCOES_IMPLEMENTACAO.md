# Instruções de Implementação — Telas de Planos e Financeiro

Este documento contém **todas as instruções detalhadas** para implementar as funcionalidades de **Planos** e **Financeiro** no Sistema de Gestão de Academia. Siga cada passo na ordem indicada.

---

## Visão Geral

O projeto é um sistema de gestão de academia com Vue.js 3 + Pinia + Bootstrap 5 (dark theme) + json-server como backend fake.

**O que já existe no projeto:**
- Sistema de login e autenticação
- CRUD de Alunos (listagem, cadastro, edição, exclusão) — sem campo de plano
- Dashboard (versão simplificada, só com dados de alunos)
- Layout com Sidebar (apenas Dashboard e Alunos) e Topbar
- Componentes reutilizáveis: `ConfirmModal`, `StatusBadge`, `StatsCard`
- CSS global completo com todas as classes necessárias

**O que precisa ser feito (nesta ordem):**
1. Criar Store de Planos (`src/stores/planos.js`)
2. Criar Store de Financeiro (`src/stores/financeiro.js`)
3. Adicionar rotas de Planos e Financeiro no router (`src/router/index.js`)
4. Adicionar links de Planos e Financeiro na Sidebar (`src/components/layout/AppSidebar.vue`)
5. Criar View de listagem de Planos (`src/views/PlanosView.vue`)
6. Criar View de formulário de Plano (`src/views/PlanoFormView.vue`)
7. Criar View de listagem Financeiro (`src/views/FinanceiroView.vue`)
8. Criar View de formulário de Pagamento (`src/views/PagamentoFormView.vue`)
9. Modificar `AlunosView.vue` para incluir coluna de Plano
10. Modificar `AlunoFormView.vue` para incluir campo select de Plano
11. Modificar Dashboard (`src/views/DashboardView.vue`) para incluir dados de planos e financeiro

---

## Como Rodar o Projeto

```bash
# Terminal 1 — Backend fake (json-server)
npx json-server db.json --port 3001

# Terminal 2 — Frontend (Vite)
npm run dev
```

- Frontend: `http://localhost:5173/`
- Backend: `http://localhost:3001/`
- Login: `admin@academia.com` / `123456`

---

## Dados do Backend (db.json)

O arquivo `db.json` na raiz do projeto **JÁ CONTÉM** os dados de planos e pagamentos. Os endpoints disponíveis:

### Planos — `GET /planos`
```json
{
  "id": "1",
  "nome": "Mensal Básico",
  "valor": 89.90,
  "duracao": 1,
  "beneficios": "Acesso à musculação e cardio de segunda a sexta"
}
```

### Pagamentos — `GET /pagamentos`
```json
{
  "id": "1",
  "alunoId": 1,
  "valor": 89.90,
  "dataVencimento": "2026-06-15",
  "dataPagamento": "2026-06-14",
  "status": "pago"
}
```

### Operações CRUD (json-server)
| Operação | Método | Endpoint |
|----------|--------|----------|
| Listar todos | GET | `/planos` ou `/pagamentos` |
| Buscar por ID | GET | `/planos/:id` ou `/pagamentos/:id` |
| Criar | POST | `/planos` ou `/pagamentos` |
| Atualizar | PUT | `/planos/:id` ou `/pagamentos/:id` |
| Deletar | DELETE | `/planos/:id` ou `/pagamentos/:id` |

---

## Arquivos de Referência (já existentes)

Para seguir o mesmo padrão, use estes arquivos como referência:

- **Store de referência:** `src/stores/alunos.js` — padrão de CRUD com Pinia
- **View de listagem de referência:** `src/views/AlunosView.vue` — tabela com busca, filtros, exclusão
- **View de formulário de referência:** `src/views/AlunoFormView.vue` — form com criação/edição

---

## Rotas (PRECISAM SER ADICIONADAS)

As rotas para Planos e Financeiro **precisam ser adicionadas** em `src/router/index.js`. Adicione-as **depois** da rota de `aluno-editar` e **antes** do fechamento do array `routes`:

```javascript
// ADICIONAR depois da rota aluno-editar:
    {
      path: '/planos',
      name: 'planos',
      component: () => import('@/views/PlanosView.vue'),
      meta: { requiresAuth: true, title: 'Planos' }
    },
    {
      path: '/planos/novo',
      name: 'plano-novo',
      component: () => import('@/views/PlanoFormView.vue'),
      meta: { requiresAuth: true, title: 'Novo Plano' }
    },
    {
      path: '/planos/:id/editar',
      name: 'plano-editar',
      component: () => import('@/views/PlanoFormView.vue'),
      meta: { requiresAuth: true, title: 'Editar Plano' }
    },
    {
      path: '/financeiro',
      name: 'financeiro',
      component: () => import('@/views/FinanceiroView.vue'),
      meta: { requiresAuth: true, title: 'Financeiro' }
    },
    {
      path: '/financeiro/novo',
      name: 'pagamento-novo',
      component: () => import('@/views/PagamentoFormView.vue'),
      meta: { requiresAuth: true, title: 'Novo Pagamento' }
    },
    {
      path: '/financeiro/:id/editar',
      name: 'pagamento-editar',
      component: () => import('@/views/PagamentoFormView.vue'),
      meta: { requiresAuth: true, title: 'Editar Pagamento' }
    }
```

---

## Sidebar (PRECISA SER MODIFICADA)

A Sidebar em `src/components/layout/AppSidebar.vue` precisa ser atualizada para incluir os links de Planos e Financeiro. Encontre o array `menuItems` e **substitua** por:

```javascript
const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'bi bi-grid-1x2-fill' },
  { to: '/alunos', label: 'Alunos', icon: 'bi bi-people-fill' },
  { to: '/planos', label: 'Planos', icon: 'bi bi-bookmark-star-fill' },
  { to: '/financeiro', label: 'Financeiro', icon: 'bi bi-wallet2' }
]
```

---

## Componentes Reutilizáveis Disponíveis

### `ConfirmModal` (`src/components/ui/ConfirmModal.vue`)
```vue
<ConfirmModal
  :show="showDeleteModal"
  title="Excluir Plano"
  message="Tem certeza que deseja excluir?"
  @confirm="handleDelete"
  @cancel="showDeleteModal = false"
/>
```
Props: `show` (Boolean), `title` (String), `message` (String).
Events: `@confirm`, `@cancel`.

### `StatusBadge` (`src/components/ui/StatusBadge.vue`)
```vue
<StatusBadge :status="pagamento.status" />
```
Props: `status` (String) — aceita: "ativo", "inativo", "pago", "pendente", "atrasado".

### `StatsCard` (`src/components/ui/StatsCard.vue`)
```vue
<StatsCard
  label="Pagos"
  :value="10"
  icon="bi bi-check-circle-fill"
  variant="success"
  :isCurrency="false"
/>
```
Props: `label` (String), `value` (Number|String), `icon` (String), `variant` (String: "primary", "success", "warning", "danger", "accent"), `isCurrency` (Boolean).

---

## Classes CSS Globais Disponíveis

Todas definidas em `src/assets/styles/main.css`:

| Classe | Uso |
|--------|-----|
| `.page-header` | Cabeçalho da página (flex, space-between) |
| `.card-custom` | Card base com borda, radius, padding |
| `.table-container` | Container da tabela com borda e radius |
| `.table-header` | Header da tabela (flex, busca + filtros) |
| `.table-custom` | Tabela estilizada (thead/tbody) |
| `.btn-primary-custom` | Botão primário com gradiente |
| `.btn-secondary-custom` | Botão secundário |
| `.btn-danger-custom` | Botão de perigo (vermelho) |
| `.btn-icon` | Botão ícone (34x34px) |
| `.btn-icon.btn-edit` | Botão ícone editar (azul) |
| `.btn-icon.btn-delete` | Botão ícone excluir (vermelho) |
| `.form-card` | Card para formulários |
| `.form-label-custom` | Label de formulário |
| `.form-control-custom` | Input de formulário (dark theme) |
| `.form-select-custom` | Select de formulário (dark theme) |
| `.search-box` | Container de busca com ícone |
| `.filter-bar` | Barra de filtros |
| `.filter-btn` | Botão de filtro (pill shape) |
| `.filter-btn.active` | Filtro ativo |
| `.empty-state` | Estado vazio centralizado |
| `.stats-card` | Card de estatística |

---

## PASSO 1: Criar `src/stores/planos.js`

Este é o store Pinia para gerenciar o estado dos planos. Segue o mesmo padrão do `stores/alunos.js`.

**Crie o arquivo `src/stores/planos.js` com o seguinte conteúdo:**

```javascript
import { defineStore } from 'pinia'
import api from '@/services/api'

export const usePlanosStore = defineStore('planos', {
  state: () => ({
    planos: [],
    loading: false,
    error: null
  }),

  getters: {
    totalPlanos: (state) => state.planos.length,
    getPlanoById: (state) => (id) => state.planos.find((p) => p.id === id),
    getPlanoNome: (state) => (id) => {
      const plano = state.planos.find((p) => p.id === id)
      return plano ? plano.nome : '—'
    }
  },

  actions: {
    async fetchPlanos() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/planos')
        this.planos = response.data
      } catch (error) {
        this.error = 'Erro ao carregar planos'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async fetchPlano(id) {
      try {
        const response = await api.get(`/planos/${id}`)
        return response.data
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao carregar plano')
      }
    },

    async createPlano(plano) {
      try {
        const response = await api.post('/planos', plano)
        this.planos.push(response.data)
        return response.data
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao cadastrar plano')
      }
    },

    async updatePlano(id, plano) {
      try {
        const response = await api.put(`/planos/${id}`, plano)
        const index = this.planos.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.planos[index] = response.data
        }
        return response.data
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao atualizar plano')
      }
    },

    async deletePlano(id) {
      try {
        await api.delete(`/planos/${id}`)
        this.planos = this.planos.filter((p) => p.id !== id)
      } catch (error) {
        console.error(error)
        throw new Error('Erro ao excluir plano')
      }
    }
  }
})
```

---

## PASSO 2: Criar `src/stores/financeiro.js`

Store Pinia para gerenciar pagamentos. **IMPORTANTE:** O getter `receitaMes` é usado no Dashboard. Sem este store, o Dashboard vai quebrar.

**Crie o arquivo `src/stores/financeiro.js` com o seguinte conteúdo:**

```javascript
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
```

---

## PASSO 3: Criar `src/views/PlanosView.vue`

Tela de listagem dos planos em formato de cards (grid). **Inclui CSS scoped próprio.**

**Crie o arquivo `src/views/PlanosView.vue` com o seguinte conteúdo:**

```vue
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
```

---

## PASSO 4: Criar `src/views/PlanoFormView.vue`

Formulário para cadastro e edição de planos. Diferencia pelo `route.params.id`.

**Crie o arquivo `src/views/PlanoFormView.vue` com o seguinte conteúdo:**

```vue
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
```

---

## PASSO 5: Criar `src/views/FinanceiroView.vue`

Tela de listagem financeira com cards de resumo, tabela de pagamentos, busca e filtros por status.

**Crie o arquivo `src/views/FinanceiroView.vue` com o seguinte conteúdo:**

```vue
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
```

---

## PASSO 6: Criar `src/views/PagamentoFormView.vue`

Formulário para registrar/editar pagamentos. Popula o select de alunos via `alunosStore`.

**Crie o arquivo `src/views/PagamentoFormView.vue` com o seguinte conteúdo:**

```vue
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
```

---

## PASSO 7: Modificar `src/views/AlunosView.vue`

A tela de Alunos precisa exibir o nome do plano de cada aluno e importar o `planosStore`.

### 7.1 — No `<script setup>`, adicionar import e instância do planosStore:

Depois da linha `import { useAlunosStore } from '@/stores/alunos'`, adicione:
```javascript
import { usePlanosStore } from '@/stores/planos'
```

Depois da linha `const alunosStore = useAlunosStore()`, adicione:
```javascript
const planosStore = usePlanosStore()
```

### 7.2 — No `onMounted`, carregar planos junto com alunos:

Substitua:
```javascript
onMounted(async () => {
  await alunosStore.fetchAlunos()
})
```

Por:
```javascript
onMounted(async () => {
  await Promise.all([
    alunosStore.fetchAlunos(),
    planosStore.fetchPlanos()
  ])
})
```

### 7.3 — No `<template>`, adicionar coluna "Plano" na tabela:

No `<thead>`, depois de `<th>E-mail</th>`, adicione:
```html
<th>Plano</th>
```

No `<tbody>`, depois de `<td>{{ aluno.email }}</td>`, adicione:
```html
<td>{{ planosStore.getPlanoNome(aluno.planoId) }}</td>
```

---

## PASSO 8: Modificar `src/views/AlunoFormView.vue`

O formulário de aluno precisa incluir um campo select de Plano.

### 8.1 — No `<script setup>`, adicionar import e instância do planosStore:

Depois da linha `import { useAlunosStore } from '@/stores/alunos'`, adicione:
```javascript
import { usePlanosStore } from '@/stores/planos'
```

Depois da linha `const alunosStore = useAlunosStore()`, adicione:
```javascript
const planosStore = usePlanosStore()
```

### 8.2 — No `form` reactive, adicionar campo `planoId`:

Substitua:
```javascript
const form = reactive({
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  status: 'ativo'
})
```

Por:
```javascript
const form = reactive({
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  planoId: '',
  status: 'ativo'
})
```

### 8.3 — No `onMounted`, carregar planos antes de tudo:

Substitua:
```javascript
onMounted(async () => {
  if (isEditing.value) {
```

Por:
```javascript
onMounted(async () => {
  await planosStore.fetchPlanos()

  if (isEditing.value) {
```

### 8.4 — Adicionar função `formatCurrency`:

Antes da função `handleSubmit`, adicione:
```javascript
function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
```

### 8.5 — No `<template>`, adicionar campo select de Plano:

Antes do campo de Status, adicione um novo `<div class="col-12 col-md-6">` com o select de Plano:
```html
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
```

---

## PASSO 9: Modificar `src/views/DashboardView.vue`

O Dashboard precisa ser atualizado para incluir dados de planos e financeiro. **Substitua todo o conteúdo** do arquivo `src/views/DashboardView.vue` pelo seguinte:

```vue
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
```

---

## Checklist Final

Após implementar todos os passos, verifique:

- [ ] `src/stores/planos.js` — criado (PASSO 1)
- [ ] `src/stores/financeiro.js` — criado (PASSO 2)
- [ ] `src/router/index.js` — rotas de Planos e Financeiro adicionadas (PASSO 3)
- [ ] `src/components/layout/AppSidebar.vue` — links de Planos e Financeiro adicionados (PASSO 4)
- [ ] `src/views/PlanosView.vue` — criado (PASSO 5)
- [ ] `src/views/PlanoFormView.vue` — criado (PASSO 6)
- [ ] `src/views/AlunosView.vue` — coluna de Plano adicionada (PASSO 7)
- [ ] `src/views/AlunoFormView.vue` — campo select de Plano adicionado (PASSO 8)
- [ ] `src/views/FinanceiroView.vue` — criado (PASSO 5 Financeiro)
- [ ] `src/views/PagamentoFormView.vue` — criado (PASSO 6 Financeiro)
- [ ] `src/views/DashboardView.vue` — atualizado com planos e financeiro (PASSO 9)
- [ ] CRUD de Planos funciona (criar, listar, editar, excluir)
- [ ] CRUD de Pagamentos funciona (criar, listar, editar, excluir)
- [ ] Dashboard mostra os 4 cards de estatísticas (Alunos, Planos, Pendentes, Receita)
- [ ] Dashboard mostra tabela de últimos pagamentos
- [ ] Dashboard mostra tabela de alunos recentes com nome do plano
- [ ] Navegação pela Sidebar funciona para Planos e Financeiro
- [ ] Filtros de status funcionam no Financeiro
- [ ] Busca por nome de aluno funciona no Financeiro
- [ ] Tela de Alunos mostra o nome do plano de cada aluno
- [ ] Formulário de Aluno tem campo select de Plano

---

## Observações Importantes

1. **json-server deve estar rodando** na porta 3001 para as requisições funcionarem
2. O `db.json` já contém 5 planos e 15 pagamentos de exemplo
3. A `AlunosView.vue` usa o `planosStore` para mostrar o nome do plano — o store de planos precisa existir para a tela de Alunos funcionar corretamente
4. A `AlunoFormView.vue` também usa o `planosStore` para popular o select de planos no formulário
5. Todas as rotas e links de sidebar **já estão configurados** — basta criar os arquivos
