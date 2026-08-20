<template>
  <div v-if="features.blog">
    <h1 style="margin-bottom: 1.5rem; font-size: 1.5rem">{{ t('blog.title') }}</h1>

    <div v-if="pending" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ t('common.error') }}</div>
    <div v-else-if="!posts.length" class="cart-empty">{{ t('blog.empty') }}</div>

    <div v-else class="blog-grid">
      <NuxtLink v-for="post in posts" :key="post.handle" :to="`/blog/${post.handle}`" class="blog-card">
        <h2 class="blog-card__title">{{ post.title }}</h2>
        <p v-if="post.excerpt" class="blog-card__excerpt">{{ post.excerpt }}</p>
        <span class="blog-card__date">{{ new Date(post.created_at).toLocaleDateString() }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()

useHead({ title: t('blog.title') })
useSeoMeta({ title: t('blog.title') })

const { data, pending, error } = await useAsyncData('blog-posts', () => $fetch('/api/blog'))

const posts = computed(() => (data.value as any)?.posts ?? data.value ?? [])
</script>

<style scoped>
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem 1.5rem;
  margin-top: 2rem;
}
.blog-card {
  text-decoration: none;
  color: inherit;
}
.blog-card__title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.blog-card__excerpt {
  color: var(--muted);
  margin-bottom: 0.5rem;
}
.blog-card__date {
  color: var(--muted);
  font-size: 0.85rem;
}
</style>
