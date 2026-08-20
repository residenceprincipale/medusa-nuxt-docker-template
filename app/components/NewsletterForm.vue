<template>
  <form class="newsletter-form" @submit.prevent="onSubmit">
    <UiInput v-model="email" type="email" :placeholder="t('newsletter.placeholder')" required />

    <UiButton type="submit" :disabled="loading">
      {{ loading ? t('newsletter.loading') : t('newsletter.subscribe') }}
    </UiButton>

    <p v-if="success" class="newsletter-form__success">
      {{ t('newsletter.success') }}
    </p>

    <p v-if="error" class="newsletter-form__error">
      {{ error }}
    </p>
  </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
  subscribe: [email: string]
}>()

const email = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    emit('subscribe', email.value)
    success.value = true
    email.value = ''
  } catch {
    error.value = t('newsletter.error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.newsletter-form__success {
  color: #166534;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
.newsletter-form__error {
  color: #c00;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
</style>
