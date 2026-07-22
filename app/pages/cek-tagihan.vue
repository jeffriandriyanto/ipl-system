<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-800">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div class="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>
      
      <div class="relative max-w-lg mx-auto px-4 py-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
          <UIcon name="i-lucide-building-2" class="text-3xl text-white" />
        </div>
        <h1 class="text-3xl font-bold text-white mb-1">{{ settings.nama_aplikasi || 'IPL System' }}</h1>
        <p class="text-green-100 text-sm">{{ settings.nama_perumahan || 'Perumahan Waris 1' }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-lg mx-auto px-4 -mt-8 relative z-10 pb-12">
      <!-- Search Card -->
      <UCard class="shadow-xl border-0 ring-1 ring-gray-200/50 dark:ring-gray-800/50">
        <template #header>
          <div class="text-center pb-2">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Cek Tagihan Iuran</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Masukkan blok dan nomor rumah Anda</p>
          </div>
        </template>

        <form @submit.prevent="cekTagihan" class="space-y-4">
          <UFormField label="Blok" name="blok">
            <USelect
              v-model="selectedBlok"
              :items="blokOptions.map(b => ({ label: `Blok ${b}`, value: b }))"
              placeholder="Pilih Blok"
              icon="i-lucide-map-pin"
              size="lg"
              :ui="{ base: 'w-full' }"
            />
          </UFormField>

          <UFormField label="Nomor Rumah" name="nomor">
            <USelect
              v-model="selectedNomor"
              :items="nomorOptions.map(n => ({ label: `No. ${n}`, value: n }))"
              placeholder="Pilih Nomor Rumah"
              icon="i-lucide-home"
              size="lg"
              :disabled="!selectedBlok"
              :ui="{ base: 'w-full' }"
            />
          </UFormField>

          <UButton
            type="submit"
            label="Cek Tagihan"
            icon="i-lucide-search"
            size="lg"
            block
            :loading="loading"
            :disabled="!selectedBlok || !selectedNomor"
            class="mt-2"
          />
        </form>
      </UCard>

      <!-- Result -->
      <div v-if="tagihan" class="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <!-- House Info Card -->
        <UCard class="shadow-lg border-0 ring-1 ring-gray-200/50 dark:ring-gray-800/50">
          <div class="flex items-center gap-4">
            <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <UIcon name="i-lucide-home" class="text-2xl text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ tagihan.blok }}-{{ tagihan.nomor_rumah }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatPeriode(tagihan.periode) }}</p>
            </div>
            <div class="flex-shrink-0">
              <UBadge
                :label="statusBadgeText"
                :color="statusBadgeColor"
                variant="subtle"
                size="lg"
              />
            </div>
          </div>
        </UCard>

        <!-- Tagihan Details -->
        <UCard class="shadow-lg border-0 ring-1 ring-gray-200/50 dark:ring-gray-800/50">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-receipt" class="text-green-600" />
              <span class="font-semibold">Detail Tagihan</span>
            </div>
          </template>

          <div class="space-y-3">
            <div
              v-for="item in tagihan.items"
              :key="item.kategori_id"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="item.tipe === 'meteran' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-orange-100 dark:bg-orange-900/30'"
                >
                  <UIcon
                    :name="item.tipe === 'meteran' ? 'i-lucide-droplets' : 'i-lucide-trash-2'"
                    :class="item.tipe === 'meteran' ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'"
                  />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white text-sm">{{ item.kategori_nama }}</p>
                  <p v-if="item.tipe === 'meteran'" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ item.pemakaian }} m³
                  </p>
                </div>
              </div>
              <p class="font-bold text-gray-900 dark:text-white">{{ formatRupiah(item.jumlah_tagihan) }}</p>
            </div>
          </div>

          <!-- Total -->
          <div class="mt-4 pt-4 border-t-2 border-green-500">
            <div class="flex justify-between items-center">
              <p class="font-semibold text-gray-700 dark:text-gray-300">Total Tagihan</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formatRupiah(tagihan.total_tagihan) }}</p>
            </div>
          </div>
        </UCard>

        <!-- Status Card -->
        <UCard
          class="shadow-lg border-0 ring-1"
          :class="statusRingClass"
          :ui="{ body: { padding: 'p-4' } }"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              :class="statusIconBg"
            >
              <UIcon :name="statusIcon" class="text-2xl text-white" />
            </div>
            <div class="flex-1">
              <p class="font-bold text-lg" :class="statusTextColor">{{ statusText }}</p>
              <p v-if="tagihan.status === 'belum_bayar' || tagihan.status === 'kurang'" class="text-xs text-gray-500 dark:text-gray-400">
                Bayar sebelum tanggal 25
              </p>
            </div>
          </div>
        </UCard>

        <!-- Payment Info -->
        <UCard v-if="paymentInfo" class="shadow-lg border-0 ring-1 ring-gray-200/50 dark:ring-gray-800/50">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-credit-card" class="text-green-600" />
              <span class="font-semibold">Info Pembayaran</span>
            </div>
          </template>
          <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ paymentInfo }}</p>
          </div>
        </UCard>

        <!-- Back Button -->
        <UButton
          label="Cek Rumah Lain"
          icon="i-lucide-arrow-left"
          variant="outline"
          color="neutral"
          size="lg"
          block
          @click="resetSearch"
        />
      </div>

      <!-- Not Found -->
      <div v-if="notFound" class="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <UCard class="shadow-lg border-0 ring-1 ring-red-200/50 dark:ring-red-800/50">
          <div class="text-center py-4">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-4">
              <UIcon name="i-lucide-search-x" class="text-3xl text-red-500" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Tagihan Tidak Ditemukan</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Pastikan blok dan nomor rumah sudah benar</p>
            <UButton
              label="Coba Lagi"
              icon="i-lucide-refresh-cw"
              color="error"
              variant="outline"
              size="lg"
              @click="resetSearch"
            />
          </div>
        </UCard>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6">
      <div class="max-w-lg mx-auto px-4 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">&copy; {{ new Date().getFullYear() }} {{ settings.nama_perumahan || 'Perumahan Waris 1' }}</p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Powered by IPL System</p>
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
const settings = ref({})

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

