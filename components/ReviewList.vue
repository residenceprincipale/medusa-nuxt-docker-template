<template>
  <div class="review-list">
    <p v-if="!reviews.length" class="review-list__empty">
      {{ t('reviews.empty') }}
    </p>

    <div
      v-for="(review, index) in reviews"
      :key="index"
      class="review-item"
    >
      <div class="review-item__header">
        <span class="review-item__author">{{ review.author_name || review.customer?.first_name || t('reviews.anonymous') }}</span>
        <span class="review-item__rating">
          <span v-for="star in 5" :key="star">
            {{ star <= review.rating ? '\u2605' : '\u2606' }}
          </span>
        </span>
      </div>

      <span class="review-item__date">
        {{ new Date(review.created_at).toLocaleDateString() }}
      </span>

      <p class="review-item__comment">{{ review.comment }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  reviews: any[]
}>()
</script>
