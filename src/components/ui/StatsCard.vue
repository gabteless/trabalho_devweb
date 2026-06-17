<template>
  <div class="stats-card" :class="variantClass">
    <div class="stats-icon" :class="iconClass">
      <i :class="icon"></i>
    </div>
    <div class="stats-content">
      <div class="stats-label">{{ label }}</div>
      <div class="stats-value">{{ formattedValue }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: [Number, String],
  icon: String,
  variant: {
    type: String,
    default: 'primary'
  },
  isCurrency: {
    type: Boolean,
    default: false
  }
})

const variantClass = computed(() => `stats-${props.variant}`)
const iconClass = computed(() => `icon-${props.variant}`)

const formattedValue = computed(() => {
  if (props.isCurrency) {
    return Number(props.value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }
  return props.value
})
</script>
