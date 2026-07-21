<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Audit Log</h1>
    </div>

    <!-- Filter -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="text-sm font-medium mb-1 block">Koleksi</label>
          <select
            v-model="filterKoleksi"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Semua</option>
            <option value="rumah">Rumah</option>
            <option value="tagihan">Tagihan</option>
            <option value="pembayaran">Pembayaran</option>
            <option value="kategori_iuran">Kategori Iuran</option>
            <option value="user">User</option>
            <option value="kas_transaksi">Kas</option>
          </select>
        </div>
        <div class="flex items-end">
          <UButton
            label="Filter"
            icon="i-lucide-filter"
            @click="fetchLogs"
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
              <th class="text-left p-4 font-semibold">Waktu</th>
              <th class="text-left p-4 font-semibold">User</th>
              <th class="text-left p-4 font-semibold">Aksi</th>
              <th class="text-left p-4 font-semibold">Koleksi</th>
              <th class="text-left p-4 font-semibold">Dokumen</th>
              <th class="text-left p-4 font-semibold">Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in logs"
              :key="item.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="p-4 text-sm">{{ formatDateTime(item.timestamp) }}</td>
              <td class="p-4 text-sm">{{ item.user_nama }}</td>
              <td class="p-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': item.aksi === 'create',
                    'bg-blue-100 text-blue-800': item.aksi === 'update',
                    'bg-red-100 text-red-800': item.aksi === 'delete'
                  }"
                >
                  {{ item.aksi }}
                </span>
              </td>
              <td class="p-4 text-sm capitalize">{{ item.koleksi }}</td>
              <td class="p-4 text-sm font-mono">{{ item.dokumen_id }}</td>
              <td class="p-4">
                <button
                  v-if="item.perubahan"
                  class="text-primary-600 hover:underline text-sm"
                  @click="showDetail(item)"
                >
                  Lihat
                </button>
                <span v-else class="text-gray-400 text-sm">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="logs.length === 0" class="p-8 text-center text-gray-500">
        Belum ada audit log
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="flex justify-center gap-2 mt-6">
      <UButton
        label="Sebelumnya"
        :disabled="pagination.page <= 1"
        @click="changePage(pagination.page - 1)"
      />
      <span class="px-4 py-2 text-sm">
        Halaman {{ pagination.page }} dari {{ pagination.totalPages }}
      </span>
      <UButton
        label="Selanjutnya"
        :disabled="pagination.page >= pagination.totalPages"
        @click="changePage(pagination.page + 1)"
      />
    </div>

    <!-- Detail Modal -->
    <UModal v-model:open="showDetailModal" title="Detail Perubahan">
      <template #body>
        <div v-if="selectedLog" class="space-y-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Sebelum</p>
            <pre class="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm overflow-auto">{{ JSON.stringify(selectedLog.perubahan?.before, null, 2) }}</pre>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Sesudah</p>
            <pre class="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm overflow-auto">{{ JSON.stringify(selectedLog.perubahan?.after, null, 2) }}</pre>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const { tenantId } = useTenant()

const logs = ref([])
const pagination = ref({ page: 1, limit: 50, total: 0, totalPages: 0 })
const filterKoleksi = ref('')
const showDetailModal = ref(false)
const selectedLog = ref(null)

function formatDateTime(date) {
  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function fetchLogs() {
  try {
    let url = `/api/audit-log?tenant_id=${tenantId}&page=${pagination.value.page}&limit=${pagination.value.limit}`
    if (filterKoleksi.value) url += `&koleksi=${filterKoleksi.value}`

    const data = await $fetch(url)
    logs.value = data.data || []
    pagination.value = data.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 }
  } catch (error) {
    console.error('Error fetching audit logs:', error)
  }
}

function changePage(page) {
  pagination.value.page = page
  fetchLogs()
}

function showDetail(item) {
  selectedLog.value = item
  showDetailModal.value = true
}

onMounted(() => {
  fetchLogs()
})
</script>
