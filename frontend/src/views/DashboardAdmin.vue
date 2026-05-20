<template>
  <div>
    <Navbar />
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Dashboard Admin</h1>
          <p class="subtitle">Gestion des formations</p>
        </div>
        <button class="btn-add" @click="openModal()">+ Nouvelle formation</button>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-num">{{ formations.length }}</span>
          <span class="stat-label">Formations</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ totalInscrits }}</span>
          <span class="stat-label">Inscrits au total</span>
        </div>
      </div>

      <!-- Table formations -->
      <div class="table-card">
        <div v-if="loading" class="loading">Chargement...</div>
        <table v-else class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Titre</th>
              <th>Durée</th>
              <th>Inscrits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in formations" :key="f.id">
              <td class="id-cell">{{ f.id }}</td>
              <td class="titre-cell">{{ f.titre }}</td>
              <td><span class="badge-duree">{{ f.duree }}</span></td>
              <td>
                <button class="btn-inscrits" @click="voirInscrits(f)">
                  Voir inscrits
                </button>
              </td>
              <td class="actions-cell">
                <button class="btn-edit"   @click="openModal(f)">Modifier</button>
                <button class="btn-delete" @click="deleteFormation(f.id)">Supprimer</button>
              </td>
            </tr>
            <tr v-if="formations.length === 0">
              <td colspan="5" class="empty">Aucune formation créée.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal créer / modifier -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <h2>{{ editMode ? 'Modifier la formation' : 'Nouvelle formation' }}</h2>
          <form @submit.prevent="saveFormation" class="modal-form">
            <div class="field">
              <label>Titre</label>
              <input v-model="formData.titre" type="text" placeholder="Ex: Développement Web" required />
            </div>
            <div class="field">
              <label>Durée</label>
              <input v-model="formData.duree" type="text" placeholder="Ex: 3 mois" required />
            </div>
            <div v-if="formError" class="alert-error">{{ formError }}</div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeModal">Annuler</button>
              <button type="submit" class="btn-save" :disabled="saving">
                {{ saving ? 'Enregistrement...' : (editMode ? 'Modifier' : 'Créer') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal inscrits -->
      <div v-if="showInscrits" class="modal-overlay" @click.self="showInscrits = false">
        <div class="modal">
          <h2>Inscrits — {{ selectedFormation?.titre }}</h2>
          <div v-if="inscrits.length === 0" class="empty-inscrits">Aucun étudiant inscrit.</div>
          <table v-else class="table inscrits-table">
            <thead>
              <tr><th>#</th><th>Nom</th><th>Prénom</th><th>Email</th></tr>
            </thead>
            <tbody>
              <tr v-for="e in inscrits" :key="e.id">
                <td>{{ e.id }}</td>
                <td>{{ e.nom }}</td>
                <td>{{ e.prenom }}</td>
                <td>{{ e.email }}</td>
              </tr>
            </tbody>
          </table>
          <button class="btn-cancel" @click="showInscrits = false" style="margin-top:1rem">Fermer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
//import api    from '../services/api'

const formations       = ref([])
const loading          = ref(true)
const showModal        = ref(false)
const showInscrits     = ref(false)
const editMode         = ref(false)
const saving           = ref(false)
const formError        = ref('')
const inscrits         = ref([])
const selectedFormation = ref(null)
const formData         = ref({ titre: '', duree: '' })
let editId = null

const totalInscrits = computed(() => inscrits.value.length)

async function loadFormations() {
  loading.value = true
  try {
    const { data } = await api.get('/formations')
    formations.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function openModal(f = null) {
  editMode.value  = !!f
  formError.value = ''
  formData.value  = f ? { titre: f.titre, duree: f.duree } : { titre: '', duree: '' }
  editId          = f?.id || null
  showModal.value = true
}

function closeModal() { showModal.value = false }

async function saveFormation() {
  saving.value    = true
  formError.value = ''
  try {
    if (editMode.value) {
      await api.put(`/formations/${editId}`, formData.value)
    } else {
      await api.post('/formations', formData.value)
    }
    closeModal()
    await loadFormations()
  } catch (err) {
    formError.value = err.response?.data?.message || 'Erreur.'
  } finally {
    saving.value = false
  }
}

async function deleteFormation(id) {
  if (!confirm('Supprimer cette formation ?')) return
  try {
    await api.delete(`/formations/${id}`)
    await loadFormations()
  } catch (err) {
    alert(err.response?.data?.message || 'Erreur lors de la suppression.')
  }
}

async function voirInscrits(f) {
  selectedFormation.value = f
  try {
    const { data } = await api.get(`/formations/${f.id}/inscrits`)
    inscrits.value = data
  } catch (e) {
    inscrits.value = []
  }
  showInscrits.value = true
}

onMounted(loadFormations)
</script>

<style scoped>
.page { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
.page-header h1 { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0; }
.subtitle { color: #64748b; font-size: .9rem; margin: 2px 0 0; }
.stats-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 1.5rem; }
.stat-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.2rem 1.5rem; text-align: center; }
.stat-num   { display: block; font-size: 2rem; font-weight: 700; color: #3b82f6; }
.stat-label { display: block; font-size: .85rem; color: #64748b; margin-top: 2px; }
.btn-add {
  background: #3b82f6; color: #fff; border: none;
  padding: 10px 20px; border-radius: 10px; font-size: .9rem;
  font-weight: 600; cursor: pointer; transition: background .2s;
}
.btn-add:hover { background: #2563eb; }
.table-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
.table { width: 100%; border-collapse: collapse; }
.table th { background: #f8fafc; padding: 12px 16px; font-size: .82rem; font-weight: 600; color: #64748b; text-align: left; border-bottom: 1px solid #e2e8f0; }
.table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; font-size: .9rem; color: #1e293b; }
.table tr:last-child td { border-bottom: none; }
.id-cell    { color: #94a3b8; font-size: .8rem; }
.titre-cell { font-weight: 500; }
.badge-duree { background: #eff6ff; color: #3b82f6; font-size: .8rem; padding: 3px 10px; border-radius: 99px; font-weight: 500; }
.actions-cell { display: flex; gap: 6px; }
.btn-edit   { padding: 5px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: #f8fafc; color: #374151; font-size: .82rem; cursor: pointer; }
.btn-edit:hover { border-color: #3b82f6; color: #3b82f6; }
.btn-delete { padding: 5px 14px; border: 1.5px solid #fca5a5; border-radius: 8px; background: #fef2f2; color: #dc2626; font-size: .82rem; cursor: pointer; }
.btn-delete:hover { background: #fee2e2; }
.btn-inscrits { padding: 4px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: #f8fafc; font-size: .8rem; cursor: pointer; }
.btn-inscrits:hover { border-color: #6366f1; color: #6366f1; }
.empty { text-align: center; color: #94a3b8; padding: 2rem; }
.loading { text-align: center; color: #94a3b8; padding: 2rem; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: #fff; border-radius: 18px; padding: 2rem; width: 100%; max-width: 460px; box-shadow: 0 25px 60px rgba(0,0,0,.2); }
.modal h2 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0 0 1.2rem; }
.modal-form { display: flex; flex-direction: column; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field label { font-size: .85rem; font-weight: 500; color: #374151; }
.field input { padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: .95rem; outline: none; }
.field input:focus { border-color: #3b82f6; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: .5rem; }
.btn-cancel { padding: 9px 20px; border: 1.5px solid #e2e8f0; border-radius: 10px; background: #f8fafc; color: #374151; cursor: pointer; font-size: .9rem; }
.btn-save   { padding: 9px 20px; background: #3b82f6; color: #fff; border: none; border-radius: 10px; font-size: .9rem; font-weight: 600; cursor: pointer; }
.btn-save:disabled { opacity: .6; cursor: not-allowed; }
.alert-error { background: #fef2f2; border: 1px solid #fca5a5; color: #dc2626; border-radius: 8px; padding: 10px 14px; font-size: .85rem; }
.inscrits-table { margin-top: .5rem; }
.empty-inscrits { text-align: center; color: #94a3b8; padding: 1.5rem; }
</style>
