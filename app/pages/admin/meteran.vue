<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Input Meteran</h1>
      <div class="flex gap-2">
        <DownloadTemplate type="meteran" />
        <UButton
          label="Upload Excel"
          icon="i-lucide-upload"
          variant="outline"
          @click="showUpload = true"
        />
      </div>
    </div>

    <!-- Period Selector -->
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
        <UButton
          label="Load Data"
          icon="i-lucide-refresh-cw"
          :loading="loading"
          @click="fetchMeteran"
        />
      </div>
    </div>

    <!-- Meteran Table -->
    <div v-if="meteranData.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <th class="text-left p-3 font-semibold text-sm">Blok-No</th>
              <th class="text-left p-3 font-semibold text-sm">PIC</th>
              <th class="text-left p-3 font-semibold text-sm">Status</th>
              <th class="text-left p-3 font-semibold text-sm">Kategori</th>
              <th class="text-left p-3 font-semibold text-sm">Meter Lalu</th>
              <th class="text-left p-3 font-semibold text-sm">Meter Skrg</th>
              <th class="text-left p-3 font-semibold text-sm">Pakai</th>
              <th class="text-left p-3 font-semibold text-sm">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in meteranData" :key="item.rumah_id">
              <tr
                v-for="(meter, idx) in item.meteran"
                :key="`${item.rumah_id}-${meter.kategori_id}`"
                class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td v-if="idx === 0" :rowspan="item.meteran.length" class="p-3 font-medium">
                  {{ item.blok }}-{{ item.nomor }}
                </td>
                <td v-if="idx === 0" :rowspan="item.meteran.length" class="p-3 text-sm">
                  {{ item.pic_nama || '-' }}
                </td>
                <td v-if="idx === 0" :rowspan="item.meteran.length" class="p-3">
                  <select
                    v-model="item.status_penghuni"
                    class="text-sm px-2 py-1 border rounded"
                    @change="updateStatus(item)"
                  >
                    <option value="ada">Ada</option>
                    <option value="kosong">Kosong</option>
                  </select>
                </td>
                <td class="p-3 text-sm">{{ meter.kategori_nama }}</td>
                <td class="p-3 text-sm">{{ meter.meter_lalu }}</td>
                <td class="p-3">
                  <input
                    v-model.number="meter.meter_sekarang"
                    type="number"
                    :min="meter.meter_lalu"
                    class="w-24 px-2 py-1 border rounded text-sm"
                    :disabled="item.status_penghuni === 'kosong'"
                  />
                </td>
                <td class="p-3 text-sm font-medium">
                  {{ hitungPakai(meter) }}
                </td>
                <td v-if="idx === 0" :rowspan="item.meteran.length" class="p-3">
                  <UButton
                    label="Simpan"
                    size="sm"
                    :loading="saving === item.rumah_id"
                    @click="simpanMeteran(item)"
                  />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="!loading" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500">
      Pilih periode dan klik "Load Data" untuk menampilkan data meteran
    </div>

    <!-- Upload Modal -->
    <UModal v-model="showUpload">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Upload Excel Meteran</h2>
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

const selectedPeriode = ref(new Date().toISOString().slice(0, 7))
const meteranData = ref([])
const loading = ref(false)
const saving = ref(null)
const showUpload = ref(false)
const uploadFile = ref(null)
const uploading = ref(false)

const { formatRupiah } = useBilling()

function hitungPakai(meter) {
  if (!meter.meter_sekarang || !meter.meter_lalu) return 0
  return Math.max(0, meter.meter_sekarang - meter.meter_lalu)
}

async function fetchMeteran() {
  loading.value = true
  try {
    const data = await $fetch(`/api/meteran?tenant_id=${tenantId}&periode=${selectedPeriode.value}`)
    meteranData.value = data.data || []
  } catch (error) {
    console.error('Error fetching meteran:', error)
    alert('Gagal mengambil data meteran')
  } finally {
    loading.value = false
  }
}

function updateStatus(item) {
  // Update status locally
}

async function simpanMeteran(item) {
  saving.value = item.rumah_id
  try {
    const items = item.meteran.map(m => ({
      kategori_id: m.kategori_id,
      meter_lalu: m.meter_lalu,
      meter_sekarang: m.meter_sekarang || 0
    }))

    await $fetch('/api/meteran', {
      method: 'POST',
      body: {
        tenant_id: tenantId,
        periode: selectedPeriode.value,
        rumah_id: item.rumah_id,
        status_penghuni: item.status_penghuni,
        items
      }
    })

    alert('Meteran berhasil disimpan')
  } catch (error) {
    alert(error.data?.message || 'Gagal menyimpan meteran')
  } finally {
    saving.value = null
  }
}

async function handleUpload() {
  // TODO: implement Excel upload
  alert('Fitur upload Excel belum diimplementasikan')
}

onMounted(() => {
  fetchMeteran()
})
</script>
