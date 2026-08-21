<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-links">
        <NuxtLink to="/categories">{{ t('footer.categories') }}</NuxtLink>
        <NuxtLink to="/about">{{ t('footer.about') }}</NuxtLink>
        <NuxtLink to="/contact">{{ t('footer.contact') }}</NuxtLink>
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
