<template>
  <div v-if="features.auth">
    <h1 class="page-title">{{ t('auth.requestResetTitle') }}</h1>

    <p class="hint">{{ t('auth.requestResetHint') }}</p>

    <form v-if="!sent" class="auth-form" @submit.prevent="requestReset">
      <div class="form-group">
        <label>{{ t('auth.email') }}</label>
        <UiInput v-model="email" type="email" required />
      </div>

      <p v-if="error" class="auth-error">{{ error }}</p>

      <UiButton type="submit" block :disabled="loading">
        {{ t('auth.requestResetButton') }}
      </UiButton>
    </form>

    <p v-else class="sent">{{ t('auth.requestResetSent') }}</p>

    <p class="auth-hint">
      <NuxtLink to="/auth/login">{{ t('auth.loginTitle') }}</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()
const sdk = useMedusa()

useHead({ title: t('auth.requestResetTitle') })
useSeoMeta({ title: t('auth.requestResetTitle') })

const email = ref('')
const loading = ref(false)
const sent = ref(false)
const error = ref('')

async function requestReset() {
  if (!email.value) return
  loading.value = true
  error.value = ''
  try {
    await sdk.auth.resetPassword('customer', 'emailpass', { identifier: email.value })
    sent.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Request failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-title {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
}
.hint {
  margin-bottom: 1.5rem;
  color: var(--muted);
  max-width: 400px;
}
.auth-form {
  max-width: 400px;
}
.auth-error {
  color: var(--error);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}
.sent {
  color: green;
  max-width: 400px;
}
.auth-hint {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}
</style>
