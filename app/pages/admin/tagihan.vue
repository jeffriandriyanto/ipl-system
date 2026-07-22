<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Data Tagihan</h1>
      <div class="flex gap-2">
        <UButton
          label="Export Excel"
          icon="i-lucide-download"
          variant="outline"
          @click="exportExcel"
        />
      </div>
    </div>

    <!-- Period Selector & Summary -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-end">
        <div>
          <label class="text-sm font-medium mb-1 block">Periode</label>
          <input
            v-model="selectedPeriode"
            type="month"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">Status</label>
          <select
            v-model="filterStatus"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Semua</option>
            <option value="belum_bayar">Belum Bayar</option>
            <option value="lunas">Lunas</option>
            <option value="kurang">Kurang</option>
            <option value="lebih">Lebih</option>
          </select>
        </div>
        <UButton
          label="Load Data"
          icon="i-lucide-refresh-cw"
          :loading="loading"
          @click="fetchTagihan"
        />
      </div>

      <!-- Summary Cards -->
      <div v-if="summary" class="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <p class="text-sm text-gray-500">Total Rumah</p>
          <p class="text-2xl font-bold">{{ summary.total_rumah }}</p>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
          <p class="text-sm text-gray-500">Sudah Bayar</p>
          <p class="text-2xl font-bold text-green-600">{{ summary.lunas }}</p>
        </div>
        <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
          <p class="text-sm text-gray-500">Belum Bayar</p>
          <p class="text-2xl font-bold text-red-600">{{ summary.belum_lunas }}</p>
        </div>
        <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
          <p class="text-sm text-gray-500">Exempt</p>
          <p class="text-2xl font-bold text-yellow-600">{{ summary.exempt || 0 }}</p>
        </div>
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
          <p class="text-sm text-gray-500">Total Tagihan</p>
          <p class="text-xl font-bold">{{ formatRupiah(summary.total_tagihan) }}</p>
        </div>
      </div>
    </div>

    <!-- Tagihan Table -->
    <div v-if="tagihanData.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <th class="text-left p-3 font-semibold text-sm">No</th>
              <th class="text-left p-3 font-semibold text-sm">Blok-No</th>
              <th class="text-left p-3 font-semibold text-sm">Status</th>
              <th class="text-center p-3 font-semibold text-sm">Exempt</th>
              <th class="text-left p-3 font-semibold text-sm">Jenis Iuran</th>
              <th class="text-left p-3 font-semibold text-sm">Meter Lalu</th>
              <th class="text-left p-3 font-semibold text-sm">Meter Skrg</th>
              <th class="text-left p-3 font-semibold text-sm">Pakai</th>
              <th class="text-right p-3 font-semibold text-sm">Tagihan</th>
              <th class="text-right p-3 font-semibold text-sm">Bayar</th>
              <th class="text-right p-3 font-semibold text-sm">Selisih</th>
              <th class="text-center p-3 font-semibold text-sm">Status Bayar</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in tagihanData" :key="item.id">
              <tr
                v-for="(detail, idx) in item.items"
                :key="`${item.id}-${idx}`"
                class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td v-if="idx === 0" :rowspan="item.items.length" class="p-3 text-sm">
                  {{ index + 1 }}
                </td>
                <td v-if="idx === 0" :rowspan="item.items.length" class="p-3 font-medium">
                  {{ item.blok }}-{{ item.nomor_rumah }}
                </td>
                <td v-if="idx === 0" :rowspan="item.items.length" class="p-3">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="item.status_penghuni === 'ada' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ item.status_penghuni === 'ada' ? 'Dihuni' : 'Kosong' }}
                  </span>
                </td>
                <td v-if="idx === 0" :rowspan="item.items.length" class="p-3 text-center">
                  <input
                    type="checkbox"
                    :checked="item.is_exempt"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    @change="toggleExempt(item)"
                  />
                </td>
                <td class="p-3 text-sm">{{ detail.kategori_nama }}</td>
                <td class="p-3 text-sm">{{ detail.meter_lalu || '-' }}</td>
                <td class="p-3 text-sm">{{ detail.meter_sekarang || '-' }}</td>
                <td class="p-3 text-sm">{{ detail.pemakaian || '-' }}{{ detail.tipe === 'meteran' ? ' m³' : '' }}</td>
                <td class="p-3 text-sm text-right">{{ formatRupiah(detail.jumlah_tagihan) }}</td>
                <td v-if="idx === 0" :rowspan="item.items.length" class="p-3 text-sm text-right font-medium">
                  {{ formatRupiah(item.total_bayar) }}
                </td>
                <td v-if="idx === 0" :rowspan="item.items.length" class="p-3 text-sm text-right">
                  <span :class="item.selisih >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ item.selisih >= 0 ? '+' : '' }}{{ formatRupiah(item.selisih) }}
                  </span>
                </td>
                <td v-if="idx === 0" :rowspan="item.items.length" class="p-3 text-center">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="getStatusColor(item.status)"
                  >
                    {{ getStatusText(item.status) }}
                  </span>
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr class="bg-gray-50 dark:bg-gray-700 font-bold">
              <td colspan="7" class="p-3 text-right">TOTAL</td>
              <td class="p-3 text-right">{{ formatRupiah(totalTagihan) }}</td>
              <td class="p-3 text-right">{{ formatRupiah(totalBayar) }}</td>
              <td class="p-3 text-right">
                <span :class="totalSelisih >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ formatRupiah(totalSelisih) }}
                </span>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div v-else-if="!loading" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500">
      Pilih periode dan klik "Load Data" untuk menampilkan tagihan
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const { tenantId } = useTenant()

const selectedPeriode = ref(new Date().toISOString().slice(0, 7))
const filterStatus = ref('')
const tagihanData = ref([])
const summary = ref(null)
const loading = ref(false)

const { formatRupiah, getStatusColor, getStatusText } = useBilling()

const totalTagihan = computed(() => {
  return tagihanData.value.reduce((sum, t) => sum + t.total_tagihan, 0)
})

const totalBayar = computed(() => {
  return tagihanData.value.reduce((sum, t) => sum + t.total_bayar, 0)
})

const totalSelisih = computed(() => {
  return tagihanData.value.reduce((sum, t) => sum + t.selisih, 0)
})

async function fetchTagihan() {
  loading.value = true
  try {
    let url = `/api/tagihan?tenant_id=${tenantId}&periode=${selectedPeriode.value}`
    if (filterStatus.value) url += `&status=${filterStatus.value}`
    
    const data = await $fetch(url)
    tagihanData.value = data.data || []
    summary.value = data.summary
  } catch (error) {
    console.error('Error fetching tagihan:', error)
    alert('Gagal mengambil data tagihan')
  } finally {
    loading.value = false
  }
}

function exportExcel() {
  // TODO: implement export Excel
  alert('Fitur export Excel belum diimplementasikan')
}

async function toggleExempt(item) {
  try {
    await $fetch(`/api/tagihan/${item.id}`, {
      method: 'PUT',
      body: { is_exempt: !item.is_exempt }
    })
    item.is_exempt = !item.is_exempt
  } catch (error) {
    alert('Gagal mengupdate status exempt')
  }
}

onMounted(() => {
  fetchTagihan()
})
</script>
