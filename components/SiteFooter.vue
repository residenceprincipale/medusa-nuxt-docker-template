<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-links">
        <NuxtLink v-if="features.newsletter" to="/newsletter">{{ t('footer.newsletter') }}</NuxtLink>
        <NuxtLink v-if="features.category" to="/categories">{{ t('footer.categories') }}</NuxtLink>
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

function handleSubscribe(email: string) {
  console.log('Newsletter subscription:', email)
}
</script>
