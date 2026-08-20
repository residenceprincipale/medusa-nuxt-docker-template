<template>
  <div v-if="features.about">
    <h1 class="page-title">{{ t('about.title') }}</h1>
    <p>{{ t('about.content') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()

useHead({ title: t('about.title') })
useSeoMeta({ title: t('about.title'), description: t('about.content') })
</script>

<style scoped>
.page-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
