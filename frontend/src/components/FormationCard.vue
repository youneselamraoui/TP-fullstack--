<template>
  <div class="formation-card" :class="{ inscrit: isInscrit }">
    <div class="card-header">
      <span class="card-icon">📚</span>
      <span v-if="isInscrit" class="badge-inscrit">Inscrit</span>
    </div>
    <h3 class="card-titre">{{ formation.titre }}</h3>
    <p class="card-duree">⏱ {{ formation.duree }}</p>

    <div class="card-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  formation: { type: Object, required: true },
  isInscrit: { type: Boolean, default: false }
})
</script>

<style scoped>
.formation-card {
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: box-shadow .2s, border-color .2s;
}
.formation-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,.08);
  border-color: #94a3b8;
}
.formation-card.inscrit { border-color: #3b82f6; background: #eff6ff; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-icon   { font-size: 1.5rem; }
.badge-inscrit {
  font-size: .72rem; font-weight: 600;
  background: #3b82f6; color: #fff;
  padding: 2px 10px; border-radius: 99px;
}
.card-titre { font-size: 1rem; font-weight: 600; color: #1e293b; margin: 4px 0 0; }
.card-duree { font-size: .85rem; color: #64748b; }
.card-actions { margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap; }
</style>
