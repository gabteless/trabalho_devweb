# Documentação do Projeto — GestãoAcademia

## Sistema de Gestão de Academia

**Disciplina:** Desenvolvimento Web  
**Repositório:** [github.com/gabteless/trabalho_devweb](https://github.com/gabteless/trabalho_devweb)

---

## 1. Introdução

O **GestãoAcademia** é um sistema web de gerenciamento para academias de ginástica. O objetivo é oferecer uma aplicação completa para administrar o cadastro de alunos, com uma interface moderna, responsiva e intuitiva.

O projeto foi construído como uma **Single Page Application (SPA)**, ou seja, toda a navegação acontece sem recarregar a página, proporcionando uma experiência fluida e rápida para o usuário.

---

## 2. Tecnologias Escolhidas

### 2.1 Por que Vue.js 3?

Optamos pelo **Vue.js 3** como framework principal por ser um dos frameworks JavaScript mais populares e acessíveis do mercado. Ele oferece uma curva de aprendizado suave e uma boa organização de código através de componentes, o que facilita o trabalho em equipe.

Utilizamos a **Composition API** com `<script setup>`, que é a forma mais moderna de escrever componentes Vue. Ela permite organizar o código por funcionalidade ao invés de por tipo (dados, métodos, etc.), o que torna os componentes mais legíveis.

### 2.2 Ferramenta de Build — Vite

O **Vite** foi escolhido como ferramenta de build (empacotamento e servidor de desenvolvimento). Ele é extremamente rápido para iniciar o servidor de desenvolvimento e atualizar mudanças em tempo real no navegador (*Hot Module Replacement*). É a ferramenta oficialmente recomendada pelo Vue.js.

### 2.3 Gerenciamento de Estado — Pinia

O **Pinia** é a biblioteca oficial de gerenciamento de estado do Vue.js 3. Funciona como uma "central de dados" da aplicação — em vez de cada tela buscar seus próprios dados, todas compartilham os mesmos dados armazenados nas *stores* do Pinia.

Isso evita duplicação de código e garante que, quando um aluno é cadastrado ou excluído, todas as telas que mostram alunos são atualizadas automaticamente.

### 2.4 Roteamento — Vue Router 4

O **Vue Router** gerencia a navegação entre as páginas. Configuramos rotas protegidas — se o usuário não estiver logado, ele é redirecionado automaticamente para a tela de login. Isso é feito através de *navigation guards* (guardas de navegação), que verificam a autenticação antes de cada mudança de página.

### 2.5 Estilização — Bootstrap 5 + CSS Customizado

Utilizamos o **Bootstrap 5** como base de estilos, principalmente para o sistema de grid responsivo e utilitários de layout (flexbox, espaçamentos, etc.). Porém, toda a identidade visual da aplicação foi construída com **CSS customizado**, incluindo:

- **Tema escuro (dark theme)** como padrão
- Paleta de cores personalizada com variáveis CSS
- Componentes visuais próprios (botões, cards, tabelas, modais)
- Animações suaves de transição e interação
- Design responsivo que se adapta a diferentes tamanhos de tela

A fonte **Inter** (Google Fonts) foi escolhida pela sua legibilidade em interfaces digitais.

### 2.6 Ícones — Bootstrap Icons

Utilizamos a biblioteca **Bootstrap Icons** para todos os ícones da interface (menu, ações, indicadores). É uma biblioteca leve e com grande variedade de ícones, integrada nativamente com Bootstrap.

### 2.7 Requisições HTTP — Axios

O **Axios** é a biblioteca usada para fazer requisições HTTP ao backend (API). Ele foi configurado com uma instância centralizada em `src/services/api.js`, definindo a URL base do servidor e os cabeçalhos padrão. Isso evita repetição de configuração em cada requisição.

### 2.8 Backend Fake — JSON Server

Como o foco do projeto é o frontend, utilizamos o **json-server** como backend simulado. Ele transforma um arquivo JSON (`db.json`) em uma API REST completa com suporte a operações CRUD (criar, ler, atualizar, deletar).

Isso permite desenvolver e testar toda a aplicação sem precisar implementar um servidor real.

### 2.9 Resumo das Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Vue.js | 3.5 | Framework frontend principal |
| Vite | 8.0 | Servidor de desenvolvimento e build |
| Pinia | 3.0 | Gerenciamento de estado global |
| Vue Router | 5.0 | Navegação entre páginas (SPA) |
| Axios | 1.18 | Requisições HTTP ao backend |
| Bootstrap | 5.3 | Grid responsivo e utilitários CSS |
| Bootstrap Icons | 1.13 | Biblioteca de ícones |
| JSON Server | — | API REST simulada (backend fake) |

---

## 3. Estrutura do Projeto

A organização dos arquivos segue o padrão recomendado pelo Vue.js, separando responsabilidades por tipo:

```
src/
├── main.js                          # Ponto de entrada — inicializa o Vue, Pinia e Router
├── App.vue                          # Componente raiz — decide se mostra layout ou login
│
├── assets/styles/
│   └── main.css                     # CSS global — tema escuro, componentes, animações
│
├── router/
│   └── index.js                     # Configuração de rotas e proteção de páginas
│
├── services/
│   └── api.js                       # Instância Axios configurada (conexão com o backend)
│
├── stores/
│   ├── auth.js                      # Store de autenticação (login, logout, sessão)
│   └── alunos.js                    # Store de alunos (CRUD completo)
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.vue            # Layout principal (sidebar + topbar + conteúdo)
│   │   ├── AppSidebar.vue           # Barra lateral de navegação
│   │   └── AppTopbar.vue            # Barra superior com info do usuário
│   └── ui/
│       ├── ConfirmModal.vue         # Modal de confirmação para exclusões
│       ├── StatusBadge.vue          # Badge colorido de status (ativo/inativo)
│       └── StatsCard.vue            # Card de estatística para o dashboard
│
└── views/
    ├── LoginView.vue                # Tela de login
    ├── DashboardView.vue            # Painel inicial com visão geral
    ├── AlunosView.vue               # Listagem de alunos (tabela com busca e filtros)
    └── AlunoFormView.vue            # Formulário de cadastro/edição de aluno
```

### 3.1 Princípio de Organização

- **Views** são as páginas completas (uma por rota)
- **Components** são pedaços reutilizáveis de interface
- **Stores** centralizam os dados e as operações com a API
- **Services** contêm configurações de conexão externa
- **Router** define quais páginas existem e quais exigem login

---

## 4. Como Rodar o Projeto

### Pré-requisitos

- **Node.js** versão 20.19 ou superior
- **npm** (gerenciador de pacotes, já incluso com o Node.js)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/gabteless/trabalho_devweb.git
cd trabalho_devweb

# Instalar dependências
npm install
```

### Execução

São necessários **dois terminais** simultâneos:

```bash
# Terminal 1 — Inicia o backend fake na porta 3001
npx json-server db.json --port 3001

# Terminal 2 — Inicia o frontend na porta 5173
npm run dev
```

### Acessando o Sistema

- **Frontend:** http://localhost:5173/
- **Backend (API):** http://localhost:3001/
- **Login:** `admin@academia.com` / `123456`

---

## 5. Funcionalidades Implementadas

### 5.1 Sistema de Autenticação

O sistema possui uma tela de login que valida o e-mail e a senha do usuário contra os dados do backend. Ao fazer login com sucesso, um token é gerado e armazenado no `localStorage` do navegador, mantendo o usuário logado mesmo se ele fechar e reabrir a aba.

**Como funciona:**

1. O usuário digita e-mail e senha na tela de login
2. O sistema consulta a API buscando um usuário com aquele e-mail
3. Se encontrado e a senha bater, um token fictício é gerado
4. Os dados do usuário e o token são salvos no `localStorage`
5. O usuário é redirecionado para o Dashboard

**Proteção de rotas:** Todas as páginas (exceto login) exigem autenticação. Se um usuário não logado tentar acessar qualquer página, ele é redirecionado automaticamente para o login. Isso é feito pelo *navigation guard* `beforeEach` do Vue Router.

**Logout:** O botão de sair na barra superior limpa os dados de sessão do `localStorage` e redireciona para o login.

### 5.2 Layout da Aplicação

Após o login, a aplicação exibe um layout dividido em três partes:

- **Sidebar (barra lateral):** Menu de navegação com links para Dashboard e Alunos. Pode ser recolhida clicando no botão de toggle, mostrando apenas os ícones. Em dispositivos móveis, ela se transforma em um menu deslizante.

- **Topbar (barra superior):** Mostra o título da página atual, o nome e cargo do usuário logado (com as iniciais em um avatar), e o botão de logout.

- **Área de conteúdo:** Onde as páginas são renderizadas, com largura máxima e padding adequado.

O layout é **totalmente responsivo** — se adapta automaticamente a celulares, tablets e desktops.

### 5.3 Dashboard

O painel inicial apresenta uma visão geral do sistema com:

- **Card de estatística** mostrando o total de alunos ativos
- **Tabela de alunos recentes** com os 5 últimos cadastrados, ordenados por data

### 5.4 Cadastro de Alunos (CRUD Completo)

O módulo de alunos é a funcionalidade principal do sistema e implementa todas as operações CRUD:

#### Listagem (`AlunosView.vue`)

- Tabela com todos os alunos cadastrados
- **Busca em tempo real** — filtra por nome, CPF ou e-mail conforme o usuário digita
- **Filtros por status** — botões "Todos", "Ativos" e "Inativos" que filtram a lista
- **Estado de carregamento** — mostra um spinner enquanto os dados são buscados
- **Estado vazio** — mensagem amigável quando nenhum aluno é encontrado
- Botões de ação em cada linha: editar e excluir

#### Cadastro/Edição (`AlunoFormView.vue`)

O mesmo componente é utilizado tanto para criar quanto para editar alunos, diferenciando o modo pela presença de um ID na URL:

- **Criação:** rota `/alunos/novo`
- **Edição:** rota `/alunos/:id/editar` — preenche o formulário com os dados existentes

Campos do formulário:
| Campo | Tipo | Validação |
|---|---|---|
| Nome Completo | Texto | Obrigatório |
| CPF | Texto com máscara | Obrigatório, máscara automática (000.000.000-00) |
| Telefone | Texto com máscara | Obrigatório, máscara automática ((00) 00000-0000) |
| E-mail | E-mail | Obrigatório |
| Status | Seleção | Obrigatório (Ativo ou Inativo) |

**Máscaras de entrada:** Os campos de CPF e telefone possuem formatação automática enquanto o usuário digita, adicionando pontos, traço e parênteses nos lugares corretos.

#### Exclusão

A exclusão é protegida por um **modal de confirmação** — quando o usuário clica em excluir, aparece uma janela perguntando se ele tem certeza. Isso evita exclusões acidentais.

### 5.5 Componentes Reutilizáveis

Criamos três componentes de interface que são usados em diversas telas:

#### ConfirmModal
Modal de confirmação genérico. Recebe título, mensagem e emite eventos de confirmação ou cancelamento. Usa `Teleport` para ser renderizado fora da árvore de componentes, garantindo que fique sempre por cima do conteúdo.

#### StatusBadge
Badge colorido que mostra o status de um registro. Mapeia automaticamente o status para uma cor:
- **Ativo / Pago** → Verde
- **Pendente** → Amarelo
- **Inativo / Atrasado** → Vermelho

#### StatsCard
Card de estatística usado no Dashboard. Aceita um ícone, um rótulo, um valor e uma variante de cor. Pode formatar o valor como moeda brasileira quando necessário.

---

## 6. Decisões de Design

### 6.1 Tema Escuro

Optamos por um **tema escuro como padrão** por ser tendência em aplicações modernas e reduzir a fadiga visual em uso prolongado. A paleta de cores foi cuidadosamente definida usando variáveis CSS:

- **Fundo principal:** `#0f172a` (azul muito escuro)
- **Cards e sidebar:** `#1e293b` (azul escuro)
- **Cor primária:** `#6366f1` (índigo/roxo)
- **Cor de destaque:** `#06b6d4` (ciano)
- **Sucesso:** `#10b981` (verde esmeralda)
- **Alerta:** `#f59e0b` (âmbar)
- **Perigo:** `#ef4444` (vermelho)

### 6.2 Animações e Micro-interações

A interface possui animações sutis para melhorar a experiência do usuário:

- **Fade-in com deslocamento** — as páginas aparecem com um suave efeito de deslizar de baixo para cima
- **Hover em cards** — os cards sobem levemente ao passar o mouse, criando uma sensação de profundidade
- **Transições na sidebar** — a sidebar se recolhe e expande com animação suave
- **Entrada do modal** — o modal de confirmação surge com efeito de deslizar
- **Botões com feedback** — os botões sobem levemente ao hover e ganham sombra

### 6.3 Responsividade

O layout se adapta a três faixas principais de tela:

- **Desktop (> 992px):** Sidebar fixa, topbar ajustada, conteúdo com largura máxima
- **Tablet (768px a 992px):** Sidebar vira menu deslizante com overlay, topbar ocupa toda a largura
- **Mobile (< 768px):** Layout verticalizado, tabelas com scroll horizontal, formulários em coluna única

### 6.4 Scrollbar Customizado

Até a barra de rolagem foi personalizada para manter a consistência visual do tema escuro, com uma barra fina e discreta.

---

## 7. Arquitetura e Padrões

### 7.1 Fluxo de Dados

A aplicação segue um fluxo unidirecional de dados:

```
Usuário → View (template) → Action (store) → API (axios) → Backend (json-server)
                                                    ↓
                                               State (store)
                                                    ↓
                                              View (atualizada)
```

1. O usuário interage com a interface (clica, digita, etc.)
2. A view chama uma action da store
3. A store faz a requisição HTTP via Axios
4. O backend responde com os dados
5. A store atualiza seu estado
6. A view se atualiza automaticamente graças à reatividade do Vue

### 7.2 Composition API com `<script setup>`

Todos os componentes usam a Composition API com a sintaxe `<script setup>`, que é a abordagem mais moderna do Vue.js 3. Ela permite:

- Declarar variáveis reativas diretamente (sem bloco `data()`)
- Usar `computed` e `ref` de forma mais intuitiva
- Importar e usar componentes sem precisar registrá-los

### 7.3 Formulários Reativos

Os formulários utilizam `reactive()` para agrupar todos os campos em um único objeto reativo. Isso facilita o envio dos dados e a sincronização com a interface via `v-model`.

### 7.4 Store Pattern (Pinia)

Cada entidade do sistema possui sua própria store com três seções:

- **State:** Os dados em si (lista de alunos, loading, erro)
- **Getters:** Dados derivados (total de alunos ativos, busca por ID)
- **Actions:** Operações assíncronas (buscar, criar, editar, excluir)

---

## 8. Dados do Backend

O arquivo `db.json` na raiz do projeto contém os dados iniciais:

### Usuários (para login)
| Nome | E-mail | Cargo |
|---|---|---|
| Administrador | admin@academia.com | Gerente |
| Maria Souza | maria@academia.com | Recepcionista |

Senha de ambos: `123456`

### Alunos
O sistema vem pré-carregado com 10 alunos de exemplo, cada um com nome, CPF, telefone, e-mail e status.

### Endpoints da API

| Operação | Método HTTP | Endpoint | Descrição |
|---|---|---|---|
| Login | GET | `/usuarios?email=...` | Busca usuário pelo e-mail |
| Listar alunos | GET | `/alunos` | Retorna todos os alunos |
| Buscar aluno | GET | `/alunos/:id` | Retorna um aluno pelo ID |
| Cadastrar aluno | POST | `/alunos` | Cria um novo aluno |
| Editar aluno | PUT | `/alunos/:id` | Atualiza dados de um aluno |
| Excluir aluno | DELETE | `/alunos/:id` | Remove um aluno |

---

## 9. Controle de Versão

O projeto utiliza **Git** para controle de versão e está hospedado no **GitHub**. A branch principal é a `main`.

### Repositório

- **URL:** https://github.com/gabteless/trabalho_devweb
- **Branch principal:** `main`

---

## 10. Como Contribuir / Estender

Para adicionar novas funcionalidades ao sistema, o padrão a ser seguido é:

1. **Criar uma Store** em `src/stores/` com state, getters e actions CRUD
2. **Criar as Views** em `src/views/` seguindo o padrão de listagem + formulário
3. **Adicionar as rotas** em `src/router/index.js` com `meta: { requiresAuth: true }`
4. **Adicionar o link** na sidebar em `src/components/layout/AppSidebar.vue`
5. **Reutilizar os componentes** existentes (`ConfirmModal`, `StatusBadge`, `StatsCard`)
6. **Usar as classes CSS** globais já definidas em `main.css`

Todos os componentes e stores existentes servem como referência de padrão.

---

## 11. Considerações Finais

O GestãoAcademia foi desenvolvido com foco em boas práticas de desenvolvimento frontend moderno:

- **Componentização:** Interface dividida em componentes reutilizáveis e independentes
- **Separação de responsabilidades:** Dados na store, lógica no script, apresentação no template
- **Experiência do usuário:** Tema escuro, animações, feedback visual em todas as ações
- **Responsividade:** Funciona em qualquer dispositivo
- **Código organizado:** Estrutura de pastas clara e nomes descritivos

O projeto demonstra na prática como construir uma aplicação web completa com Vue.js 3, utilizando as ferramentas e padrões mais atuais do ecossistema JavaScript.
