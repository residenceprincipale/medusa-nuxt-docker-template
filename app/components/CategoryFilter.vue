<template>
  <div class="category-filter">
    <button :class="{ active: selected === '' }" @click="emit('select', '')">
      {{ t('categories.all') }}
    </button>

    <button
      v-for="category in categories"
      :key="category.handle"
      :class="{ active: selected === category.handle }"
      @click="emit('select', category.handle)"
    >
      {{ category.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Category } from '~/types/medusa'

const { t } = useI18n()

defineProps<{
  categories: Category[]
  selected: string
}>()

const emit = defineEmits<{
  select: [handle: string]
}>()
</script>

<style scoped>
.category-filter {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}
.category-filter button {
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  color: var(--muted);
  font-family: inherit;
}
.category-filter button.active {
  color: var(--fg);
  font-weight: 600;
  text-decoration: none;
}
</style>
