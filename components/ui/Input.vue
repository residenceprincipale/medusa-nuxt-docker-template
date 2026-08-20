<template>
  <textarea
    v-if="multiline"
    :value="modelValue"
    :rows="rows"
    :placeholder="placeholder"
    :required="required"
    :class="['app-input', 'app-textarea', { 'app-input--block': block }]"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
  <input
    v-else
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :required="required"
    :class="['app-input', { 'app-input--block': block }]"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string
  type?: string
  placeholder?: string
  required?: boolean
  block?: boolean
  multiline?: boolean
  rows?: number
}>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped>
.app-input {
  width: 100%;
  padding: 0.45rem;
  border: 1px solid var(--border);
  font-size: 0.9rem;
  font-family: inherit;
}
.app-textarea {
  min-height: 120px;
  resize: vertical;
}
</style>
