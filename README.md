# Gestão Master — Sistema de Gestão de Academia

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-3.0-FFD859?style=for-the-badge&logo=vue.js&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

Um sistema web completo para gerenciamento de academias, construído como uma Single Page Application (SPA). O projeto oferece uma interface moderna para o controle de alunos, com recursos avançados de usabilidade.

> **Nota Acadêmica:** Este projeto foi desenvolvido para a disciplina de Desenvolvimento Web.

## 🚀 Funcionalidades

- **Autenticação:** Sistema de login com persistência de sessão.
- **Dashboard:** Painel inicial com métricas gerais e listagem dos alunos mais recentes.
- **Gestão de Alunos (CRUD completo):**
  - Listagem com busca em tempo real e filtros de status.
  - Cadastro e edição com máscaras automáticas (CPF e Telefone).
  - Exclusão protegida por modal de confirmação.
- **Personalização de Interface:**
  - Tema escuro (padrão) com tons de cinza.
  - Tema claro.
  - Alternância de tema salva localmente.
  - Layout totalmente responsivo (Mobile, Tablet, Desktop).

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Vue.js 3 (Composition API), Vite, Vue Router
- **Gerenciamento de Estado:** Pinia
- **Estilização e UI:** Bootstrap 5, Bootstrap Icons, CSS Customizado
- **Requisições:** Axios
- **Backend Simulado:** json-server

## 💻 Como Rodar o Projeto

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (v20+ recomendado)

### 2. Instalação
Clone o repositório e instale as dependências:
```bash
git clone https://github.com/gabteless/trabalho_devweb.git
cd trabalho_devweb
npm install
```

### 3. Execução
O projeto necessita de **dois terminais** abertos simultaneamente (um para a API fake e outro para o frontend).

**Terminal 1 — Iniciando o Backend:**
```bash
npx json-server db.json --port 3001
```

**Terminal 2 — Iniciando o Frontend:**
```bash
npm run dev
```

### 4. Acesso
- **Aplicação:** `http://localhost:5173` (ou a porta informada pelo Vite)
- **Credenciais de Teste:**
  - **Email:** `admin@academia.com`
  - **Senha:** `123456`

## 📁 Estrutura Principal

```
src/
├── assets/          # Estilos globais e CSS do tema
├── components/      # Componentes reutilizáveis (Layout, Modais, Cards)
├── router/          # Configurações de rotas e guardas de navegação
├── services/        # Configuração da API (Axios)
├── stores/          # Gerenciamento de estado (Pinia)
└── views/           # Páginas da aplicação (Dashboard, Alunos, Login)
```
