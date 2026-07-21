<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform -translate-x-full lg:translate-x-0">
      <div class="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-xl font-bold text-primary-600">{{ appName }}</h1>
      </div>
      
      <nav class="p-4 space-y-1">
        <UButton
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :icon="item.icon"
          :label="item.label"
          variant="ghost"
          class="w-full justify-start"
          :class="{ 'bg-primary-50 dark:bg-primary-900/20': isActive(item.to) }"
        />
      </nav>
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
          <UButton
            icon="i-lucide-bell"
            variant="ghost"
          />
          <UDropdown :items="userMenu">
            <UButton
              icon="i-lucide-user"
              :label="userName"
              variant="ghost"
              trailing-icon="i-lucide-chevron-down"
            />
          </UDropdown>
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
const route = useRoute()
const appName = 'IPL System'
const userName = 'Admin'

const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: 'i-lucide-layout-dashboard' },
  { to: '/admin/kategori', label: 'Kategori Iuran', icon: 'i-lucide-tag' },
  { to: '/admin/rumah', label: 'Data Rumah', icon: 'i-lucide-home' },
  { to: '/admin/meteran', label: 'Input Meteran', icon: 'i-lucide-gauge' },
  { to: '/admin/pembayaran', label: 'Pembayaran', icon: 'i-lucide-credit-card' },
  { to: '/admin/kas', label: 'Kas Masuk/Keluar', icon: 'i-lucide-wallet' },
  { to: '/admin/saldo-lebih', label: 'Saldo Lebih', icon: 'i-lucide-trending-up' },
  { to: '/admin/tutup-buku', label: 'Tutup Buku', icon: 'i-lucide-book-closed' },
  { to: '/admin/users', label: 'User Management', icon: 'i-lucide-users' },
  { to: '/admin/audit-log', label: 'Audit Log', icon: 'i-lucide-file-text' },
  { to: '/admin/laporan', label: 'Laporan', icon: 'i-lucide-bar-chart-3' },
  { to: '/admin/settings', label: 'Pengaturan', icon: 'i-lucide-settings' }
]

const userMenu = [
  [{ label: 'Profil', icon: 'i-lucide-user', to: '/admin/profil' }],
  [{ label: 'Logout', icon: 'i-lucide-log-out', click: () => handleLogout() }]
]

function isActive(to) {
  return route.path === to || route.path.startsWith(to + '/')
}

function toggleSidebar() {
  // Toggle sidebar on mobile
}

function handleLogout() {
  // Handle logout
}
</script>
