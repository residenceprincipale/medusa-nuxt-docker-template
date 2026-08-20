<template>
  <div class="category-filter">
    <button
      :class="{ active: selected === '' }"
      @click="emit('select', '')"
    >
      {{ t('category.all') }}
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

const { t } = useI18n()

defineProps<{
  categories: any[]
  selected: string
}>()

const emit = defineEmits<{
  select: [handle: string]
}>()
</script>
