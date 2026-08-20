<template>
  <div v-if="features.auth">
    <h1 style="margin-bottom: 1.5rem; font-size: 1.5rem">{{ t('auth.loginTitle') }}</h1>

    <form class="auth-form" @submit.prevent="handleLogin" style="max-width: 400px">
      <div class="form-group">
        <label>{{ t('auth.email') }}</label>
        <input v-model="email" type="email" required />
      </div>

      <div class="form-group">
        <label>{{ t('auth.password') }}</label>
        <input v-model="password" type="password" required />
      </div>

      <p v-if="authStore.error" style="color: #dc2626; margin-bottom: 1rem; font-size: 0.9rem">
        {{ authStore.error }}
      </p>

      <button
        type="submit"
        class="btn btn-primary btn-block"
        :disabled="authStore.loading"
      >
        {{ authStore.loading ? t('auth.loggingIn') : t('auth.loginButton') }}
      </button>

      <p style="margin-top: 1rem; text-align: center; font-size: 0.9rem">
        {{ t('auth.noAccount') }}
        <NuxtLink to="/auth/register">{{ t('auth.registerButton') }}</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()
const authStore = useAuthStore()
const router = useRouter()

useHead({ title: t('auth.loginTitle') })
useSeoMeta({ title: t('auth.loginTitle') })

const email = ref('')
const password = ref('')

async function handleLogin() {
  try {
    await authStore.login(email.value, password.value)
    router.push('/account')
  } catch { /* error displayed from store */ }
}
</script>