const statusBadgeColor = computed(() => {
  switch (tagihan.value?.status) {
    case 'lunas': return 'success'
    case 'belum_bayar': return 'error'
    case 'kurang': return 'warning'
    case 'lebih': return 'info'
    default: return 'neutral'
  }
})

const statusBadgeText = computed(() => {
  switch (tagihan.value?.status) {
    case 'lunas': return 'Lunas'
    case 'belum_bayar': return 'Belum Bayar'
    case 'kurang': return 'Kurang'
    case 'lebih': return 'Lebih'
    default: return '-'
  }
})

const statusRingClass = computed(() => {
  switch (tagihan.value?.status) {
    case 'lunas': return 'ring-green-200 dark:ring-green-800'
    case 'belum_bayar': return 'ring-red-200 dark:ring-red-800'
    case 'kurang': return 'ring-yellow-200 dark:ring-yellow-800'
    case 'lebih': return 'ring-blue-200 dark:ring-blue-800'
    default: return 'ring-gray-200 dark:ring-gray-800'
  }
})

const statusIconBg = computed(() => {
  switch (tagihan.value?.status) {
    case 'lunas': return 'bg-green-500'
    case 'belum_bayar': return 'bg-red-500'
    case 'kurang': return 'bg-yellow-500'
    case 'lebih': return 'bg-blue-500'
    default: return 'bg-gray-500'
  }
})

const statusTextColor = computed(() => {
  switch (tagihan.value?.status) {
    case 'lunas': return 'text-green-600 dark:text-green-400'
    case 'belum_bayar': return 'text-red-600 dark:text-red-400'
    case 'kurang': return 'text-yellow-600 dark:text-yellow-400'
    case 'lebih': return 'text-blue-600 dark:text-blue-400'
    default: return 'text-gray-600'
  }
})

const statusIcon = computed(() => {
  switch (tagihan.value?.status) {
    case 'lunas': return 'i-lucide-check-circle'
    case 'belum_bayar': return 'i-lucide-x-circle'
    case 'kurang': return 'i-lucide-alert-triangle'
    case 'lebih': return 'i-lucide-arrow-up-circle'
    default: return 'i-lucide-info'
  }
})

const statusText = computed(() => {
  switch (tagihan.value?.status) {
    case 'lunas': return 'Tagihan Lunas'
    case 'belum_bayar': return 'Belum Melakukan Pembayaran'
    case 'kurang': return `Kurang Bayar ${formatRupiah(Math.abs(tagihan.value?.selisih || 0))}`
    case 'lebih': return `Saldo Lebih ${formatRupiah(tagihan.value?.saldo_lebih || 0)}`
    default: return '-'
  }
})

async function fetchBlokOptions() {
  try {
    const data = await $fetch('/api/rumah?tenant_id=waris1&status=aktif')
    const bloks = [...new Set(data.map(r => r.blok))].sort()
    blokOptions.value = bloks
  } catch (error) {
    console.error('Error fetching blok options:', error)
  }
}

async function fetchNomorOptions() {
  if (!selectedBlok.value) {
    nomorOptions.value = []
    return
  }

  try {
    const data = await $fetch('/api/rumah?tenant_id=waris1&status=aktif')
    const nomors = data
      .filter(r => r.blok === selectedBlok.value)
      .map(r => r.nomor)
      .sort()
    nomorOptions.value = nomors
  } catch (error) {
    console.error('Error fetching nomor options:', error)
  }
}

async function fetchSettings() {
  try {
    const data = await $fetch('/api/settings?tenant_id=waris1')
    if (data) {
      settings.value = data
      paymentInfo.value = data.payment_info || ''
    }
  } catch {
    // ignore
  }
}

async function cekTagihan() {
  loading.value = true
  notFound.value = false
  tagihan.value = null

  try {
    const periodes = await $fetch('/api/tutup-buku?tenant_id=waris1')
    // Cari periode terbaru yang sudah ditutup (bukan draft)
    const closedPeriod = periodes.find(p => p.status === 'ditutup')

    if (!closedPeriod) {
      notFound.value = true
      return
    }

    const data = await $fetch(`/api/tagihan?tenant_id=waris1&periode=${closedPeriod.periode}`)
    const found = data.data?.find(t =>
      t.blok === selectedBlok.value && t.nomor_rumah === selectedNomor.value
    )

    if (found) {
      tagihan.value = { ...found, periode: closedPeriod.periode }
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

watch(selectedBlok, () => {
  selectedNomor.value = ''
  fetchNomorOptions()
})

onMounted(() => {
  fetchBlokOptions()
  fetchSettings()
})
</script>
