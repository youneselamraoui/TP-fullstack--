<template>
  <div class="auth-page">
    <div class="auth-card">

      <!-- Panneau gauche -->
      <div class="auth-left">
        <div class="orb orb1"></div>
        <div class="orb orb2"></div>
        <div class="left-top">
          <div class="brand-icon">🎓</div>
          <p class="brand-name">Gestion<br><em>Formations</em></p>
          <p class="brand-sub">Plateforme de gestion des formations et des étudiants.</p>
        </div>
        <ul class="feature-list">
          <li><span class="dot"></span>Suivi des inscriptions</li>
          <li><span class="dot"></span>Gestion des formations</li>
          <li><span class="dot"></span>Tableau de bord admin</li>
          <li><span class="dot"></span>Espace étudiant dédié</li>
        </ul>
      </div>

      <!-- Panneau droit : formulaire -->
      <div class="auth-right">
        <div class="form-header">
          <p class="eyebrow">Authentification</p>
          <h1 class="form-title">Bienvenue</h1>
          <p class="form-sub">Connectez-vous à votre espace personnel</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="field">
            <label>Adresse email</label>
            <div class="input-wrap">
              <span class="input-icon">✉</span>
              <input
                v-model="form.email"
                type="email"
                placeholder="vous@exemple.com"
                required
              />
            </div>
          </div>

          <div class="field">
            <label>Mot de passe</label>
            <div class="input-wrap">
              <span class="input-icon">🔒</span>
              <input
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div v-if="error" class="alert-error">{{ error }}</div>

          <button type="submit" :disabled="loading" class="btn-primary">
            <span>{{ loading ? 'Connexion...' : 'Se connecter' }}</span>
            <span v-if="!loading" class="btn-arrow">→</span>
          </button>
        </form>

        <div class="form-footer">
          <span class="footer-text">
            Pas de compte ?
            <router-link to="/register">Créer un compte</router-link>
          </span>
          <a class="footer-link">Mot de passe oublié ?</a>
        </div>

        <div class="divider">
          <span class="divider-line"></span>
          <span class="divider-label">Comptes démo</span>
          <span class="divider-line"></span>
        </div>

        <div class="demo-row">
          <button class="demo-chip" type="button" @click="fillAdmin">
            🛡 Admin
            <span class="chip-badge">admin</span>
          </button>
          <button class="demo-chip" type="button" @click="fillEtudiant">
            👤 Étudiant
            <span class="chip-badge green">étudiant</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router  = useRouter()
const loading = ref(false)
const error   = ref('')
const form    = ref({ email: '', password: '' })

async function handleLogin() {
  loading.value = true
  error.value   = ''
  try {
    const { data } = await api.post('/auth/login', form.value)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user',  JSON.stringify(data.user))

    if (data.user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/etudiant')
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur de connexion.'
  } finally {
    loading.value = false
  }
}

function fillAdmin()    { form.value = { email: 'admin@formations.ma',  password: 'Admin@123' } }
function fillEtudiant() { form.value = { email: 'etudiant@test.ma',     password: 'Test@123'  } }
</script>

<style scoped>
@import '@/assets/Login.css'
</style>