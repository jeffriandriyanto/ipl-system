<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Input Pembayaran</h1>
      <div class="flex gap-2">
        <DownloadTemplate type="pembayaran" />
        <UButton
          label="Upload Excel"
          icon="i-lucide-upload"
          variant="outline"
          @click="showUpload = true"
        />
      </div>
    </div>

    <!-- Input Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Input Pembayaran Baru</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium mb-1 block">Rumah</label>
          <select
            v-model="form.rumah_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Pilih Rumah</option>
            <option v-for="r in rumahList" :key="r.id" :value="r.id">
              {{ r.blok }}-{{ r.nomor }} ({{ r.pic_nama || '-' }})
            </option>
          </select>
        </div>

        <div>
          <label class="text-sm font-medium mb-1 block">Periode</label>
          <select
            v-model="form.periode"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Pilih Periode</option>
            <option v-for="p in periodeList" :key="p.periode" :value="p.periode">
              {{ p.periode }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-sm font-medium mb-1 block">Jumlah Bayar (Rp)</label>
          <input
            v-model.number="form.jumlah"
            type="number"
            placeholder="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="text-sm font-medium mb-1 block">Tanggal Bayar</label>
          <input
            v-model="form.tanggal"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="text-sm font-medium mb-1 block">Metode</label>
          <select
            v-model="form.metode"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="transfer">Transfer</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        <div>
          <label class="text-sm font-medium mb-1 block">Keterangan</label>
          <input
            v-model="form.keterangan"
            type="text"
            placeholder="Opsional"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <!-- Tagihan Info -->
      <div v-if="selectedTagihan" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-500">Total Tagihan</p>
            <p class="text-lg font-bold">{{ formatRupiah(selectedTagihan.total_tagihan) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Sudah Bayar</p>
            <p class="text-lg font-bold">{{ formatRupiah(selectedTagihan.total_bayar) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Sisa Tagihan</p>
            <p class="text-lg font-bold text-red-600">{{ formatRupiah(Math.max(0, selectedTagihan.total_tagihan - selectedTagihan.total_bayar)) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Status</p>
            <span
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="getStatusColor(selectedTagihan.status)"
            >
              {{ getStatusText(selectedTagihan.status) }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-end">
        <UButton
          label="Simpan Pembayaran"
          icon="i-lucide-check"
          :loading="saving"
          :disabled="!form.rumah_id || !form.periode || !form.jumlah"
          @click="simpanPembayaran"
        />
      </div>
    </div>

    <!-- Recent Payments -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold">Riwayat Pembayaran</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <th class="text-left p-3 font-semibold text-sm">Tanggal</th>
              <th class="text-left p-3 font-semibold text-sm">Rumah</th>
              <th class="text-left p-3 font-semibold text-sm">Periode</th>
              <th class="text-right p-3 font-semibold text-sm">Jumlah</th>
              <th class="text-left p-3 font-semibold text-sm">Metode</th>
              <th class="text-left p-3 font-semibold text-sm">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in pembayaranList"
              :key="item.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="p-3 text-sm">{{ formatDate(item.tanggal) }}</td>
              <td class="p-3 font-medium">{{ item.rumah?.blok }}-{{ item.rumah?.nomor }}</td>
              <td class="p-3 text-sm">{{ item.periode }}</td>
              <td class="p-3 text-sm text-right font-medium">{{ formatRupiah(item.jumlah) }}</td>
              <td class="p-3">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="item.metode === 'transfer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
                >
                  {{ item.metode }}
                </span>
              </td>
              <td class="p-3 text-sm text-gray-500">{{ item.keterangan || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pembayaranList.length === 0" class="p-8 text-center text-gray-500">
        Belum ada pembayaran
      </div>
    </div>

    <!-- Upload Modal -->
    <UModal v-model="showUpload">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Upload Excel Pembayaran</h2>
        <UploadExcel v-model="uploadFile" />
        <div class="flex justify-end gap-2 mt-4">
          <UButton label="Batal" variant="ghost" @click="showUpload = false" />
          <UButton label="Upload" :loading="uploading" @click="handleUpload" />
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const tenantId = 'waris1'

const rumahList = ref([])
const periodeList = ref([])
const pembayaranList = ref([])
const selectedTagihan = ref(null)
const saving = ref(false)
const showUpload = ref(false)
const uploadFile = ref(null)
const uploading = ref(false)

const form = reactive({
  rumah_id: '',
  periode: '',
  jumlah: 0,
  tanggal: new Date().toISOString().slice(0, 10),
  metode: 'transfer',
  keterangan: ''
})

const { formatRupiah, getStatusColor, getStatusText } = useBilling()

function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

async function fetchRumah() {
  try {
    const data = await $fetch(`/api/rumah?tenant_id=${tenantId}&status=aktif`)
    rumahList.value = data
  } catch (error) {
    console.error('Error fetching rumah:', error)
  }
}

async function fetchPeriode() {
  try {
    // TODO: fetch from API
    periodeList.value = [
      { periode: '2026-07' },
      { periode: '2026-08' }
    ]
  } catch (error) {
    console.error('Error fetching periode:', error)
  }
}

async function fetchPembayaran() {
  try {
    const data = await $fetch(`/api/pembayaran?tenant_id=${tenantId}`)
    pembayaranList.value = data
  } catch (error) {
    console.error('Error fetching pembayaran:', error)
  }
}

async function fetchTagihanInfo() {
  if (!form.rumah_id || !form.periode) {
    selectedTagihan.value = null
    return
  }

  try {
    const data = await $fetch(`/api/tagihan?tenant_id=${tenantId}&periode=${form.periode}`)
    const tagihan = data.data?.find(t => t.rumah_id === form.rumah_id)
    selectedTagihan.value = tagihan || null
    
    if (tagihan) {
      const sisa = Math.max(0, tagihan.total_tagihan - tagihan.total_bayar)
      form.jumlah = sisa
    }
  } catch (error) {
    console.error('Error fetching tagihan info:', error)
  }
}

async function simpanPembayaran() {
  saving.value = true
  try {
    await $fetch('/api/pembayaran', {
      method: 'POST',
      body: {
        tenant_id: tenantId,
        rumah_id: form.rumah_id,
        periode: form.periode,
        jumlah: form.jumlah,
        tanggal: form.tanggal,
        metode: form.metode,
        keterangan: form.keterangan
      }
    })

    alert('Pembayaran berhasil disimpan')
    form.rumah_id = ''
    form.periode = ''
    form.jumlah = 0
    form.keterangan = ''
    selectedTagihan.value = null
    
    await fetchPembayaran()
  } catch (error) {
    alert(error.data?.message || 'Gagal menyimpan pembayaran')
  } finally {
    saving.value = false
  }
}

function handleUpload() {
  // TODO: implement Excel upload
  alert('Fitur upload Excel belum diimplementasikan')
}

// Watch for changes
watch(() => [form.rumah_id, form.periode], () => {
  fetchTagihanInfo()
})

onMounted(() => {
  fetchRumah()
  fetchPeriode()
  fetchPembayaran()
})
</script>
