<template>
  <div v-if="features.blog">
    <div v-if="pending" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error || !post" class="error">{{ t('common.error') }}</div>

    <div v-else class="blog-post">
      <NuxtLink to="/blog" class="blog-post__back">{{ t('blog.backToBlog') }}</NuxtLink>

      <h1 class="blog-post__title">{{ post.title }}</h1>

      <div class="blog-post__meta">
        <span v-if="post.author">{{ post.author }}</span>
        <span>{{ new Date(post.created_at).toLocaleDateString() }}</span>
      </div>

      <div class="blog-post__content" v-html="post.content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()
const route = useRoute()

useHead({ title: () => post.value?.title ?? t('common.loading') })
useSeoMeta({
  title: () => post.value?.title ?? t('common.loading'),
  description: () => post.value?.excerpt ?? '',
})

const { data: post, pending, error } = await useAsyncData(
  `blog-${route.params.handle}`,
  () => $fetch(`/api/blog/${route.params.handle}`),
)
</script>
