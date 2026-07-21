<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Laporan</h1>
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
          @click="fetchAllData"
        />
      </div>
    </div>

    <!-- Export Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <!-- Rekap Tagihan -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-blue-100 rounded-lg">
            <UIcon name="i-lucide-file-text" class="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 class="font-semibold">Rekap Tagihan</h3>
            <p class="text-sm text-gray-500">Semua tagihan per periode</p>
          </div>
        </div>
        <UButton
          label="Download Excel"
          icon="i-lucide-download"
          variant="outline"
          block
          @click="exportRekapTagihan"
        />
      </div>

      <!-- Rekap Pembayaran -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-green-100 rounded-lg">
            <UIcon name="i-lucide-credit-card" class="text-green-600 text-xl" />
          </div>
          <div>
            <h3 class="font-semibold">Rekap Pembayaran</h3>
            <p class="text-sm text-gray-500">Semua pembayaran masuk</p>
          </div>
        </div>
        <UButton
          label="Download Excel"
          icon="i-lucide-download"
          variant="outline"
          block
          @click="exportRekapPembayaran"
        />
      </div>

      <!-- Tunggakan -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-red-100 rounded-lg">
            <UIcon name="i-lucide-alert-circle" class="text-red-600 text-xl" />
          </div>
          <div>
            <h3 class="font-semibold">Daftar Tunggakan</h3>
            <p class="text-sm text-gray-500">Rumah belum bayar</p>
          </div>
        </div>
        <UButton
          label="Download Excel"
          icon="i-lucide-download"
          variant="outline"
          block
          @click="exportTunggakan"
        />
      </div>

      <!-- Kas Masuk/Keluar -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-purple-100 rounded-lg">
            <UIcon name="i-lucide-wallet" class="text-purple-600 text-xl" />
          </div>
          <div>
            <h3 class="font-semibold">Laporan Kas</h3>
            <p class="text-sm text-gray-500">Kas masuk & keluar</p>
          </div>
        </div>
        <UButton
          label="Download Excel"
          icon="i-lucide-download"
          variant="outline"
          block
          @click="exportKas"
        />
      </div>

      <!-- Summary Meeting -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <UIcon name="i-lucide-presentation" class="text-yellow-600 text-xl" />
          </div>
          <div>
            <h3 class="font-semibold">Summary Meeting</h3>
            <p class="text-sm text-gray-500">Ringkasan untuk warga</p>
          </div>
        </div>
        <UButton
          label="Download Excel"
          icon="i-lucide-download"
          variant="outline"
          block
          @click="exportSummary"
        />
      </div>

      <!-- Kwitansi -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-orange-100 rounded-lg">
            <UIcon name="i-lucide-receipt" class="text-orange-600 text-xl" />
          </div>
          <div>
            <h3 class="font-semibold">Kwitansi</h3>
            <p class="text-sm text-gray-500">Bukti pembayaran</p>
          </div>
        </div>
        <UButton
          label="Download Excel"
          icon="i-lucide-download"
          variant="outline"
          block
          @click="exportKwitansi"
        />
      </div>
    </div>

    <!-- Preview Data -->
    <div v-if="previewData.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="font-semibold">Preview: {{ previewTitle }}</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <th v-for="header in previewHeaders" :key="header" class="text-left p-3 font-semibold text-sm">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in previewData.slice(0, 10)"
              :key="idx"
              class="border-b border-gray-200 dark:border-gray-700"
            >
              <td v-for="header in previewHeaders" :key="header" class="p-3 text-sm">
                {{ row[header] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="previewData.length > 10" class="p-3 text-center text-sm text-gray-500">
        Menampilkan 10 dari {{ previewData.length }} data
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const tenantId = 'waris1'
const selectedPeriode = ref(new Date().toISOString().slice(0, 7))
const loading = ref(false)
const previewTitle = ref('')
const previewHeaders = ref([])
const previewData = ref([])

const { formatRupiah } = useBilling()
const { exportToExcel, exportMultiSheetToExcel } = useExcel()

// Data
const tagihanData = ref([])
const pembayaranData = ref([])
const kasData = ref([])

async function fetchAllData() {
  loading.value = true
  try {
    // Fetch tagihan
    try {
      const tagihanRes = await $fetch(`/api/tagihan?tenant_id=${tenantId}&periode=${selectedPeriode.value}`)
      tagihanData.value = tagihanRes.data || []
    } catch { tagihanData.value = [] }

    // Fetch pembayaran
    try {
      const pembayaranRes = await $fetch(`/api/pembayaran?tenant_id=${tenantId}&periode=${selectedPeriode.value}`)
      pembayaranData.value = pembayaranRes || []
    } catch { pembayaranData.value = [] }

    // Fetch kas
    try {
      const kasRes = await $fetch(`/api/kas?tenant_id=${tenantId}&bulan=${selectedPeriode.value}`)
      kasData.value = kasRes.data || []
    } catch { kasData.value = [] }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

function exportRekapTagihan() {
  const data = tagihanData.value.map((t, idx) => ({
    'No': idx + 1,
    'Blok': t.blok,
    'No. Rumah': t.nomor_rumah,
    'Status Rumah': t.status_penghuni === 'ada' ? 'Dihuni' : 'Kosong',
    'PIC': t.pic_nama || '-',
    'Total Tagihan': t.total_tagihan,
    'Total Bayar': t.total_bayar,
    'Selisih': t.selisih,
    'Status': t.status
  }))

  previewTitle.value = 'Rekap Tagihan'
  previewHeaders.value = Object.keys(data[0] || {})
  previewData.value = data

  if (data.length > 0) {
    exportToExcel(data, `rekap-tagihan-${selectedPeriode.value}`)
  } else {
    alert('Tidak ada data tagihan')
  }
}

function exportRekapPembayaran() {
  const data = pembayaranData.value.map((p, idx) => ({
    'No': idx + 1,
    'Blok': p.rumah?.blok || '-',
    'No. Rumah': p.rumah?.nomor || '-',
    'PIC': p.rumah?.pic_nama || '-',
    'Periode': p.periode,
    'Jumlah Bayar': p.jumlah,
    'Tanggal': new Date(p.tanggal).toLocaleDateString('id-ID'),
    'Metode': p.metode,
    'Keterangan': p.keterangan || '-'
  }))

  previewTitle.value = 'Rekap Pembayaran'
  previewHeaders.value = Object.keys(data[0] || {})
  previewData.value = data

  if (data.length > 0) {
    exportToExcel(data, `rekap-pembayaran-${selectedPeriode.value}`)
  } else {
    alert('Tidak ada data pembayaran')
  }
}

function exportTunggakan() {
  const tunggakan = tagihanData.value.filter(t => t.status === 'belum_bayar' || t.status === 'kurang')
  const data = tunggakan.map((t, idx) => ({
    'No': idx + 1,
    'Blok': t.blok,
    'No. Rumah': t.nomor_rumah,
    'PIC': t.pic_nama || '-',
    'Telepon': t.pic_telepon || '-',
    'Tagihan': t.total_tagihan,
    'Sudah Bayar': t.total_bayar,
    'Kurang': Math.abs(t.selisih),
    'Status': t.status
  }))

  previewTitle.value = 'Daftar Tunggakan'
  previewHeaders.value = Object.keys(data[0] || {})
  previewData.value = data

  if (data.length > 0) {
    exportToExcel(data, `tunggakan-${selectedPeriode.value}`)
  } else {
    alert('Tidak ada tunggakan')
  }
}

function exportKas() {
  const data = kasData.value.map((k, idx) => ({
    'No': idx + 1,
    'Tanggal': new Date(k.tanggal).toLocaleDateString('id-ID'),
    'Tipe': k.tipe === 'masuk' ? 'Masuk' : 'Keluar',
    'Kategori': k.kategori,
    'Jumlah': k.jumlah,
    'Keterangan': k.keterangan || '-'
  }))

  // Add summary
  const masuk = kasData.value.filter(k => k.tipe === 'masuk').reduce((sum, k) => sum + k.jumlah, 0)
  const keluar = kasData.value.filter(k => k.tipe === 'keluar').reduce((sum, k) => sum + k.jumlah, 0)

  data.push({
    'No': '',
    'Tanggal': '',
    'Tipe': '',
    'Kategori': 'TOTAL MASUK',
    'Jumlah': masuk,
    'Keterangan': ''
  })
  data.push({
    'No': '',
    'Tanggal': '',
    'Tipe': '',
    'Kategori': 'TOTAL KELUAR',
    'Jumlah': keluar,
    'Keterangan': ''
  })
  data.push({
    'No': '',
    'Tanggal': '',
    'Tipe': '',
    'Kategori': 'SALDO',
    'Jumlah': masuk - keluar,
    'Keterangan': ''
  })

  previewTitle.value = 'Laporan Kas'
  previewHeaders.value = Object.keys(data[0] || {})
  previewData.value = data

  exportToExcel(data, `laporan-kas-${selectedPeriode.value}`)
}

function exportSummary() {
  const totalTagihan = tagihanData.value.reduce((sum, t) => sum + t.total_tagihan, 0)
  const totalBayar = tagihanData.value.reduce((sum, t) => sum + t.total_bayar, 0)
  const lunas = tagihanData.value.filter(t => t.status === 'lunas' || t.status === 'lebih').length
  const belum = tagihanData.value.filter(t => t.status === 'belum_bayar' || t.status === 'kurang').length
  const masuk = kasData.value.filter(k => k.tipe === 'masuk').reduce((sum, k) => sum + k.jumlah, 0)
  const keluar = kasData.value.filter(k => k.tipe === 'keluar').reduce((sum, k) => sum + k.jumlah, 0)

  const sheets = [
    {
      name: 'Summary',
      data: [
        { 'Keterangan': 'Periode', 'Nilai': selectedPeriode.value },
        { 'Keterangan': 'Total Rumah', 'Nilai': tagihanData.value.length },
        { 'Keterangan': 'Sudah Bayar', 'Nilai': lunas },
        { 'Keterangan': 'Belum Bayar', 'Nilai': belum },
        { 'Keterangan': '', 'Nilai': '' },
        { 'Keterangan': 'Total Tagihan', 'Nilai': formatRupiah(totalTagihan) },
        { 'Keterangan': 'Total Terbayar', 'Nilai': formatRupiah(totalBayar) },
        { 'Keterangan': 'Sisa Tunggakan', 'Nilai': formatRupiah(totalTagihan - totalBayar) },
        { 'Keterangan': '', 'Nilai': '' },
        { 'Keterangan': 'Kas Masuk', 'Nilai': formatRupiah(masuk) },
        { 'Keterangan': 'Kas Keluar', 'Nilai': formatRupiah(keluar) },
        { 'Keterangan': 'Saldo Kas', 'Nilai': formatRupiah(masuk - keluar) }
      ]
    },
    {
      name: 'Tunggakan',
      data: tagihanData.value
        .filter(t => t.status === 'belum_bayar' || t.status === 'kurang')
        .map((t, idx) => ({
          'No': idx + 1,
          'Blok': t.blok,
          'No. Rumah': t.nomor_rumah,
          'PIC': t.pic_nama || '-',
          'Kurang': Math.abs(t.selisih)
        }))
    }
  ]

  previewTitle.value = 'Summary Meeting'
  previewHeaders.value = ['Keterangan', 'Nilai']
  previewData.value = sheets[0].data

  exportMultiSheetToExcel(sheets, `summary-meeting-${selectedPeriode.value}`)
}

function exportKwitansi() {
  const data = pembayaranData.value.map((p, idx) => ({
    'No': idx + 1,
    'Tanggal': new Date(p.tanggal).toLocaleDateString('id-ID'),
    'Blok': p.rumah?.blok || '-',
    'No. Rumah': p.rumah?.nomor || '-',
    'PIC': p.rumah?.pic_nama || '-',
    'Periode': p.periode,
    'Jumlah Bayar': p.jumlah,
    'Metode': p.metode,
    'Keterangan': p.keterangan || '-'
  }))

  previewTitle.value = 'Kwitansi Pembayaran'
  previewHeaders.value = Object.keys(data[0] || {})
  previewData.value = data

  if (data.length > 0) {
    exportToExcel(data, `kwitansi-${selectedPeriode.value}`)
  } else {
    alert('Tidak ada pembayaran')
  }
}

onMounted(() => {
  fetchAllData()
})
</script>
