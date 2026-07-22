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

    <!-- Input Mode Toggle -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div class="flex gap-2 mb-4">
        <button
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="inputMode === 'single' 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
          @click="inputMode = 'single'"
        >
          Single Periode
        </button>
        <button
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="inputMode === 'multi' 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
          @click="inputMode = 'multi'"
        >
          Multi Periode
        </button>
      </div>

      <!-- Single Periode Form -->
      <form v-if="inputMode === 'single'" @submit.prevent="simpanSingle" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium mb-1 block">Rumah</label>
            <select
              v-model="form.rumah_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
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
              required
            >
              <option value="">Pilih Periode</option>
              <option v-for="p in availablePeriodes" :key="p.periode" :value="p.periode">
                {{ formatPeriode(p.periode) }}
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
              required
            />
          </div>

          <div>
            <label class="text-sm font-medium mb-1 block">Tanggal Bayar</label>
            <input
              v-model="form.tanggal"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
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
        <div v-if="selectedTagihan" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
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

        <div class="flex justify-end">
          <UButton
            type="submit"
            label="Simpan Pembayaran"
            icon="i-lucide-check"
            :loading="saving"
            :disabled="!form.rumah_id || !form.periode || !form.jumlah"
          />
        </div>
      </form>

      <!-- Multi Periode Form -->
      <form v-if="inputMode === 'multi'" @submit.prevent="simpanMulti" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium mb-1 block">Rumah</label>
            <select
              v-model="multiForm.rumah_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              @change="fetchUnpaidPeriodes"
            >
              <option value="">Pilih Rumah</option>
              <option v-for="r in rumahList" :key="r.id" :value="r.id">
                {{ r.blok }}-{{ r.nomor }} ({{ r.pic_nama || '-' }})
              </option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium mb-1 block">Total Bayar (Rp)</label>
            <input
              v-model.number="multiForm.jumlah"
              type="number"
              placeholder="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label class="text-sm font-medium mb-1 block">Tanggal Bayar</label>
            <input
              v-model="multiForm.tanggal"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label class="text-sm font-medium mb-1 block">Metode</label>
            <select
              v-model="multiForm.metode"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="transfer">Transfer</option>
              <option value="cash">Cash</option>
            </select>
          </div>
        </div>

        <div>
          <label class="text-sm font-medium mb-1 block">Keterangan</label>
          <input
            v-model="multiForm.keterangan"
            type="text"
            placeholder="Opsional"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Periode Selection -->
        <div v-if="unpaidPeriodes.length > 0">
          <label class="text-sm font-medium mb-2 block">Pilih Periode yang Akan Dibayar:</label>
          <div class="space-y-2">
            <label
              v-for="item in unpaidPeriodes"
              :key="item.periode"
              class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900/20': multiForm.periodes.includes(item.periode) }"
            >
              <input
                type="checkbox"
                :value="item.periode"
                v-model="multiForm.periodes"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div class="flex-1">
                <p class="font-medium">{{ formatPeriode(item.periode) }}</p>
                <p class="text-sm text-gray-500">
                  Tagihan: {{ formatRupiah(item.total_tagihan) }} | 
                  Sudah Bayar: {{ formatRupiah(item.total_bayar) }} | 
                  <span class="text-red-600 font-medium">Kurang: {{ formatRupiah(item.sisa) }}</span>
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Allocation Preview -->
        <div v-if="multiForm.periodes.length > 0 && multiForm.jumlah > 0" class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Alokasi Pembayaran:</p>
          <div class="space-y-1">
            <div
              v-for="alloc in allocationPreview"
              :key="alloc.periode"
              class="flex justify-between text-sm"
            >
              <span>{{ formatPeriode(alloc.periode) }}</span>
              <span class="font-medium">{{ formatRupiah(alloc.alokasi) }}</span>
            </div>
            <div class="pt-2 mt-2 border-t border-blue-200 dark:border-blue-700 flex justify-between font-semibold">
              <span>Total</span>
              <span>{{ formatRupiah(totalAlokasi) }}</span>
            </div>
            <div v-if="sisaBayar > 0" class="flex justify-between text-sm text-orange-600">
              <span>Sisa (Saldo Lebih)</span>
              <span>{{ formatRupiah(sisaBayar) }}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <UButton
            type="submit"
            label="Simpan Pembayaran Multi-Periode"
            icon="i-lucide-check"
            :loading="saving"
            :disabled="multiForm.periodes.length === 0 || !multiForm.jumlah"
          />
        </div>
      </form>
    </div>

    <!-- Recent Payments -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-lg font-semibold">Riwayat Pembayaran</h2>
        <select
          v-model="filterPeriode"
          class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          @change="fetchPembayaran"
        >
          <option value="">Semua Periode</option>
          <option v-for="p in availablePeriodes" :key="p.periode" :value="p.periode">
            {{ formatPeriode(p.periode) }}
          </option>
        </select>
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
              <th class="text-center p-3 font-semibold text-sm">Aksi</th>
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
              <td class="p-3 text-sm">{{ formatPeriode(item.periode) }}</td>
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
              <td class="p-3">
                <div class="flex justify-center gap-1">
                  <UButton
                    icon="i-lucide-edit"
                    variant="ghost"
                    size="xs"
                    @click="openEditForm(item)"
                  />
                  <UButton
                    icon="i-lucide-trash-2"
                    variant="ghost"
                    color="red"
                    size="xs"
                    @click="deletePembayaran(item)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pembayaranList.length === 0" class="p-8 text-center text-gray-500">
        Belum ada pembayaran
      </div>
    </div>

    <!-- Edit Modal -->
    <UModal v-model:open="showEditForm" title="Edit Pembayaran">
      <template #body>
        <form @submit.prevent="handleEdit" class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-1 block">Rumah</label>
            <input
              :value="editForm.rumah"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label class="text-sm font-medium mb-1 block">Periode</label>
            <input
              :value="editForm.periode"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label class="text-sm font-medium mb-1 block">Jumlah Bayar (Rp)</label>
            <input
              v-model.number="editForm.jumlah"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label class="text-sm font-medium mb-1 block">Tanggal Bayar</label>
            <input
              v-model="editForm.tanggal"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label class="text-sm font-medium mb-1 block">Metode</label>
            <select
              v-model="editForm.metode"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="transfer">Transfer</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium mb-1 block">Keterangan</label>
            <input
              v-model="editForm.keterangan"
              type="text"
              placeholder="Opsional"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton label="Batal" variant="ghost" @click="showEditForm = false" />
          <UButton label="Simpan" :loading="saving" @click="handleEdit" />
        </div>
      </template>
    </UModal>

    <!-- Upload Modal -->
    <UModal v-model:open="showUpload" title="Upload Excel Pembayaran">
      <template #body>
        <UploadExcel v-model="uploadFile" @parsed="handleUploadParsed" />
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton label="Batal" variant="ghost" @click="showUpload = false" />
          <UButton label="Upload" :loading="uploading" @click="handleUpload" />
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

