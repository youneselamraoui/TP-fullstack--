<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">🎓</div>
      <h1 class="auth-title">Créer un compte</h1>
      <p class="auth-sub">Inscrivez-vous en tant qu'étudiant</p>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="row-2">
          <div class="field">
            <label>Nom</label>
            <input v-model="form.nom" type="text" placeholder="Dupont" required />
          </div>
          <div class="field">
            <label>Prénom</label>
            <input v-model="form.prenom" type="text" placeholder="Jean" required />
          </div>
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="vous@exemple.com" required />
        </div>
        <div class="field">
          <label>Mot de passe</label>
          <input v-model="form.password" type="password" placeholder="Minimum 6 caractères" required minlength="6" />
        </div>

        <div v-if="error"   class="alert-error">{{ error }}</div>
        <div v-if="success" class="alert-success">{{ success }}</div>

        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Création...' : 'Créer mon compte' }}
        </button>
      </form>

      <p class="auth-link">
        Déjà un compte ? <router-link to="/login">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
//import api from '../services/api'

const router  = useRouter()
const loading = ref(false)
const error   = ref('')
const success = ref('')
const form    = ref({ nom: '', prenom: '', email: '', password: '' })

async function handleRegister() {
  loading.value = true
  error.value   = ''
  success.value = ''
  try {
    await api.post('/auth/register', form.value)
    success.value = 'Compte créé ! Redirection vers la connexion...'
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la création du compte.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}
.auth-card {
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 25px 60px rgba(0,0,0,.3);
  text-align: center;
}
.auth-logo  { font-size: 2.5rem; }
.auth-title { font-size: 1.4rem; font-weight: 700; color: #1e293b; margin: .3rem 0 0; }
.auth-sub   { color: #64748b; font-size: .9rem; margin: .3rem 0 1.5rem; }
.auth-form  { display: flex; flex-direction: column; gap: 1rem; text-align: left; }
.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field label { font-size: .85rem; font-weight: 500; color: #374151; }
.field input {
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: .95rem;
  outline: none;
  transition: border-color .2s;
}
.field input:focus { border-color: #3b82f6; }
.btn-primary {
  padding: 12px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: .5rem;
  transition: background .2s;
}
.btn-primary:hover:not(:disabled) { background: #2563eb; }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }
.alert-error   { background: #fef2f2; border: 1px solid #fca5a5; color: #dc2626; border-radius: 8px; padding: 10px 14px; font-size: .85rem; }
.alert-success { background: #f0fdf4; border: 1px solid #86efac; color: #16a34a; border-radius: 8px; padding: 10px 14px; font-size: .85rem; }
.auth-link { margin-top: 1.2rem; font-size: .88rem; color: #64748b; }
.auth-link a { color: #3b82f6; text-decoration: none; font-weight: 500; }
</style>
