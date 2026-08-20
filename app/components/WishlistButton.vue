<template>
  <button class="wishlist-btn" :class="{ 'wishlist-btn--active': isWishlisted }" @click="toggle">
    {{ isWishlisted ? '\u2665' : '\u2661' }}
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  productId: string
}>()

const emit = defineEmits<{
  toggle: [productId: string, active: boolean]
}>()

const WISHLIST_KEY = 'wishlist'

const isWishlisted = ref(false)

onMounted(() => {
  const stored = localStorage.getItem(WISHLIST_KEY)
  if (stored) {
    const ids: string[] = JSON.parse(stored)
    isWishlisted.value = ids.includes(props.productId)
  }
})

function toggle() {
  const stored = localStorage.getItem(WISHLIST_KEY)
  let ids: string[] = stored ? JSON.parse(stored) : []

  if (isWishlisted.value) {
    ids = ids.filter((id) => id !== props.productId)
  } else {
    ids.push(props.productId)
  }

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids))
  isWishlisted.value = !isWishlisted.value
  emit('toggle', props.productId, isWishlisted.value)
}
</script>

<style scoped>
.wishlist-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  color: var(--fg);
  line-height: 1;
}
.wishlist-btn--active {
  color: #c00;
}
</style>
