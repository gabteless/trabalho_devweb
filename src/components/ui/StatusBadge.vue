<template>
  <span class="badge-status" :class="badgeClass">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const badgeClass = computed(() => `badge-${props.status}`)

const label = computed(() => {
  const labels = {
    ativo: 'Ativo',
    inativo: 'Inativo',
    pago: 'Pago',
    pendente: 'Pendente',
    atrasado: 'Atrasado'
  }
  return labels[props.status] || props.status
})
</script>
