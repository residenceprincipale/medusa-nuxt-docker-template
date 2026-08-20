<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-links">
        <NuxtLink v-if="features.categories" to="/categories">{{ t('footer.categories') }}</NuxtLink>
        <NuxtLink v-if="features.blog" to="/blog">{{ t('footer.blog') }}</NuxtLink>
        <NuxtLink v-if="features.about" to="/about">{{ t('footer.about') }}</NuxtLink>
        <NuxtLink v-if="features.contact" to="/contact">{{ t('footer.contact') }}</NuxtLink>
      </div>

      <div v-if="features.newsletter" class="newsletter-form">
        <NewsletterForm @subscribe="handleSubscribe" />
      </div>

      <div class="footer-copyright">
        <p>{{ t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()
const sdk = useMedusa()

async function handleSubscribe(email: string) {
  try {
    await sdk.client.fetch('/store/newsletter', {
      method: 'POST',
      body: { email },
    })
  } catch (e) {
    console.error('Newsletter subscription failed:', e instanceof Error ? e.message : String(e))
  }
}
</script>

<style scoped>
.site-footer {
  border-top: 1px solid var(--border);
  margin-top: 5rem;
  padding: 2.5rem 0;
  color: var(--muted);
  font-size: 0.85rem;
}
.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.footer-links {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.footer-links a {
  text-decoration: none;
}
.footer-copyright {
  font-size: 0.8rem;
}
</style>
