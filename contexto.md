# Contexto — Telas de Planos e Financeiro

Este documento contém todas as instruções necessárias para que outro desenvolvedor implemente as telas de **Planos** e **Financeiro** no Sistema de Gestão de Academia.

---

## 1. Visão Geral do Projeto

### Stack Tecnológica
| Item | Tecnologia |
|------|------------|
| Framework | Vue.js 3 (Composition API com `<script setup>`) |
| Gerenciamento de estado | Pinia |
| Estilização | Bootstrap 5 + CSS customizado (dark theme) |
| Build tool | Vite |
| Roteamento | Vue Router 4 |
| HTTP Client | Axios |
| Ícones | Bootstrap Icons |
| Backend fake | json-server (via `npx json-server db.json --port 3001`) |

### Como Rodar o Projeto
```bash
# Terminal 1 — Backend fake
npx json-server db.json --port 3001

# Terminal 2 — Frontend
npm run dev
```
O frontend roda em `http://localhost:5173/` e o backend fake em `http://localhost:3001/`.

Login: `admin@academia.com` / `123456`

---

## 2. Estrutura de Pastas Existente

```
src/
├── main.js                          # Entry point
├── App.vue                          # Root component
├── assets/styles/main.css           # CSS global (dark theme, componentes, animações)
├── router/index.js                  # Rotas (JÁ CONTÉM as rotas de planos e financeiro)
├── services/api.js                  # Instância Axios (baseURL: http://localhost:3001)
├── stores/
│   ├── auth.js                      # Store de autenticação
│   ├── alunos.js                    # Store de alunos (CRUD) — JÁ EXISTE
│   ├── planos.js                    # ⚠️ PRECISA SER CRIADO
│   └── financeiro.js                # ⚠️ PRECISA SER CRIADO
├── components/
│   ├── layout/
│   │   ├── AppLayout.vue            # Layout com sidebar + topbar
│   │   ├── AppSidebar.vue           # Sidebar de navegação
│   │   └── AppTopbar.vue            # Topbar com info do usuário
│   └── ui/
│       ├── ConfirmModal.vue         # Modal de confirmação de exclusão
│       ├── StatusBadge.vue          # Badge de status (pago/pendente/atrasado)
│       └── StatsCard.vue            # Card de estatística
└── views/
    ├── LoginView.vue                # JÁ EXISTE
    ├── DashboardView.vue            # JÁ EXISTE
    ├── AlunosView.vue               # JÁ EXISTE (referência de padrão)
    ├── AlunoFormView.vue            # JÁ EXISTE (referência de padrão)
    ├── PlanosView.vue               # ⚠️ PRECISA SER CRIADO
    ├── PlanoFormView.vue            # ⚠️ PRECISA SER CRIADO
    ├── FinanceiroView.vue           # ⚠️ PRECISA SER CRIADO
    └── PagamentoFormView.vue        # ⚠️ PRECISA SER CRIADO
```

---

## 3. Dados do Backend (db.json)

O arquivo `db.json` na raiz do projeto JÁ CONTÉM os dados de planos e pagamentos. Os endpoints disponíveis são:

### Planos — `http://localhost:3001/planos`
```json
{
  "id": "1",
  "nome": "Mensal Básico",
  "valor": 89.90,
  "duracao": 1,
  "beneficios": "Acesso à musculação e cardio de segunda a sexta"
}
```
Campos: `id`, `nome` (string), `valor` (number), `duracao` (number, em meses), `beneficios` (string).

Existem 5 planos cadastrados: Mensal Básico, Mensal Completo, Trimestral, Semestral, Anual Premium.

### Pagamentos — `http://localhost:3001/pagamentos`
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
Campos: `id`, `alunoId` (referência ao aluno), `valor` (number), `dataVencimento` (string YYYY-MM-DD), `dataPagamento` (string YYYY-MM-DD ou null), `status` ("pago" | "pendente" | "atrasado").

Existem 15 pagamentos cadastrados.

### Operações CRUD suportadas pelo json-server
| Operação | Método | Endpoint |
|----------|--------|----------|
| Listar todos | GET | `/planos` ou `/pagamentos` |
| Buscar por ID | GET | `/planos/:id` ou `/pagamentos/:id` |
| Criar | POST | `/planos` ou `/pagamentos` |
| Atualizar | PUT | `/planos/:id` ou `/pagamentos/:id` |
| Deletar | DELETE | `/planos/:id` ou `/pagamentos/:id` |

> **IMPORTANTE**: O json-server v1 beta NÃO suporta múltiplos query params para filtragem simultânea. Use apenas 1 param por vez ou filtre no front-end.

---

## 4. Rotas (já configuradas no router)

As rotas para Planos e Financeiro **já estão configuradas** em `src/router/index.js`. Você só precisa criar os arquivos de view correspondentes:

