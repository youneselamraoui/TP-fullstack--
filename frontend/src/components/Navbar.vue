<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <span class="brand-icon">🎓</span>
      <span class="brand-name">GestionFormations</span>
    </div>

    <div class="navbar-user" v-if="user">
      <span class="user-info">
        <span class="user-role" :class="user.role">{{ user.role }}</span>
        {{ user.nom }}
      </span>
      <button class="btn-logout" @click="logout">Déconnexion</button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user   = computed(() => JSON.parse(localStorage.getItem('user') || 'null'))

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 60px;
  background: #1e293b;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
}
.navbar-brand { display: flex; align-items: center; gap: 10px; }
.brand-icon   { font-size: 1.4rem; }
.brand-name   { font-size: 1.1rem; font-weight: 600; letter-spacing: .02em; }
.navbar-user  { display: flex; align-items: center; gap: 14px; }
.user-info    { font-size: .9rem; display: flex; align-items: center; gap: 8px; }
.user-role    { font-size: .72rem; padding: 2px 10px; border-radius: 99px; font-weight: 600; text-transform: uppercase; }
.user-role.admin    { background: #ef4444; color: #fff; }
.user-role.etudiant { background: #3b82f6; color: #fff; }
.btn-logout {
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,.3);
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-size: .85rem;
  transition: background .2s;
}
.btn-logout:hover { background: rgba(255,255,255,.1); }
</style>
