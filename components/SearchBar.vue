<template>
  <div class="search-bar">
    <input v-model="query" type="text" :placeholder="t('search.placeholder')" @input="onInput" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
  search: [query: string]
}>()

const query = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', query.value)
  }, 300)
}

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  max-width: 48ch;
}
.search-bar input {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid var(--border);
  font-size: 1rem;
  font-family: inherit;
}
</style>
