<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
    <div class="p-4 bg-primary-50 dark:bg-primary-900/20">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-semibold">{{ blok }}-{{ nomor }}</h3>
          <p class="text-sm text-gray-500">Periode: {{ periode }}</p>
        </div>
        <span
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="statusClass"
        >
          {{ statusText }}
        </span>
      </div>
    </div>

    <div class="p-4">
      <div class="space-y-2">
        <div
          v-for="item in items"
          :key="item.kategori_id"
          class="flex justify-between items-center py-2 border-b last:border-0"
        >
          <div>
            <p class="font-medium">{{ item.kategori_nama }}</p>
            <p v-if="item.tipe === 'meteran'" class="text-sm text-gray-500">
              {{ item.pemakaian }} m³
            </p>
          </div>
          <p class="font-semibold">{{ formatRupiah(item.tagihan) }}</p>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t-2 border-primary-500">
        <div class="flex justify-between items-center">
          <p class="text-lg font-bold">TOTAL</p>
          <p class="text-xl font-bold text-primary-600">
            {{ formatRupiah(totalTagihan) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  blok: { type: String, required: true },
  nomor: { type: String, required: true },
  periode: { type: String, required: true },
  items: { type: Array, required: true },
  totalTagihan: { type: Number, required: true },
  status: { type: String, required: true },
  selisih: { type: Number, default: 0 }
})

const statusClass = computed(() => {
  switch (props.status) {
    case 'lunas':
      return 'bg-green-100 text-green-800'
    case 'belum_bayar':
      return 'bg-red-100 text-red-800'
    case 'kurang':
      return 'bg-yellow-100 text-yellow-800'
    case 'lebih':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const statusText = computed(() => {
  switch (props.status) {
    case 'lunas':
      return 'LUNAS'
    case 'belum_bayar':
      return 'BELUM LUNAS'
    case 'kurang':
      return `KURANG ${formatRupiah(Math.abs(props.selisih))}`
    case 'lebih':
      return 'LEBIH BAYAR'
    default:
      return props.status
  }
})

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>
