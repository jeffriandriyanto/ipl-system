<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Pengaturan</h1>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="activeTab === tab.id 
          ? 'bg-primary-600 text-white' 
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab: Umum -->
    <div v-if="activeTab === 'umum'" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Informasi Perumahan</h2>
      
      <form @submit.prevent="saveSettings" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Nama Aplikasi</label>
          <input
            v-model="form.nama_aplikasi"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Nama Perumahan</label>
          <input
            v-model="form.nama_perumahan"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Alamat</label>
          <textarea
            v-model="form.alamat"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Kontak</label>
          <input
            v-model="form.kontak"
            type="text"
            placeholder="0812xxxx"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div class="pt-4">
          <UButton
            type="submit"
            label="Simpan"
            :loading="saving"
          />
        </div>
      </form>
    </div>

    <!-- Tab: White-Label -->
    <div v-if="activeTab === 'whitelabel'" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">White-Label Configuration</h2>
      
      <form @submit.prevent="saveWhiteLabel" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Logo URL</label>
          <input
            v-model="whiteLabel.logo"
            type="url"
            placeholder="https://example.com/logo.png"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p class="text-xs text-gray-500 mt-1">URL gambar logo perumahan</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Warna Primer</label>
            <div class="flex gap-2">
              <input
                v-model="whiteLabel.primary_color"
                type="color"
                class="w-10 h-10 border rounded cursor-pointer"
              />
              <input
                v-model="whiteLabel.primary_color"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Warna Sekunder</label>
            <div class="flex gap-2">
              <input
                v-model="whiteLabel.secondary_color"
                type="color"
                class="w-10 h-10 border rounded cursor-pointer"
              />
              <input
                v-model="whiteLabel.secondary_color"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Footer Text</label>
          <input
            v-model="whiteLabel.footer_text"
            type="text"
            placeholder="© 2026 Perumahan xxx"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Domain</label>
          <input
            :value="whiteLabel.domain"
            type="text"
            disabled
            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
          />
          <p class="text-xs text-gray-500 mt-1">Domain tidak bisa diubah</p>
        </div>

        <div class="pt-4">
          <UButton
            type="submit"
            label="Simpan"
            :loading="savingWhiteLabel"
          />
        </div>
      </form>
    </div>

    <!-- Tab: Info Sistem -->
    <div v-if="activeTab === 'info'" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Informasi Sistem</h2>
      
      <div class="space-y-3">
        <div class="flex justify-between py-2 border-b">
          <span class="text-gray-500">Tenant ID</span>
          <span class="font-mono">waris1</span>
        </div>
        <div class="flex justify-between py-2 border-b">
          <span class="text-gray-500">Domain</span>
          <span class="font-mono">ipl-system.netlify.app</span>
        </div>
        <div class="flex justify-between py-2 border-b">
          <span class="text-gray-500">Database</span>
          <span>Supabase PostgreSQL</span>
        </div>
        <div class="flex justify-between py-2 border-b">
          <span class="text-gray-500">Framework</span>
          <span>Nuxt 4 + Nuxt UI</span>
        </div>
        <div class="flex justify-between py-2 border-b">
          <span class="text-gray-500">Versi</span>
          <span>1.0.0</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const tenantId = 'waris1'
const activeTab = ref('umum')
const saving = ref(false)
const savingWhiteLabel = ref(false)

const tabs = [
  { id: 'umum', label: 'Umum' },
  { id: 'whitelabel', label: 'White-Label' },
  { id: 'info', label: 'Info Sistem' }
]

const form = reactive({
  nama_aplikasi: 'IPL Perumahan Waris 1',
  nama_perumahan: 'Perumahan Waris 1',
  alamat: '',
  kontak: ''
})

const whiteLabel = reactive({
  logo: '',
  primary_color: '#2563EB',
  secondary_color: '#1E40AF',
  footer_text: '© 2026 IPL Perumahan Waris 1',
  domain: 'ipl-system.netlify.app'
})

async function fetchSettings() {
  try {
    // TODO: fetch from API
    // For now, use default values
  } catch (error) {
    console.error('Error fetching settings:', error)
  }
}

async function saveSettings() {
  saving.value = true
  try {
    // TODO: save to API
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Pengaturan berhasil disimpan')
  } catch (error) {
    alert('Gagal menyimpan pengaturan')
  } finally {
    saving.value = false
  }
}

async function saveWhiteLabel() {
  savingWhiteLabel.value = true
  try {
    // TODO: save to API
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Konfigurasi white-label berhasil disimpan')
  } catch (error) {
    alert('Gagal menyimpan konfigurasi')
  } finally {
    savingWhiteLabel.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>
