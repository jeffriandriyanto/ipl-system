<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <div class="text-sm text-gray-500">
        Periode: {{ currentPeriode }}
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Total Rumah -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Rumah</p>
            <p class="text-3xl font-bold text-gray-800">{{ stats.totalRumah }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ stats.rumahAktif }} aktif</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-xl">
            <UIcon name="i-lucide-home" class="text-blue-600 text-2xl" />
          </div>
        </div>
      </div>

      <!-- Sudah Bayar -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Sudah Bayar</p>
            <p class="text-3xl font-bold text-green-600">{{ stats.sudahBayar }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ persenBayar }}% lunas</p>
          </div>
          <div class="p-3 bg-green-100 rounded-xl">
            <UIcon name="i-lucide-check-circle" class="text-green-600 text-2xl" />
          </div>
        </div>
      </div>

      <!-- Belum Bayar -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Belum Bayar</p>
            <p class="text-3xl font-bold text-red-600">{{ stats.belumBayar }}</p>
            <p class="text-xs text-gray-400 mt-1">perlu ditagih</p>
          </div>
          <div class="p-3 bg-red-100 rounded-xl">
            <UIcon name="i-lucide-alert-circle" class="text-red-600 text-2xl" />
          </div>
        </div>
      </div>

      <!-- Total Terkumpul -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Terkumpul</p>
            <p class="text-2xl font-bold text-purple-600">{{ formatRupiah(stats.totalTerkumpul) }}</p>
            <p class="text-xs text-gray-400 mt-1">dari {{ formatRupiah(stats.totalTagihan) }}</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-xl">
            <UIcon name="i-lucide-wallet" class="text-purple-600 text-2xl" />
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mb-6">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-gray-700">Progress Pembayaran</span>
        <span class="text-sm font-bold text-green-600">{{ persenBayar }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-4">
        <div 
          class="bg-green-600 h-4 rounded-full transition-all duration-500"
          :style="{ width: persenBayar + '%' }"
        ></div>
      </div>
      <div class="flex justify-between mt-2 text-xs text-gray-500">
        <span>{{ stats.sudahBayar }} lunas</span>
        <span>{{ stats.belumBayar }} belum</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Quick Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <UIcon name="i-lucide-zap" class="text-yellow-500" />
          Aksi Cepat
        </h2>
        <div class="grid grid-cols-2 gap-3">
          <UButton
            to="/admin/meteran"
            label="Input Meteran"
            icon="i-lucide-gauge"
            color="green"
            variant="outline"
            block
          />
          <UButton
            to="/admin/pembayaran"
            label="Input Pembayaran"
            icon="i-lucide-credit-card"
            color="green"
            variant="outline"
            block
          />
          <UButton
            to="/admin/kas"
            label="Kas Masuk/Keluar"
            icon="i-lucide-wallet"
            color="green"
            variant="outline"
            block
          />
          <UButton
            to="/admin/laporan"
            label="Lihat Laporan"
            icon="i-lucide-bar-chart-3"
            color="green"
            variant="outline"
            block
          />
          <UButton
            to="/admin/tutup-buku"
            label="Tutup Buku"
            icon="i-lucide-lock"
            color="green"
            variant="outline"
            block
          />
          <UButton
            to="/admin/rumah"
            label="Data Rumah"
            icon="i-lucide-home"
            color="green"
            variant="outline"
            block
          />
        </div>
      </div>

      <!-- Kas Summary -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <UIcon name="i-lucide-trending-up" class="text-green-500" />
          Ringkasan Kas Bulan Ini
        </h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-arrow-down-left" class="text-green-600" />
              <span class="text-sm font-medium">Kas Masuk</span>
            </div>
            <span class="font-bold text-green-600">{{ formatRupiah(kasSummary.total_masuk) }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-arrow-up-right" class="text-red-600" />
              <span class="text-sm font-medium">Kas Keluar</span>
            </div>
            <span class="font-bold text-red-600">{{ formatRupiah(kasSummary.total_keluar) }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-wallet" class="text-blue-600" />
              <span class="font-medium">Saldo Kas</span>
            </div>
            <span class="font-bold text-blue-600 text-lg">{{ formatRupiah(kasSummary.saldo) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Payments -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mt-6">
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <UIcon name="i-lucide-clock" class="text-blue-500" />
        Pembayaran Terbaru
      </h2>
      <div v-if="recentPayments.length > 0" class="space-y-3">
        <div
          v-for="payment in recentPayments"
          :key="payment.id"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <UIcon name="i-lucide-check" class="text-green-600" />
            </div>
            <div>
              <p class="font-medium">{{ payment.blok }}-{{ payment.nomor }}</p>
              <p class="text-sm text-gray-500">{{ payment.periode }} • {{ payment.metode }}</p>
            </div>
          </div>
          <span class="font-bold text-green-600">{{ formatRupiah(payment.jumlah) }}</span>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 py-8">
        Belum ada pembayaran
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const { tenantId } = useTenant()
const { formatRupiah } = useBilling()

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const currentPeriode = computed(() => {
  const now = new Date()
  return `${months[now.getMonth()]} ${now.getFullYear()}`
})

const stats = ref({
  totalRumah: 0,
  rumahAktif: 0,
  sudahBayar: 0,
  belumBayar: 0,
  totalTagihan: 0,
  totalTerkumpul: 0
})

const kasSummary = ref({
  total_masuk: 0,
  total_keluar: 0,
  saldo: 0
})

const recentPayments = ref([])

const persenBayar = computed(() => {
  const total = stats.value.sudahBayar + stats.value.belumBayar
  if (total === 0) return 0
  return Math.round((stats.value.sudahBayar / total) * 100)
})

async function fetchDashboardData() {
  try {
    // Fetch rumah count
    const rumah = await $fetch(`/api/rumah?tenant_id=${tenantId}`)
    stats.value.totalRumah = rumah.length
    stats.value.rumahAktif = rumah.filter(r => r.status === 'aktif').length

    // Fetch current period tagihan
    const periodes = await $fetch(`/api/tutup-buku?tenant_id=${tenantId}`)
    const currentPeriod = periodes.find(p => p.status === 'published' || p.status === 'draft')
    
    if (currentPeriod) {
      const tagihanData = await $fetch(`/api/tagihan?tenant_id=${tenantId}&periode=${currentPeriod.periode}`)
      if (tagihanData.summary) {
        stats.value.sudahBayar = tagihanData.summary.lunas || 0
        stats.value.belumBayar = tagihanData.summary.belum_lunas || 0
        stats.value.totalTagihan = tagihanData.summary.total_tagihan || 0
        stats.value.totalTerkumpul = tagihanData.summary.total_bayar || 0
      }
    }

    // Fetch kas summary
    const bulan = new Date().toISOString().slice(0, 7)
    try {
      const kasData = await $fetch(`/api/kas?tenant_id=${tenantId}&bulan=${bulan}`)
      kasSummary.value = kasData.summary || { total_masuk: 0, total_keluar: 0, saldo: 0 }
    } catch {
      kasSummary.value = { total_masuk: 0, total_keluar: 0, saldo: 0 }
    }

    // Fetch recent payments
    try {
      const payments = await $fetch(`/api/pembayaran?tenant_id=${tenantId}`)
      recentPayments.value = (payments || []).slice(0, 5).map(p => ({
        id: p.id,
        blok: p.rumah?.blok || '-',
        nomor: p.rumah?.nomor || '-',
        periode: p.periode,
        jumlah: p.jumlah,
        metode: p.metode
      }))
    } catch {
      recentPayments.value = []
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
