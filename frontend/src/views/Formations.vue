<template>
  <div>
    <Navbar />
    <div class="page">
      <h1>Catalogue des formations</h1>
      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else class="formations-grid">
        <FormationCard v-for="f in formations" :key="f.id" :formation="f" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar        from '../components/Navbar.vue'
import FormationCard from '../components/FormationCard.vue'
//import api           from '../services/api'

const formations = ref([])
const loading    = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get('/formations')
    formations.value = data
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; }
h1   { font-size: 1.4rem; font-weight: 700; color: #1e293b; margin-bottom: 1.5rem; }
.formations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.loading { color: #94a3b8; text-align: center; padding: 2rem; }
</style>