```javascript
// Planos
{ path: '/planos',           name: 'planos',          component: () => import('@/views/PlanosView.vue'),     meta: { requiresAuth: true, title: 'Planos' } }
{ path: '/planos/novo',      name: 'plano-novo',      component: () => import('@/views/PlanoFormView.vue'),   meta: { requiresAuth: true, title: 'Novo Plano' } }
{ path: '/planos/:id/editar', name: 'plano-editar',   component: () => import('@/views/PlanoFormView.vue'),   meta: { requiresAuth: true, title: 'Editar Plano' } }

// Financeiro
{ path: '/financeiro',           name: 'financeiro',       component: () => import('@/views/FinanceiroView.vue'),      meta: { requiresAuth: true, title: 'Financeiro' } }
{ path: '/financeiro/novo',      name: 'pagamento-novo',   component: () => import('@/views/PagamentoFormView.vue'),   meta: { requiresAuth: true, title: 'Novo Pagamento' } }
{ path: '/financeiro/:id/editar', name: 'pagamento-editar', component: () => import('@/views/PagamentoFormView.vue'), meta: { requiresAuth: true, title: 'Editar Pagamento' } }
```

Os links na Sidebar (`AppSidebar.vue`) para `/planos` e `/financeiro` **já estão configurados**.

---

## 5. Arquivos a Criar

### 5.1 Store — `src/stores/planos.js`

Store Pinia para gerenciar o estado dos planos. Deve seguir o mesmo padrão do `stores/alunos.js`.

**State:**
- `planos` (array) — lista de planos
- `loading` (boolean)
- `error` (string | null)

**Getters:**
- `totalPlanos` — contagem total
- `getPlanoById(id)` — busca plano por ID
- `getPlanoNome(id)` — retorna nome do plano (usado em outras views como Alunos e Dashboard)

**Actions (CRUD via Axios):**
- `fetchPlanos()` — GET `/planos`
- `fetchPlano(id)` — GET `/planos/:id`
- `createPlano(plano)` — POST `/planos`
- `updatePlano(id, plano)` — PUT `/planos/:id`
- `deletePlano(id)` — DELETE `/planos/:id`

**Importação do serviço de API:**
```javascript
import api from '@/services/api'
```

---

### 5.2 Store — `src/stores/financeiro.js`

Store Pinia para gerenciar pagamentos.

**State:**
- `pagamentos` (array)
- `loading` (boolean)
- `error` (string | null)

**Getters:**
- `totalPagamentos` — contagem total
- `pagamentosPagos` — filtro por status "pago"
- `pagamentosPendentes` — filtro por status "pendente"
- `pagamentosAtrasados` — filtro por status "atrasado"
- `totalPendentes` — contagem de pendentes
- `totalAtrasados` — contagem de atrasados
- `receitaMes` — soma dos valores de pagamentos pagos no mês atual
- `getPagamentoById(id)`

**Actions (CRUD via Axios):**
- `fetchPagamentos()` — GET `/pagamentos`
- `fetchPagamento(id)` — GET `/pagamentos/:id`
- `createPagamento(pagamento)` — POST `/pagamentos`
- `updatePagamento(id, pagamento)` — PUT `/pagamentos/:id`
- `deletePagamento(id)` — DELETE `/pagamentos/:id`

> **NOTA**: O getter `receitaMes` é usado no DashboardView. Sem o store de financeiro, o Dashboard vai quebrar. Crie este store primeiro.

---

### 5.3 View — `src/views/PlanosView.vue`

Tela de listagem dos planos da academia.

**Layout**: Cards em grid (não tabela), usando Bootstrap grid `row g-4` com colunas `col-12 col-md-6 col-xl-4`.

**Cada card de plano deve exibir:**
- Ícone (Bootstrap Icons: `bi-bookmark-star-fill`)
- Nome do plano
- Valor formatado em R$ (usar `toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })`)
- Duração (ex: "1 mês", "3 meses")
- Benefícios (texto descritivo)
- Botões de ação: Editar (link para `/planos/:id/editar`) e Excluir (com modal de confirmação)

**Estados:**
- Loading: spinner centralizado
- Vazio: mensagem "Nenhum plano cadastrado"
- Preenchido: grid de cards

**Componentes a importar:**
- `ConfirmModal` de `@/components/ui/ConfirmModal.vue`

**CSS scoped necessário** (os cards precisam de estilos próprios pois não estão no CSS global):
- `.plano-card` — flex column, height 100%
- `.plano-header` — flex, space-between
- `.plano-icon` — 44x44px, background rgba com primary
- `.plano-nome` — font-size 1.15rem, weight 600
- `.price-value` — font-size 1.5rem, weight 700, cor `var(--primary-light)`
- `.price-period` — font-size 0.85rem, cor `var(--text-muted)`
- `.plano-beneficios` — font-size 0.88rem, flex 1
- `.plano-footer` — border-top, padding-top

---

### 5.4 View — `src/views/PlanoFormView.vue`

Formulário para cadastro e edição de planos (mesma view, diferencia pelo `route.params.id`).

