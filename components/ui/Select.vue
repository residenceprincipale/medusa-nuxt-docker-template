<template>
  <select
    :value="modelValue"
    :class="['app-select', { 'app-select--block': block }]"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
defineProps<{ modelValue?: string; block?: boolean }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped>
.app-select {
  padding: 0.45rem;
  border: 1px solid var(--border);
  background: #fff;
  font-size: 0.9rem;
  font-family: inherit;
}
.app-select--block {
  width: 100%;
}
</style>
