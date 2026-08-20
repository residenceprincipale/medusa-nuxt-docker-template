<template>
  <div v-if="features.auth">
    <h1 class="page-title">{{ t('account.title') }}</h1>

    <div v-if="!authStore.isLoggedIn" class="cart-empty">
      <p>{{ t('auth.loginTitle') }}</p>
      <UiButton to="/auth/login" class="login-cta">{{ t('auth.loginButton') }}</UiButton>
    </div>

    <div v-else-if="authStore.customer">
      <div class="account-section">
        <div class="section-head">
          <h2>{{ t('account.profile') }}</h2>
          <UiButton v-if="!editing" variant="ghost" size="sm" @click="startEdit">
            {{ t('account.edit') }}
          </UiButton>
        </div>

        <form v-if="editing" class="edit-form" @submit.prevent="save">
          <label>
            {{ t('account.firstName') }}
            <UiInput v-model="form.first_name" required block />
          </label>
          <label>
            {{ t('account.lastName') }}
            <UiInput v-model="form.last_name" required block />
          </label>
          <label>
            {{ t('account.email') }}
            <UiInput v-model="form.email" type="email" required block />
          </label>
          <label>
            {{ t('account.phone') }}
            <UiInput v-model="form.phone" block />
          </label>

          <p v-if="message" :class="['form-msg', messageType]">{{ message }}</p>

          <div class="form-actions">
            <UiButton type="submit" :disabled="saving">{{ saving ? t('account.saving') : t('account.save') }}</UiButton>
            <UiButton type="button" variant="ghost" @click="editing = false">{{ t('account.cancel') }}</UiButton>
          </div>
        </form>

        <div v-else>
          <p><strong>{{ authStore.customer.first_name }} {{ authStore.customer.last_name }}</strong></p>
          <p>{{ authStore.customer.email }}</p>
          <p v-if="authStore.customer.phone">{{ authStore.customer.phone }}</p>
          <NuxtLink to="/auth/forgot-password" class="reset-link">{{ t('auth.forgotPassword') }}</NuxtLink>
        </div>
      </div>

      <div v-if="features.orderTracking" class="account-section">
        <h2>{{ t('account.orders') }}</h2>
        <div v-if="ordersLoading" class="cart-empty">{{ t('common.loading') }}</div>
        <div v-else-if="!orders.length" class="cart-empty">{{ t('account.noOrders') }}</div>
        <div v-else>
          <NuxtLink v-for="o in orders" :key="o.id" :to="`/orders/${o.id}`" class="order-item">
            <span>{{ o.display_id ?? o.id }}</span>
            <span>{{ formatMoney(o.total, o.currency_code) }}</span>
            <span>{{ o.status }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()
const authStore = useAuthStore()
const sdk = useMedusa()

useHead({ title: t('account.title') })
useSeoMeta({ title: t('account.title') })

const editing = ref(false)
const saving = ref(false)
const message = ref('')
const messageType = ref<'ok' | 'err'>('ok')
const form = reactive({ first_name: '', last_name: '', email: '', phone: '' })

const orders = ref<any[]>([])
const ordersLoading = ref(false)

function startEdit() {
  const c = authStore.customer
  form.first_name = c.first_name ?? ''
  form.last_name = c.last_name ?? ''
  form.email = c.email ?? ''
  form.phone = c.phone ?? ''
  message.value = ''
  editing.value = true
}

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    useRouter().push('/auth/login')
    return
  }
  await authStore.fetchCustomer()

  if (features.orderTracking && authStore.token) {
    ordersLoading.value = true
    try {
      const { orders: list } = await sdk.store.order.list(
        { limit: 50 },
        { Authorization: `Bearer ${authStore.token}` },
      )
      orders.value = list
    } catch {
      orders.value = []
    } finally {
      ordersLoading.value = false
    }
  }
})

async function save() {
  if (!authStore.token) return
  saving.value = true
  message.value = ''
  try {
    await sdk.store.customer.update(
      { first_name: form.first_name, last_name: form.last_name, email: form.email, phone: form.phone || undefined },
      { Authorization: `Bearer ${authStore.token}` },
    )
    await authStore.fetchCustomer()
    message.value = t('account.saved')
    messageType.value = 'ok'
    editing.value = false
  } catch {
    message.value = t('account.updateError')
    messageType.value = 'err'
  } finally {
    saving.value = false
  }
}

function formatMoney(amount: number | undefined, currency = 'usd'): string {
  if (amount == null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase(),
  }).format(amount)
}
</script>

<style scoped>
.account-section {
  margin-bottom: 2rem;
}
.account-section h2 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 360px;
}
.edit-form label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.85rem;
}
.form-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.form-msg {
  font-size: 0.85rem;
  margin: 0;
}
.form-msg.ok {
  color: green;
}
.form-msg.err {
  color: #c00;
}
.order-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: inherit;
}
.page-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}
.login-cta {
  margin-top: 1rem;
}
.reset-link {
  display: inline-block;
  margin-top: 0.4rem;
  font-size: 0.85rem;
}
</style>
