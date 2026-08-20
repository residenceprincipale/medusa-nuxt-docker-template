<template>
  <div v-if="features.auth">
    <h1 class="page-title">{{ t('auth.resetTitle') }}</h1>

    <p v-if="!token" class="auth-error">{{ t('auth.resetError') }}</p>

    <form v-else class="auth-form" @submit.prevent="reset">
      <div class="form-group">
        <label>{{ t('auth.newPassword') }}</label>
        <UiInput v-model="password" type="password" required />
      </div>

      <p v-if="error" class="auth-error">{{ error }}</p>
      <p v-if="done" class="sent">{{ t('auth.resetSuccess') }}</p>

      <UiButton v-if="!done" type="submit" block :disabled="loading">
        {{ t('auth.resetButton') }}
      </UiButton>

      <p v-else class="auth-hint">
        <NuxtLink to="/auth/login">{{ t('auth.loginTitle') }}</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()
const sdk = useMedusa()
const route = useRoute()
const router = useRouter()

useHead({ title: t('auth.resetTitle') })
useSeoMeta({ title: t('auth.resetTitle') })

const token = route.query.token as string | undefined
const email = route.query.email as string | undefined
const password = ref('')
const loading = ref(false)
const done = ref(false)
const error = ref('')

async function reset() {
  if (!token || !password.value) return
  loading.value = true
  error.value = ''
  try {
    await sdk.auth.updateProvider('customer', 'emailpass', { email, password: password.value }, token)
    done.value = true
  } catch (e: any) {
    error.value = e?.message || t('auth.resetError')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
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
  margin-bottom: 1rem;
}
.auth-hint {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}
</style>
