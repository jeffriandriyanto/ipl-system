<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform -translate-x-full lg:translate-x-0">
      <div class="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-xl font-bold text-green-600">{{ tenantNama }}</h1>
      </div>
      
      <nav class="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
        <template v-for="item in menuItems" :key="item.label">
          <!-- Single link -->
          <UButton
            v-if="!item.children"
            :to="item.to"
            :icon="item.icon"
            :label="item.label"
            variant="ghost"
            class="w-full justify-start"
          />

          <!-- Collapsible group -->
          <div v-else>
            <button
              class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              @click="toggleGroup(item.label)"
            >
              <span class="flex items-center gap-2">
                <UIcon :name="item.icon" class="w-4 h-4" />
                {{ item.label }}
              </span>
              <UIcon
                name="i-lucide-chevron-down"
                class="w-4 h-4 transition-transform"
                :class="{ '-rotate-90': !openGroups[item.label] }"
              />
            </button>
            <div
              v-show="openGroups[item.label]"
              class="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2"
            >
              <UButton
                v-for="child in item.children"
                :key="child.to"
                :to="child.to"
                :icon="child.icon"
                :label="child.label"
                variant="ghost"
                size="sm"
                class="w-full justify-start"
              />
            </div>
          </div>
        </template>
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

const openGroups = reactive({
  'Master Data': true,
  'Transaksi': true
})

function toggleGroup(label) {
  openGroups[label] = !openGroups[label]
}

const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: 'i-lucide-layout-dashboard' },
  {
    label: 'Master Data',
    icon: 'i-lucide-database',
    children: [
      { to: '/admin/kategori', label: 'Kategori Iuran', icon: 'i-lucide-tag' },
      { to: '/admin/rumah', label: 'Data Rumah', icon: 'i-lucide-home' },
      { to: '/admin/users', label: 'User Management', icon: 'i-lucide-users' }
    ]
  },
  {
    label: 'Transaksi',
    icon: 'i-lucide-arrow-left-right',
    children: [
      { to: '/admin/meteran', label: 'Input Meteran', icon: 'i-lucide-gauge' },
      { to: '/admin/pembayaran', label: 'Pembayaran', icon: 'i-lucide-credit-card' },
      { to: '/admin/kas', label: 'Kas Masuk/Keluar', icon: 'i-lucide-wallet' },
      { to: '/admin/saldo-lebih', label: 'Saldo Lebih', icon: 'i-lucide-trending-up' }
    ]
  },
  { to: '/admin/tutup-buku', label: 'Tutup Buku', icon: 'i-lucide-lock' },
  { to: '/admin/laporan', label: 'Laporan', icon: 'i-lucide-bar-chart-3' },
  { to: '/admin/audit-log', label: 'Audit Log', icon: 'i-lucide-file-text' },
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
