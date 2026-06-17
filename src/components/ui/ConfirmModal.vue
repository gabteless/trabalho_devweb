<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
      <div class="modal-card">
        <h3>
          <i class="bi bi-exclamation-triangle-fill" style="color: var(--warning); margin-right: 8px;"></i>
          {{ title }}
        </h3>
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button class="btn-secondary-custom" @click="$emit('cancel')">Cancelar</button>
          <button class="btn-danger-custom" @click="$emit('confirm')">
            <i class="bi bi-trash3"></i>
            Excluir
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: 'Confirmar Exclusão'
  },
  message: {
    type: String,
    default: 'Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.'
  }
})

defineEmits(['confirm', 'cancel'])
</script>
