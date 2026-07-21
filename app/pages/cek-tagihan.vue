<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-white">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-2xl mx-auto px-4 py-4">
        <div class="flex items-center justify-center gap-3">
          <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <UIcon name="i-lucide-home" class="text-white text-lg" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-800">IPL System</h1>
            <p class="text-sm text-gray-500">Perumahan Waris 1</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-2xl mx-auto px-4 py-6">
      <!-- Search Card -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-search" class="text-green-600 text-2xl" />
          </div>
          <h2 class="text-2xl font-bold text-gray-800">Cek Tagihan Iuran</h2>
          <p class="text-gray-500 mt-1">Masukkan blok dan nomor rumah Anda</p>
        </div>

        <form @submit.prevent="cekTagihan" class="space-y-4">
          <div>
            <label class="block text-base font-semibold text-gray-700 mb-2">Blok</label>
            <select
              v-model="selectedBlok"
              class="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              required
            >
              <option value="">Pilih Blok</option>
              <option v-for="blok in blokOptions" :key="blok" :value="blok">{{ blok }}</option>
            </select>
          </div>

          <div>
            <label class="block text-base font-semibold text-gray-700 mb-2">Nomor Rumah</label>
            <select
              v-model="selectedNomor"
              class="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              :disabled="!selectedBlok"
              required
            >
              <option value="">Pilih Nomor Rumah</option>
              <option v-for="nomor in nomorOptions" :key="nomor" :value="nomor">{{ nomor }}</option>
            </select>
          </div>

          <button
            type="submit"
            :disabled="!selectedBlok || !selectedNomor || loading"
            class="w-full py-4 text-lg font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading">Memproses...</span>
            <span v-else>🔍 Cek Tagihan</span>
          </button>
        </form>
      </div>

      <!-- Result -->
      <div v-if="tagihan" class="space-y-4">
        <!-- House Info -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <UIcon name="i-lucide-home" class="text-green-600 text-xl" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">{{ tagihan.blok }}-{{ tagihan.nomor_rumah }}</h3>
              <p class="text-gray-500">{{ formatPeriode(tagihan.periode) }}</p>
            </div>
          </div>
        </div>

        <!-- Tagihan Details -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Detail Tagihan</h3>
            
            <div class="space-y-3">
              <div
                v-for="item in tagihan.items"
                :key="item.kategori_id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center"
                    :class="item.tipe === 'meteran' ? 'bg-blue-100' : 'bg-orange-100'"
                  >
                    <UIcon 
                      :name="item.tipe === 'meteran' ? 'i-lucide-droplets' : 'i-lucide-trash-2'" 
                      class="text-lg"
                      :class="item.tipe === 'meteran' ? 'text-blue-600' : 'text-orange-600'"
                    />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">{{ item.kategori_nama }}</p>
                    <p v-if="item.tipe === 'meteran'" class="text-sm text-gray-500">
                      Pemakaian: {{ item.pemakaian }} m³
                    </p>
                  </div>
                </div>
                <p class="text-lg font-bold text-gray-800">{{ formatRupiah(item.jumlah_tagihan) }}</p>
              </div>
            </div>

            <!-- Total -->
            <div class="mt-4 pt-4 border-t-2 border-green-500">
              <div class="flex justify-between items-center">
                <p class="text-xl font-bold text-gray-800">TOTAL TAGIHAN</p>
                <p class="text-2xl font-bold text-green-600">{{ formatRupiah(tagihan.total_tagihan) }}</p>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div class="px-6 py-4" :class="statusBackground">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon :name="statusIcon" class="text-xl" :class="statusTextColor" />
                <p class="text-lg font-bold" :class="statusTextColor">{{ statusText }}</p>
              </div>
              <p v-if="tagihan.status === 'belum_bayar' || tagihan.status === 'kurang'" class="text-sm" :class="statusTextColor">
                Bayar sebelum tgl 25
              </p>
            </div>
          </div>
        </div>

        <!-- Payment Info -->
        <div v-if="paymentInfo" class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-credit-card" class="text-green-600" />
            Info Pembayaran
          </h3>
          <div class="bg-green-50 rounded-xl p-4">
            <p class="text-gray-700">{{ paymentInfo }}</p>
          </div>
        </div>

        <!-- Back Button -->
        <button
          @click="resetSearch"
          class="w-full py-4 text-lg font-bold text-green-600 bg-white border-2 border-green-600 rounded-xl hover:bg-green-50 transition-colors"
        >
          ← Cek Rumah Lain
        </button>
      </div>

      <!-- Not Found -->
      <div v-if="notFound" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-lucide-alert-circle" class="text-red-600 text-2xl" />
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">Tagihan Tidak Ditemukan</h3>
        <p class="text-gray-500 mb-4">Pastikan blok dan nomor rumah sudah benar</p>
        <button
          @click="resetSearch"
          class="px-6 py-3 font-semibold text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-8 py-6">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <p class="text-gray-500">© 2026 Perumahan Waris 1</p>
        <p class="text-sm text-gray-400 mt-1">IPL System - Manajemen Iuran Warga</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const selectedBlok = ref('')
