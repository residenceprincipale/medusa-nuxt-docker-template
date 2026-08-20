<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <slot />
  </NuxtLink>
  <button v-else :type="type" :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant?: 'primary' | 'outline' | 'ghost' | 'remove'
  block?: boolean
  size?: 'sm'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  to?: string
}>()

const classes = computed(() => [
  'btn',
  { primary: 'btn-primary', outline: 'btn-outline', ghost: 'btn-ghost', remove: 'btn-remove' }[
    props.variant ?? 'primary'
  ],
  { 'btn-block': props.block, 'btn-sm': props.size === 'sm' },
])
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border: 1px solid transparent;
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.2;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-primary {
  background: var(--fg);
  color: #fff;
  border-color: var(--fg);
}
.btn-outline {
  background: #fff;
  color: var(--fg);
  border-color: var(--border);
}
.btn-ghost {
  background: none;
  border: none;
  color: var(--fg);
  padding: 0.25rem 0.5rem;
  text-decoration: underline;
}
.btn-remove {
  background: none;
  border: none;
  color: #c00;
  padding: 0;
  font-size: 0.85rem;
}
.btn-block {
  display: flex;
  width: 100%;
}
.btn-sm {
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
}
</style>
