<template>
  <div v-if="features.contact">
    <h1 style="margin-bottom: 1.5rem; font-size: 1.5rem">{{ t('contact.title') }}</h1>

    <form class="contact-form" @submit.prevent="handleSubmit" style="max-width: 500px">
      <div class="form-group">
        <label>{{ t('contact.name') }}</label>
        <UiInput v-model="form.name" required />
      </div>

      <div class="form-group">
        <label>{{ t('contact.email') }}</label>
        <UiInput v-model="form.email" type="email" required />
      </div>

      <div class="form-group">
        <label>{{ t('contact.message') }}</label>
        <UiInput multiline v-model="form.message" rows="5" required />
      </div>

      <p v-if="submitted" style="color: #166534; margin-bottom: 1rem; font-size: 0.9rem">
        {{ t('contact.success') }}
      </p>

      <p v-if="errorMsg" style="color: #dc2626; margin-bottom: 1rem; font-size: 0.9rem">
        {{ errorMsg }}
      </p>

      <UiButton type="submit" :disabled="submitting">
        {{ t('contact.send') }}
      </UiButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()

useHead({ title: t('contact.title') })
useSeoMeta({ title: t('contact.title') })

const form = reactive({ name: '', email: '', message: '' })
const submitting = ref(false)
const submitted = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  submitting.value = true
  errorMsg.value = ''
  submitted.value = false

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { ...form },
    })
    submitted.value = true
    form.name = ''
    form.email = ''
    form.message = ''
  } catch {
    errorMsg.value = t('contact.error')
  } finally {
    submitting.value = false
  }
}
</script>
