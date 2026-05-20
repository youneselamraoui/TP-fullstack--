<template>
  <div>
    <Navbar />
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Bonjour, {{ user?.nom }} 👋</h1>
          <p class="subtitle">Espace étudiant — Gérez votre inscription</p>
        </div>
      </div>

      <!-- Ma formation inscrite -->
      <section class="section">
        <h2 class="section-title">Ma formation</h2>
        <div v-if="mesFormations.length === 0" class="empty-state">
          <span>📭</span>
          <p>Vous n'êtes inscrit à aucune formation. Parcourez le catalogue ci-dessous.</p>
        </div>
        <div v-else class="my-formation">
          <FormationCard :formation="mesFormations[0]" :is-inscrit="true">
            <template #actions>
              <button class="btn-desinscrire" @click="desinscrire(mesFormations[0].formation_id)">
                Se désinscrire
              </button>
            </template>
          </FormationCard>
        </div>
      </section>

      <!-- Catalogue des formations -->
      <section class="section">
        <h2 class="section-title">Catalogue des formations</h2>
        <div v-if="loading" class="loading">Chargement...</div>
        <div v-else class="formations-grid">
          <FormationCard
            v-for="f in formations"
            :key="f.id"
            :formation="f"
            :is-inscrit="isInscrit(f.id)"
          >
            <template #actions>
              <button
                v-if="!isInscrit(f.id)"
                class="btn-inscrire"
                :disabled="mesFormations.length > 0"
                @click="inscrire(f.id)"
              >
                {{ mesFormations.length > 0 ? 'Déjà inscrit ailleurs' : "S'inscrire" }}
              </button>
              <span v-else class="already-label">✅ Inscrit</span>
            </template>
          </FormationCard>
        </div>
      </section>

      <div v-if="message" class="toast" :class="messageType">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar        from '../components/Navbar.vue'
import FormationCard from '../components/FormationCard.vue'
//import api           from '../services/api'

const user         = computed(() => JSON.parse(localStorage.getItem('user') || 'null'))
const formations   = ref([])
const mesFormations = ref([])
const loading      = ref(true)
const message      = ref('')
const messageType  = ref('success')

function isInscrit(formationId) {
  return mesFormations.value.some(f => f.formation_id === formationId)
}

function showMessage(msg, type = 'success') {
  message.value    = msg
  messageType.value = type
  setTimeout(() => { message.value = '' }, 3000)
}

async function loadData() {
  loading.value = true
  try {
    const [f, mf] = await Promise.all([
      api.get('/formations'),
      api.get('/mes-formations')
    ])
    formations.value    = f.data
    mesFormations.value = mf.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function inscrire(formationId) {
  try {
    await api.post('/inscription', { formation_id: formationId })
    showMessage('Inscription réussie !')
    await loadData()
  } catch (err) {
    showMessage(err.response?.data?.message || 'Erreur lors de l\'inscription.', 'error')
  }
}

async function desinscrire(formationId) {
  if (!confirm('Se désinscrire de cette formation ?')) return
  try {
    await api.delete(`/inscription/${formationId}`)
    showMessage('Désinscription effectuée.')
    await loadData()
  } catch (err) {
    showMessage(err.response?.data?.message || 'Erreur.', 'error')
  }
}

onMounted(loadData)
</script>

<style scoped>
.page { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; }
.page-header { margin-bottom: 2rem; }
.page-header h1 { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0; }
.subtitle { color: #64748b; font-size: .9rem; margin: 2px 0 0; }
.section { margin-bottom: 2.5rem; }
.section-title { font-size: 1rem; font-weight: 600; color: #374151; margin-bottom: 1rem; padding-bottom: 8px; border-bottom: 2px solid #f1f5f9; }
.formations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.my-formation { max-width: 320px; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 2rem; color: #94a3b8; }
.empty-state span { font-size: 2.5rem; }
.empty-state p { font-size: .9rem; text-align: center; }
.loading { color: #94a3b8; padding: 2rem; text-align: center; }
.btn-inscrire {
  flex: 1;
  padding: 8px 16px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: .85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s;
}
.btn-inscrire:hover:not(:disabled) { background: #2563eb; }
.btn-inscrire:disabled { background: #94a3b8; cursor: not-allowed; }
.btn-desinscrire {
  padding: 8px 16px;
  background: #fef2f2;
  color: #dc2626;
  border: 1.5px solid #fca5a5;
  border-radius: 8px;
  font-size: .85rem;
  cursor: pointer;
}
.btn-desinscrire:hover { background: #fee2e2; }
.already-label { font-size: .85rem; color: #16a34a; font-weight: 500; }
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 12px;
  font-size: .9rem;
  font-weight: 500;
  z-index: 200;
  box-shadow: 0 8px 30px rgba(0,0,0,.15);
}
.toast.success { background: #16a34a; color: #fff; }
.toast.error   { background: #dc2626; color: #fff; }
</style>
