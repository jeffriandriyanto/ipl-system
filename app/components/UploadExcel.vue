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

    <div v-if="file" class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-file-spreadsheet" class="text-green-600" />
        <span class="text-sm">{{ file.name }}</span>
        <span class="text-xs text-gray-400">({{ fileSize }})</span>
      </div>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        size="xs"
        @click="removeFile"
      />
    </div>

    <div v-if="parsedData.length > 0" class="mt-4">
      <p class="text-sm font-medium mb-2">Preview ({{ parsedData.length }} baris):</p>
      <div class="max-h-48 overflow-auto border rounded-lg">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-100 dark:bg-gray-700">
              <th v-for="header in parsedHeaders" :key="header" class="p-2 text-left text-xs font-medium">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in parsedData.slice(0, 5)" :key="idx" class="border-t">
              <td v-for="header in parsedHeaders" :key="header" class="p-2 text-xs">
                {{ row[header] || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="parsedData.length > 5" class="text-xs text-gray-400 mt-1">
        Menampilkan 5 dari {{ parsedData.length }} baris
      </p>
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

const emit = defineEmits(['update:modelValue', 'parsed'])

const fileInput = ref(null)
const isDragging = ref(false)
const file = computed(() => props.modelValue)
const parsedData = ref([])
const parsedHeaders = ref([])

const { readExcelFile } = useExcel()

const fileSize = computed(() => {
  if (!file.value) return ''
  const bytes = file.value.size
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
})

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileSelect(event) {
  const selectedFile = event.target.files[0]
  if (selectedFile) {
    await processFile(selectedFile)
  }
}

async function handleDrop(event) {
  isDragging.value = false
  const droppedFile = event.dataTransfer.files[0]
  if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
    await processFile(droppedFile)
  }
}

async function processFile(selectedFile) {
  emit('update:modelValue', selectedFile)
  
  try {
    const data = await readExcelFile(selectedFile)
    parsedData.value = data
    parsedHeaders.value = data.length > 0 ? Object.keys(data[0]) : []
    emit('parsed', data)
  } catch (error) {
    console.error('Error parsing Excel:', error)
    alert('Gagal membaca file Excel')
  }
}

function removeFile() {
  emit('update:modelValue', null)
  parsedData.value = []
  parsedHeaders.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
