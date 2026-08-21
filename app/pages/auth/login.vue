<template>
  <div>
    <h1 class="page-title">{{ t('auth.loginTitle') }}</h1>

    <form class="auth-form" @submit.prevent="handleLogin">
      <div class="form-group">
        <label>{{ t('auth.email') }}</label>
        <UiInput v-model="email" type="email" required />
      </div>

      <div class="form-group">
        <label>{{ t('auth.password') }}</label>
        <UiInput v-model="password" type="password" required />
        <NuxtLink to="/auth/forgot-password" class="forgot">{{ t('auth.forgotPassword') }}</NuxtLink>
      </div>

      <p v-if="authStore.error" class="auth-error">
        {{ authStore.error }}
      </p>

      <UiButton type="submit" block :disabled="authStore.loading">
        {{ authStore.loading ? t('auth.loggingIn') : t('auth.loginButton') }}
      </UiButton>

      <p class="auth-hint">
        {{ t('auth.noAccount') }}
        <NuxtLink to="/auth/register">{{ t('auth.registerButton') }}</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
  } catch {
    /* error displayed from store */
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
.auth-hint {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}
.forgot {
  display: inline-block;
  margin-top: 0.3rem;
  font-size: 0.8rem;
}
</style>
