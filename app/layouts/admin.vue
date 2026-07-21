<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform -translate-x-full lg:translate-x-0">
      <div class="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-xl font-bold text-green-600">{{ tenantNama }}</h1>
      </div>
      
      <nav class="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
        <UButton
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :icon="item.icon"
          :label="item.label"
          variant="ghost"
          class="w-full justify-start"
        />
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <UButton
          icon="i-lucide-log-out"
          label="Logout"
          variant="ghost"
          color="red"
          class="w-full justify-start"
          @click="handleLogout"
        />
      </div>
    </aside>

    <!-- Main content -->
    <div class="lg:ml-64">
      <!-- Header -->
      <header class="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">
        <UButton
          icon="i-lucide-menu"
          variant="ghost"
          class="lg:hidden"
          @click="toggleSidebar"
        />
        
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500">Periode: {{ currentPeriode }}</span>
          <UButton
            icon="i-lucide-bell"
            variant="ghost"
          />
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <UIcon name="i-lucide-user" class="text-green-600" />
            </div>
            <span class="text-sm font-medium">Admin</span>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const { tenantNama } = useTenant()

const currentPeriode = computed(() => {
  const now = new Date()
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return `${months[now.getMonth()]} ${now.getFullYear()}`
})

const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: 'i-lucide-layout-dashboard' },
  { to: '/admin/kategori', label: 'Kategori Iuran', icon: 'i-lucide-tag' },
  { to: '/admin/rumah', label: 'Data Rumah', icon: 'i-lucide-home' },
  { to: '/admin/meteran', label: 'Input Meteran', icon: 'i-lucide-gauge' },
  { to: '/admin/pembayaran', label: 'Pembayaran', icon: 'i-lucide-credit-card' },
  { to: '/admin/kas', label: 'Kas Masuk/Keluar', icon: 'i-lucide-wallet' },
  { to: '/admin/saldo-lebih', label: 'Saldo Lebih', icon: 'i-lucide-trending-up' },
  { to: '/admin/tutup-buku', label: 'Tutup Buku', icon: 'i-lucide-lock' },
  { to: '/admin/users', label: 'User Management', icon: 'i-lucide-users' },
  { to: '/admin/audit-log', label: 'Audit Log', icon: 'i-lucide-file-text' },
  { to: '/admin/laporan', label: 'Laporan', icon: 'i-lucide-bar-chart-3' },
  { to: '/admin/settings', label: 'Pengaturan', icon: 'i-lucide-settings' }
]

function toggleSidebar() {
  // TODO: implement mobile sidebar toggle
}

async function handleLogout() {
  const { logout } = useAuth()
  await logout()
}
</script>
