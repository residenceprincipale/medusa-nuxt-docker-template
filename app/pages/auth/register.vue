<template>
  <div>
    <h1 class="page-title">{{ t('auth.registerTitle') }}</h1>

    <form class="auth-form" @submit.prevent="handleRegister">
      <div class="form-row">
        <div class="form-group">
          <label>{{ t('auth.firstName') }}</label>
          <UiInput v-model="form.first_name" required />
        </div>
        <div class="form-group">
          <label>{{ t('auth.lastName') }}</label>
          <UiInput v-model="form.last_name" required />
        </div>
      </div>

      <div class="form-group">
        <label>{{ t('auth.email') }}</label>
        <UiInput v-model="form.email" type="email" required />
      </div>

      <div class="form-group">
        <label>{{ t('auth.password') }}</label>
        <UiInput v-model="form.password" type="password" required />
      </div>

      <p v-if="authStore.error" class="auth-error">
        {{ authStore.error }}
      </p>

      <UiButton type="submit" block :disabled="authStore.loading">
        {{ authStore.loading ? t('auth.registering') : t('auth.registerButton') }}
      </UiButton>

      <p class="auth-hint">
        {{ t('auth.hasAccount') }}
        <NuxtLink to="/auth/login">{{ t('auth.loginButton') }}</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

useHead({ title: t('auth.registerTitle') })
useSeoMeta({ title: t('auth.registerTitle') })

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
})

async function handleRegister() {
  try {
    await authStore.register(form)
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
</style>