**Campos do formulário:**
| Campo | Tipo | Validação |
|-------|------|-----------|
| Nome do Plano | text | obrigatório |
| Valor (R$) | number (step 0.01) | obrigatório, min 0 |
| Duração (meses) | number | obrigatório, min 1, max 24 |
| Benefícios | textarea (4 rows) | obrigatório |

**Comportamento:**
- Se `route.params.id` existir → modo edição (busca plano e preenche form)
- Senão → modo criação
- Submit: `createPlano()` ou `updatePlano()` no store
- Após sucesso: `router.push('/planos')`
- Botão voltar: link para `/planos`

**Classes CSS a usar:** `form-card`, `form-label-custom`, `form-control-custom`, `btn-primary-custom`, `btn-secondary-custom`, `page-header`

---

### 5.5 View — `src/views/FinanceiroView.vue`

Tela de listagem financeira (pagamentos/mensalidades).

**Layout superior — 3 Cards de resumo:**
Usar componente `StatsCard` de `@/components/ui/StatsCard.vue`:
1. **Pagos** (variant="success", icon="bi bi-check-circle-fill") — `financeiroStore.pagamentosPagos.length`
2. **Pendentes** (variant="warning", icon="bi bi-clock-history") — `financeiroStore.totalPendentes`
3. **Atrasados** (variant="danger", icon="bi bi-exclamation-triangle-fill") — `financeiroStore.totalAtrasados`

**Tabela de pagamentos:**
| Coluna | Dado | Observação |
|--------|------|------------|
| Aluno | nome do aluno | Buscar via `alunosStore.getAlunoById(pag.alunoId)` |
| Valor | R$ formatado | `toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })` |
| Vencimento | dd/mm/yyyy | Converter de YYYY-MM-DD |
| Pagamento | dd/mm/yyyy ou "—" | Se null, mostrar "—" |
| Status | badge colorido | Usar componente `StatusBadge` |
| Ações | editar + excluir | Mesmo padrão de AlunosView |

**Funcionalidades:**
- **Busca** por nome do aluno (campo de texto com ícone de lupa)
- **Filtros por status**: "Todos", "Pagos", "Pendentes", "Atrasados" (usar CSS classes `.filter-btn` e `.filter-btn.active`)
- **Exclusão** com `ConfirmModal`

**Componentes a importar:**
- `StatusBadge` de `@/components/ui/StatusBadge.vue`
- `StatsCard` de `@/components/ui/StatsCard.vue`
- `ConfirmModal` de `@/components/ui/ConfirmModal.vue`

**Stores a importar:**
- `useAlunosStore` (para buscar nomes dos alunos)
- `useFinanceiroStore`

No `onMounted`, carregar ambos com `Promise.all`.

---

### 5.6 View — `src/views/PagamentoFormView.vue`

Formulário para registrar/editar pagamentos.

**Campos do formulário:**
| Campo | Tipo | Validação |
|-------|------|-----------|
| Aluno | select (populado do alunosStore) | obrigatório |
| Valor (R$) | number (step 0.01) | obrigatório, min 0 |
| Data de Vencimento | date | obrigatório |
| Data de Pagamento | date | opcional |
| Status | select ("pendente", "pago", "atrasado") | obrigatório, default "pendente" |

**Comportamento:**
- Carregar lista de alunos no `onMounted` via `alunosStore.fetchAlunos()`
- Se `route.params.id` existir → modo edição
- Campo `dataPagamento`: enviar como `null` se vazio
- Após sucesso: `router.push('/financeiro')`

**Stores a importar:**
- `useAlunosStore` (para popular o select de alunos)
- `useFinanceiroStore`

---

## 6. Componentes Reutilizáveis Disponíveis

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

## 7. Classes CSS Globais Disponíveis

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

## 8. Padrão de Código a Seguir

Use como referência os arquivos `AlunosView.vue` e `AlunoFormView.vue` que seguem exatamente o mesmo padrão esperado:

1. **Composition API** com `<script setup>`
2. **Reactive forms** com `reactive()` para formulários e `ref()` para variáveis simples
3. **Computed** para `isEditing` e listas filtradas
4. **onMounted** para fetch inicial de dados
5. **Formatação de moeda**: `Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })`
6. **Formatação de data**: converter `YYYY-MM-DD` para `DD/MM/YYYY`

---

## 9. Checklist de Implementação

- [ ] Criar `src/stores/planos.js`
- [ ] Criar `src/stores/financeiro.js`
- [ ] Criar `src/views/PlanosView.vue`
- [ ] Criar `src/views/PlanoFormView.vue`
- [ ] Criar `src/views/FinanceiroView.vue`
- [ ] Criar `src/views/PagamentoFormView.vue`
- [ ] Testar CRUD de planos (criar, listar, editar, excluir)
- [ ] Testar CRUD de pagamentos
- [ ] Verificar que o Dashboard continua funcionando (depende dos stores de planos e financeiro)
- [ ] Verificar navegação pela Sidebar
