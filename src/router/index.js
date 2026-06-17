import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true, title: 'Dashboard' }
    },
    {
      path: '/alunos',
      name: 'alunos',
      component: () => import('@/views/AlunosView.vue'),
      meta: { requiresAuth: true, title: 'Alunos' }
    },
    {
      path: '/alunos/novo',
      name: 'aluno-novo',
      component: () => import('@/views/AlunoFormView.vue'),
      meta: { requiresAuth: true, title: 'Novo Aluno' }
    },
    {
      path: '/alunos/:id/editar',
      name: 'aluno-editar',
      component: () => import('@/views/AlunoFormView.vue'),
      meta: { requiresAuth: true, title: 'Editar Aluno' }
    },
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
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