const inputMode = ref('single')
const rumahList = ref([])
const availablePeriodes = ref([])
const unpaidPeriodes = ref([])
const pembayaranList = ref([])
const selectedTagihan = ref(null)
const saving = ref(false)
const showUpload = ref(false)
const uploadFile = ref(null)
const uploading = ref(false)
const uploadData = ref([])
const filterPeriode = ref('')

const form = reactive({
  rumah_id: '',
  periode: '',
  jumlah: 0,
  tanggal: new Date().toISOString().slice(0, 10),
  metode: 'transfer',
  keterangan: ''
})

const multiForm = reactive({
  rumah_id: '',
  jumlah: 0,
  tanggal: new Date().toISOString().slice(0, 10),
  metode: 'transfer',
  keterangan: '',
  periodes: []
})

// Edit form state
const showEditForm = ref(false)
const editingId = ref(null)
const editForm = reactive({
  rumah: '',
  periode: '',
  jumlah: 0,
  tanggal: '',
  metode: 'transfer',
  keterangan: ''
})

const { formatRupiah, getStatusColor, getStatusText } = useBilling()

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

function formatPeriode(periode) {
  const [year, month] = periode.split('-')
  return `${months[parseInt(month) - 1]} ${year}`
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Calculate allocation preview for multi-periode
const allocationPreview = computed(() => {
  if (!multiForm.periodes.length || !multiForm.jumlah) return []

  let sisa = multiForm.jumlah
  const allocations = []

  // Sort periods
  const sortedPeriodes = [...multiForm.periodes].sort()

  for (const periode of sortedPeriodes) {
    const tagihan = unpaidPeriodes.value.find(t => t.periode === periode)
    if (!tagihan) continue

    const alokasi = Math.min(sisa, tagihan.sisa)
    allocations.push({
      periode,
      alokasi
    })
    sisa -= alokasi
  }

  return allocations
})

const totalAlokasi = computed(() => {
  return allocationPreview.value.reduce((sum, a) => sum + a.alokasi, 0)
})

const sisaBayar = computed(() => {
  return Math.max(0, multiForm.jumlah - totalAlokasi.value)
})

async function fetchRumah() {
  try {
    const data = await $fetch(`/api/rumah?tenant_id=${tenantId}&status=aktif`)
    rumahList.value = data
  } catch (error) {
    console.error('Error fetching rumah:', error)
  }
}

async function fetchPeriodes() {
  try {
    const data = await $fetch(`/api/tutup-buku?tenant_id=${tenantId}`)
    availablePeriodes.value = data.filter(p => p.status === 'draft')
  } catch (error) {
    console.error('Error fetching periodes:', error)
  }
}

async function fetchUnpaidPeriodes() {
  if (!multiForm.rumah_id) {
    unpaidPeriodes.value = []
    return
  }

  try {
    // Get all periods
    const allPeriodes = await $fetch(`/api/tutup-buku?tenant_id=${tenantId}`)
    
    // Get tagihan for this rumah
    const unpaid = []
    for (const periode of allPeriodes) {
      try {
        const tagihanData = await $fetch(`/api/tagihan?tenant_id=${tenantId}&periode=${periode.periode}`)
        const tagihan = tagihanData.data?.find(t => t.rumah_id === multiForm.rumah_id)
        
        if (tagihan && (tagihan.status === 'belum_bayar' || tagihan.status === 'kurang')) {
          unpaid.push({
            periode: periode.periode,
            total_tagihan: tagihan.total_tagihan,
            total_bayar: tagihan.total_bayar,
            sisa: Math.max(0, tagihan.total_tagihan - tagihan.total_bayar)
          })
        }
      } catch {
        // Skip if error
      }
    }
    
    unpaidPeriodes.value = unpaid
  } catch (error) {
    console.error('Error fetching unpaid periodes:', error)
  }
}

async function fetchPembayaran() {
  try {
    const params = new URLSearchParams({ tenant_id: tenantId })
    if (filterPeriode.value) params.append('periode', filterPeriode.value)
    
    const data = await $fetch(`/api/pembayaran?${params}`)
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

async function simpanSingle() {
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

async function simpanMulti() {
  saving.value = true
  try {
    const result = await $fetch('/api/pembayaran/batch', {
      method: 'POST',
      body: {
        tenant_id: tenantId,
        rumah_id: multiForm.rumah_id,
        periodes: multiForm.periodes,
        jumlah: multiForm.jumlah,
        tanggal: multiForm.tanggal,
        metode: multiForm.metode,
        keterangan: multiForm.keterangan
      }
    })

    let message = result.message
    if (result.data.sisa > 0) {
      message += `\nSisa Rp ${formatRupiah(result.data.sisa)} akan menjadi saldo lebih`
    }
    alert(message)

    multiForm.rumah_id = ''
    multiForm.jumlah = 0
    multiForm.keterangan = ''
    multiForm.periodes = []
    unpaidPeriodes.value = []
    
    await fetchPembayaran()
  } catch (error) {
    alert(error.data?.message || 'Gagal menyimpan pembayaran')
  } finally {
    saving.value = false
  }
}

function handleUploadParsed(data) {
  uploadData.value = data
}

async function handleUpload() {
  if (uploadData.value.length === 0) {
    alert('Tidak ada data untuk diupload')
    return
  }

  uploading.value = true
  try {
    // Process each row
    let success = 0
    let failed = 0

    for (const row of uploadData.value) {
      try {
        // Find rumah by blok and nomor
        const rumah = rumahList.value.find(r => 
          r.blok === row['BLOK'] && r.nomor === String(row['NO RUMAH'])
        )

        if (!rumah) {
          failed++
          continue
        }

        await $fetch('/api/pembayaran', {
          method: 'POST',
          body: {
            tenant_id: tenantId,
            rumah_id: rumah.id,
            periode: row['PERIODE'],
            jumlah: row['BAYAR RP'],
            tanggal: new Date().toISOString().slice(0, 10),
            metode: row['METODE'] || 'transfer',
            keterangan: row['KETERANGAN'] || ''
          }
        })
        success++
      } catch {
        failed++
      }
    }

    alert(`Upload selesai: ${success} berhasil, ${failed} gagal`)
    showUpload.value = false
    uploadFile.value = null
    uploadData.value = []
    
    await fetchPembayaran()
  } catch (error) {
    alert('Gagal upload pembayaran')
  } finally {
    uploading.value = false
  }
}

// Edit & Delete functions
function openEditForm(item) {
  editingId.value = item.id
  editForm.rumah = `${item.rumah?.blok}-${item.rumah?.nomor}`
  editForm.periode = formatPeriode(item.periode)
  editForm.jumlah = item.jumlah
  editForm.tanggal = new Date(item.tanggal).toISOString().slice(0, 10)
  editForm.metode = item.metode
  editForm.keterangan = item.keterangan || ''
  showEditForm.value = true
}

async function handleEdit() {
  saving.value = true
  try {
    await $fetch(`/api/pembayaran/${editingId.value}`, {
      method: 'PUT',
      body: {
        jumlah: editForm.jumlah,
        tanggal: editForm.tanggal,
        metode: editForm.metode,
        keterangan: editForm.keterangan
      }
    })
    showEditForm.value = false
    alert('Pembayaran berhasil diupdate')
    await fetchPembayaran()
  } catch (error) {
    alert(error.data?.message || 'Gagal mengupdate pembayaran')
  } finally {
    saving.value = false
  }
}

async function deletePembayaran(item) {
  if (!confirm(`Hapus pembayaran ${item.rumah?.blok}-${item.rumah?.nomor} periode ${formatPeriode(item.periode)} sebesar ${formatRupiah(item.jumlah)}?`)) return

  try {
    await $fetch(`/api/pembayaran/${item.id}`, { method: 'DELETE' })
    alert('Pembayaran berhasil dihapus')
    await fetchPembayaran()
  } catch (error) {
    alert(error.data?.message || 'Gagal menghapus pembayaran')
  }
}

// Watch for changes
watch(() => [form.rumah_id, form.periode], () => {
  fetchTagihanInfo()
})

onMounted(() => {
  fetchRumah()
  fetchPeriodes()
  
  // Default filter ke bulan ini
  const now = new Date()
  const currentPeriode = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  filterPeriode.value = currentPeriode
  
  fetchPembayaran()
})
</script>
