<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Kas Masuk/Keluar</h1>
      <UButton
        label="Tambah Transaksi"
        icon="i-lucide-plus"
        @click="openForm()"
      />
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <p class="text-sm text-gray-500">Kas Masuk</p>
        <p class="text-2xl font-bold text-green-600">{{ formatRupiah(summary.total_masuk) }}</p>
      </div>
      <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
        <p class="text-sm text-gray-500">Kas Keluar</p>
        <p class="text-2xl font-bold text-red-600">{{ formatRupiah(summary.total_keluar) }}</p>
      </div>
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <p class="text-sm text-gray-500">Saldo</p>
        <p class="text-2xl font-bold" :class="summary.saldo >= 0 ? 'text-blue-600' : 'text-red-600'">
          {{ formatRupiah(summary.saldo) }}
        </p>
      </div>
    </div>

    <!-- Filter -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="text-sm font-medium mb-1 block">Tipe</label>
          <select
            v-model="filterTipe"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Semua</option>
            <option value="masuk">Kas Masuk</option>
            <option value="keluar">Kas Keluar</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">Bulan</label>
          <input
            v-model="filterBulan"
            type="month"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div class="flex items-end">
          <UButton
            label="Filter"
            icon="i-lucide-filter"
            @click="fetchKas"
          />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left p-4 font-semibold">Tanggal</th>
              <th class="text-left p-4 font-semibold">Tipe</th>
              <th class="text-left p-4 font-semibold">Kategori</th>
              <th class="text-left p-4 font-semibold">Keterangan</th>
              <th class="text-right p-4 font-semibold">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in kasList"
              :key="item.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="p-4 text-sm">{{ formatDate(item.tanggal) }}</td>
              <td class="p-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="item.tipe === 'masuk' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ item.tipe === 'masuk' ? 'Masuk' : 'Keluar' }}
                </span>
              </td>
              <td class="p-4 text-sm capitalize">{{ item.kategori }}</td>
              <td class="p-4 text-sm">{{ item.keterangan || '-' }}</td>
              <td class="p-4 text-right font-medium" :class="item.tipe === 'masuk' ? 'text-green-600' : 'text-red-600'">
                {{ item.tipe === 'masuk' ? '+' : '-' }} {{ formatRupiah(item.jumlah) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="kasList.length === 0" class="p-8 text-center text-gray-500">
        Belum ada transaksi kas
      </div>
    </div>

    <!-- Form Modal -->
    <UModal v-model:open="showForm" title="Tambah Transaksi Kas">
      <template #body>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Tipe</label>
            <select
              v-model="form.tipe"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="masuk">Kas Masuk</option>
              <option value="keluar">Kas Keluar</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Kategori</label>
            <select
              v-model="form.kategori"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="donasi">Donasi</option>
              <option value="operasional">Operasional</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Jumlah (Rp)</label>
            <input
              v-model.number="form.jumlah"
              type="number"
              placeholder="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Tanggal</label>
            <input
              v-model="form.tanggal"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Keterangan</label>
            <textarea
              v-model="form.keterangan"
              placeholder="Keterangan transaksi"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </form>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            label="Batal"
            variant="ghost"
            @click="closeForm"
          />
          <UButton
            label="Simpan"
            :loading="saving"
            @click="handleSubmit"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const tenantId = 'waris1'

const kasList = ref([])
const summary = ref({ total_masuk: 0, total_keluar: 0, saldo: 0 })
const showForm = ref(false)
const saving = ref(false)
const filterTipe = ref('')
const filterBulan = ref(new Date().toISOString().slice(0, 7))

const form = reactive({
  tipe: 'masuk',
  kategori: 'donasi',
  jumlah: 0,
  tanggal: new Date().toISOString().slice(0, 10),
  keterangan: ''
})

const { formatRupiah } = useBilling()

function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

async function fetchKas() {
  try {
    let url = `/api/kas?tenant_id=${tenantId}`
    if (filterTipe.value) url += `&tipe=${filterTipe.value}`
    if (filterBulan.value) url += `&bulan=${filterBulan.value}`

    const data = await $fetch(url)
    kasList.value = data.data || []
    summary.value = data.summary || { total_masuk: 0, total_keluar: 0, saldo: 0 }
  } catch (error) {
    console.error('Error fetching kas:', error)
  }
}

function openForm() {
  form.tipe = 'masuk'
  form.kategori = 'donasi'
  form.jumlah = 0
  form.tanggal = new Date().toISOString().slice(0, 10)
  form.keterangan = ''
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

async function handleSubmit() {
  saving.value = true
  try {
    await $fetch('/api/kas', {
      method: 'POST',
      body: { ...form, tenant_id: tenantId }
    })
    closeForm()
    await fetchKas()
  } catch (error) {
    alert(error.data?.message || 'Gagal menyimpan transaksi')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchKas()
})
</script>
