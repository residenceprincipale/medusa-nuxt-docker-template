<template>
  <div class="review-list">
    <p v-if="!reviews.length" class="review-list__empty">
      {{ t('reviews.empty') }}
    </p>

    <div v-for="(review, index) in reviews" :key="index" class="review-item">
      <div class="review-item__header">
        <span class="review-item__author">{{
          review.author_name || review.customer?.first_name || t('reviews.anonymous')
        }}</span>
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

<style scoped>
.review-list {
  margin-top: 2rem;
}
.review-list__empty {
  color: var(--muted);
}
.review-item {
  border-bottom: 1px solid var(--border);
  padding: 1rem 0;
}
.review-item__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}
.review-item__author {
  font-weight: 600;
}
.review-item__rating {
  color: var(--muted);
}
.review-item__date {
  color: var(--muted);
  font-size: 0.85rem;
  display: block;
  margin-bottom: 0.35rem;
}
.review-item__comment {
  color: var(--muted);
}
</style>
