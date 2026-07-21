<template>
  <UButton
    :label="label"
    icon="i-lucide-download"
    variant="outline"
    @click="downloadTemplate"
  />
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['rumah', 'meteran', 'pembayaran'].includes(value)
  },
  label: {
    type: String,
    default: 'Download Template'
  }
})

function downloadTemplate() {
  // This will be implemented to generate Excel template
  // using SheetJS library
  const templates = {
    rumah: {
      headers: ['NO', 'BLOK', 'NO RUMAH', 'TIPE', 'STATUS', 'PIC', 'TELEPON', 'KATEGORI IURAN', 'KETERANGAN'],
      filename: 'template-rumah.xlsx'
    },
    meteran: {
      headers: ['NO', 'BLOK', 'NO RUMAH', 'STATUS PENGHUNI', 'PIC BULAN INI', 'METER LALU', 'METER SKRG', 'KETERANGAN'],
      filename: 'template-meteran.xlsx'
    },
    pembayaran: {
      headers: ['NO', 'BLOK', 'NO RUMAH', 'PERIODE', 'BAYAR RP', 'KETERANGAN'],
      filename: 'template-pembayaran.xlsx'
    }
  }

  const template = templates[props.type]
  if (template) {
    // Generate and download Excel file
    // This will be implemented with SheetJS
    console.log('Downloading template:', template.filename)
  }
}
</script>
