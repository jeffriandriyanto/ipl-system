<template>
  <div>
    <div
      class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 transition-colors"
      :class="{ 'border-primary-500 bg-primary-50': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <UIcon name="i-lucide-upload" class="text-3xl text-gray-400 mb-2" />
      <p class="text-sm text-gray-500">
        Drag & drop file Excel atau <span class="text-primary-500">klik untuk pilih</span>
      </p>
      <p class="text-xs text-gray-400 mt-1">.xlsx, .xls</p>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".xlsx,.xls"
      class="hidden"
      @change="handleFileSelect"
    />

    <div v-if="file" class="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-file-spreadsheet" class="text-green-600" />
        <span class="text-sm">{{ file.name }}</span>
      </div>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        size="xs"
        @click="removeFile"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: File,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'upload'])

const fileInput = ref(null)
const isDragging = ref(false)
const file = computed(() => props.modelValue)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event) {
  const selectedFile = event.target.files[0]
  if (selectedFile) {
    emit('update:modelValue', selectedFile)
  }
}

function handleDrop(event) {
  isDragging.value = false
  const droppedFile = event.dataTransfer.files[0]
  if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
    emit('update:modelValue', droppedFile)
  }
}

function removeFile() {
  emit('update:modelValue', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
