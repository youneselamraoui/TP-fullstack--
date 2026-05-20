import { createRouter, createWebHistory } from 'vue-router'

import Login             from '../views/Login.vue'
import Register          from '../views/Register.vue'
import DashboardAdmin    from '../views/DashboardAdmin.vue'
import DashboardEtudiant from '../views/DashboardEtudiant.vue'
import Formations        from '../views/Formations.vue'

const routes = [
  { path: '/',         redirect: '/login' },
  { path: '/login',    component: Login,    meta: { guest: true } },
  { path: '/register', component: Register, 
    //meta: { guest: true }
   },

  {
    path: '/admin',
    component: DashboardAdmin,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/etudiant',
    component: DashboardEtudiant,
    meta: { requiresAuth: true, role: 'etudiant' }
  },
  {
    path: '/formations',
    component: Formations,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ─── Garde de navigation ──────────────────────────────────────────────────
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user  = JSON.parse(localStorage.getItem('user') || 'null')

  // ── Bypass login en dev ──────────────────────────────
  if (!token && to.path === '/admin') {
    localStorage.setItem('token', 'dev-token')
    localStorage.setItem('user', JSON.stringify({ role: 'admin', email: 'admin@formations.ma' }))
    return next('/admin')
  }
  // ─────────────────────────────────────────────────────

  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  if (to.meta.guest && token) {
    const dest = user?.role === 'admin' ? '/admin' : '/etudiant'
    return next(dest)
  }

  if (to.meta.role && user?.role !== to.meta.role) {
    const dest = user?.role === 'admin' ? '/admin' : '/etudiant'
    return next(dest)
  }

  next()
})

export default router
