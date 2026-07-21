<template>
  <div class="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-primary-600">IPL System</h1>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-md mx-auto px-4 py-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-center mb-6">Cek Tagihan Iuran</h2>

        <!-- Filter Form -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Blok</label>
            <USelect
              v-model="selectedBlok"
              :options="blokOptions"
              placeholder="Pilih Blok"
              @change="onBlokChange"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">No. Rumah</label>
            <USelect
              v-model="selectedNomor"
              :options="nomorOptions"
              placeholder="Pilih Nomor Rumah"
              :disabled="!selectedBlok"
            />
          </div>

          <UButton
            label="Cek Tagihan"
            :disabled="!selectedBlok || !selectedNomor"
            :loading="loading"
            block
            @click="cekTagihan"
          />
        </div>

        <!-- Tagihan Result -->
        <div v-if="tagihan" class="mt-6 pt-6 border-t">
          <div class="text-center mb-4">
            <p class="text-sm text-gray-500">{{ tagihan.blok }}-{{ tagihan.nomor_rumah }}</p>
            <p class="text-lg font-semibold">Periode: {{ tagihan.periode }}</p>
          </div>

          <div class="space-y-3">
            <div
              v-for="item in tagihan.items"
              :key="item.kategori_id"
              class="flex justify-between items-center py-2 border-b"
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
                {{ formatRupiah(tagihan.total_tagihan) }}
              </p>
            </div>
          </div>

          <div class="mt-4 p-3 rounded-lg" :class="statusClass">
            <p class="font-semibold text-center">{{ statusText }}</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="notFound" class="mt-6 pt-6 border-t text-center">
          <UIcon name="i-lucide-alert-circle" class="text-4xl text-gray-400 mb-2" />
          <p class="text-gray-500">Data tagihan tidak ditemukan</p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-gray-400 mt-6">
        © 2026 IPL System
      </p>
    </main>
  </div>
</template>

<script setup>
const selectedBlok = ref('')
const selectedNomor = ref('')
const loading = ref(false)
const tagihan = ref(null)
const notFound = ref(false)

const blokOptions = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'FASUM', value: 'FASUM' }
]

const nomorOptions = ref([])

function onBlokChange() {
  selectedNomor.value = ''
  // Fetch nomor options based on selected blok
  // This will be implemented with API call
  nomorOptions.value = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '1-2', value: '1-2' }
  ]
}

async function cekTagihan() {
  loading.value = true
  notFound.value = false
  tagihan.value = null

  try {
    // API call to get tagihan
    // This will be implemented with actual API
    const response = await $fetch('/api/tagihan/cek', {
      params: {
        blok: selectedBlok.value,
        nomor: selectedNomor.value
      }
    })

    if (response) {
      tagihan.value = response
    } else {
      notFound.value = true
    }
  } catch (error) {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

const statusClass = computed(() => {
  if (!tagihan.value) return ''
  switch (tagihan.value.status) {
    case 'lunas':
      return 'bg-green-100 text-green-800'
    case 'belum_bayar':
      return 'bg-red-100 text-red-800'
    case 'kurang':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const statusText = computed(() => {
  if (!tagihan.value) return ''
  switch (tagihan.value.status) {
    case 'lunas':
      return '✓ LUNAS'
    case 'belum_bayar':
      return '✗ BELUM LUNAS'
    case 'kurang':
      return `⚠ KURANG ${formatRupiah(Math.abs(tagihan.value.selisih))}`
    case 'lebih':
      return `✓ LEBIH ${formatRupiah(tagihan.value.saldo_lebih)}`
    default:
      return tagihan.value.status
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