const selectedNomor = ref('')
const loading = ref(false)
const tagihan = ref(null)
const notFound = ref(false)
const paymentInfo = ref('')

const blokOptions = ref([])
const nomorOptions = ref([])

const { formatRupiah } = useBilling()

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

function formatPeriode(periode) {
  const [year, month] = periode.split('-')
  return `${months[parseInt(month) - 1]} ${year}`
}

const statusBackground = computed(() => {
  switch (tagihan.value?.status) {
    case 'lunas': return 'bg-green-50'
    case 'belum_bayar': return 'bg-red-50'
    case 'kurang': return 'bg-yellow-50'
    case 'lebih': return 'bg-blue-50'
    default: return 'bg-gray-50'
  }
})

const statusTextColor = computed(() => {
  switch (tagihan.value?.status) {
    case 'lunas': return 'text-green-600'
    case 'belum_bayar': return 'text-red-600'
    case 'kurang': return 'text-yellow-600'
    case 'lebih': return 'text-blue-600'
    default: return 'text-gray-600'
  }
})

const statusIcon = computed(() => {
  switch (tagihan.value?.status) {
    case 'lunas': return 'i-lucide-check-circle'
    case 'belum_bayar': return 'i-lucide-alert-circle'
    case 'kurang': return 'i-lucide-alert-triangle'
    case 'lebih': return 'i-lucide-info'
    default: return 'i-lucide-info'
  }
})

const statusText = computed(() => {
  switch (tagihan.value?.status) {
    case 'lunas': return '✓ LUNAS'
    case 'belum_bayar': return '⚠ BELUM LUNAS'
    case 'kurang': return `⚠ KURANG ${formatRupiah(Math.abs(tagihan.value?.selisih || 0))}`
    case 'lebih': return `✓ LEBIH ${formatRupiah(tagihan.value?.saldo_lebih || 0)}`
    default: return '-'
  }
})

// Fetch blok options
async function fetchBlokOptions() {
  try {
    const data = await $fetch('/api/rumah?tenant_id=waris1&status=aktif')
    const bloks = [...new Set(data.map(r => r.blok))].sort()
    blokOptions.value = bloks
  } catch (error) {
    console.error('Error fetching blok options:', error)
  }
}

// Fetch nomor options when blok changes
async function fetchNomorOptions() {
  if (!selectedBlok.value) {
    nomorOptions.value = []
    return
  }

  try {
    const data = await $fetch(`/api/rumah?tenant_id=waris1&status=aktif`)
    const nomors = data
      .filter(r => r.blok === selectedBlok.value)
      .map(r => r.nomor)
      .sort()
    nomorOptions.value = nomors
  } catch (error) {
    console.error('Error fetching nomor options:', error)
  }
}

// Fetch payment info
async function fetchPaymentInfo() {
  try {
    const data = await $fetch('/api/settings?tenant_id=waris1')
    paymentInfo.value = data?.payment_info || 'Transfer ke BCA xxx a.n Bendahara'
  } catch {
    paymentInfo.value = 'Transfer ke BCA xxx a.n Bendahara'
  }
}

// Cek tagihan
async function cekTagihan() {
  loading.value = true
  notFound.value = false
  tagihan.value = null

  try {
    // Get current published period
    const periodes = await $fetch('/api/tutup-buku?tenant_id=waris1')
    const publishedPeriod = periodes.find(p => p.status === 'published')

    if (!publishedPeriod) {
      notFound.value = true
      return
    }

    // Get tagihan
    const data = await $fetch(`/api/tagihan?tenant_id=waris1&periode=${publishedPeriod.periode}`)
    const found = data.data?.find(t => 
      t.blok === selectedBlok.value && t.nomor_rumah === selectedNomor.value
    )

    if (found) {
      tagihan.value = { ...found, periode: publishedPeriod.periode }
    } else {
      notFound.value = true
    }
  } catch (error) {
    console.error('Error fetching tagihan:', error)
    notFound.value = true
  } finally {
    loading.value = false
  }
}

function resetSearch() {
  selectedBlok.value = ''
  selectedNomor.value = ''
  tagihan.value = null
  notFound.value = false
}

// Watch blok changes
watch(selectedBlok, () => {
  selectedNomor.value = ''
  fetchNomorOptions()
})

onMounted(() => {
  fetchBlokOptions()
  fetchPaymentInfo()
})
</script>
