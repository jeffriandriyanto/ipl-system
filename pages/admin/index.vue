<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-100 rounded-lg">
            <UIcon name="i-lucide-home" class="text-blue-600 text-xl" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Rumah</p>
            <p class="text-2xl font-bold">{{ stats.totalRumah }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-green-100 rounded-lg">
            <UIcon name="i-lucide-check-circle" class="text-green-600 text-xl" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Sudah Bayar</p>
            <p class="text-2xl font-bold">{{ stats.sudahBayar }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-red-100 rounded-lg">
            <UIcon name="i-lucide-x-circle" class="text-red-600 text-xl" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Belum Bayar</p>
            <p class="text-2xl font-bold">{{ stats.belumBayar }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-purple-100 rounded-lg">
            <UIcon name="i-lucide-wallet" class="text-purple-600 text-xl" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Terkumpul</p>
            <p class="text-2xl font-bold">{{ formatRupiah(stats.totalTerkumpul) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
      <h2 class="text-lg font-semibold mb-4">Aksi Cepat</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <UButton
          to="/admin/meteran"
          label="Input Meteran"
          icon="i-lucide-gauge"
          variant="outline"
          block
        />
        <UButton
          to="/admin/pembayaran"
          label="Input Pembayaran"
          icon="i-lucide-credit-card"
          variant="outline"
          block
        />
        <UButton
          to="/admin/kas"
          label="Kas Masuk/Keluar"
          icon="i-lucide-wallet"
          variant="outline"
          block
        />
        <UButton
          to="/admin/laporan"
          label="Lihat Laporan"
          icon="i-lucide-bar-chart-3"
          variant="outline"
          block
        />
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Aktivitas Terbaru</h2>
      <div class="space-y-3">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <UIcon :name="activity.icon" :class="activity.iconClass" />
          <div class="flex-1">
            <p class="text-sm">{{ activity.message }}</p>
            <p class="text-xs text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const stats = ref({
  totalRumah: 0,
  sudahBayar: 0,
  belumBayar: 0,
  totalTerkumpul: 0
})

const recentActivities = ref([
  {
    id: 1,
    message: 'Budi menginput meteran rumah A-12',
    time: '5 menit lalu',
    icon: 'i-lucide-gauge',
    iconClass: 'text-blue-600'
  },
  {
    id: 2,
    message: 'Pembayaran Rp 65.000 dari A-12',
    time: '10 menit lalu',
    icon: 'i-lucide-credit-card',
    iconClass: 'text-green-600'
  },
  {
    id: 3,
    message: 'Andi menambah data rumah B-5',
    time: '1 jam lalu',
    icon: 'i-lucide-home',
    iconClass: 'text-purple-600'
  }
])

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

// Fetch dashboard stats
onMounted(async () => {
  try {
    const response = await $fetch('/api/dashboard/stats')
    if (response) {
      stats.value = response
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
  }
})
</script>
