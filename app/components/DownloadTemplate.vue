<template>
  <UButton
    :label="label"
    icon="i-lucide-download"
    variant="outline"
    :loading="downloading"
    @click="handleDownload"
  />
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['rumah', 'meteran', 'pembayaran'].includes(value)
  },
  label: {
    type: String,
    default: 'Download Template'
  },
  data: {
    type: Array,
    default: () => []
  },
  filename: {
    type: String,
    default: ''
  },
  periode: {
    type: String,
    default: ''
  }
})

const { downloadTemplate } = useExcel()
const { tenantId } = useTenant()
const downloading = ref(false)

async function fetchMeteranData() {
  downloading.value = true
  try {
    // Fetch all active rumah
    const rumahList = await $fetch(`/api/rumah?tenant_id=${tenantId}&status=aktif`)
    
    // Fetch tagihan for current period to get meter_lalu
    let meteranMap = new Map()
    if (props.periode) {
      try {
        const tagihanData = await $fetch(`/api/tagihan?tenant_id=${tenantId}&periode=${props.periode}`)
        for (const t of (tagihanData.data || [])) {
          for (const item of (t.items || [])) {
            if (item.tipe === 'meteran') {
              meteranMap.set(t.rumah_id, {
                meter_lalu: item.meter_sekarang || 0,
                status_penghuni: t.status_penghuni
              })
            }
          }
        }
      } catch {
        // ignore - use empty defaults
      }
    }

    // Build template data
    return rumahList.map((r, index) => {
      const meterInfo = meteranMap.get(r.id)
      return {
        no: index + 1,
        blok: r.blok,
        nomor: r.nomor,
        status_penghuni: meterInfo?.status_penghuni || 'ada',
        pic: r.pic_nama || '',
        meter_lalu: meterInfo?.meter_lalu || 0,
        meter_sekarang: '',
        keterangan: ''
      }
    })
  } catch (error) {
    console.error('Error fetching meteran data:', error)
    return []
  } finally {
    downloading.value = false
  }
}

async function handleDownload() {
  const templates = {
    rumah: {
      headers: [
        { key: 'no', label: 'NO' },
        { key: 'blok', label: 'BLOK' },
        { key: 'nomor', label: 'NO RUMAH' },
        { key: 'tipe', label: 'TIPE' },
        { key: 'status', label: 'STATUS' },
        { key: 'pic_nama', label: 'PIC' },
        { key: 'pic_telepon', label: 'TELEPON' },
        { key: 'kategori', label: 'KATEGORI IURAN' },
        { key: 'keterangan', label: 'KETERANGAN' }
      ],
      sample: [
        { no: 1, blok: 'A', nomor: '1', tipe: 'pribadi', status: 'aktif', pic_nama: 'Budi', pic_telepon: '081211111111', kategori: 'air,sampah', keterangan: '' },
        { no: 2, blok: 'A', nomor: '2', tipe: 'kontrakan', status: 'aktif', pic_nama: 'Andi', pic_telepon: '081222222222', kategori: 'air,sampah', keterangan: 'Dikontrakkan' },
        { no: 3, blok: 'FASUM', nomor: '1', tipe: 'fasum', status: 'aktif', pic_nama: 'Pengurus', pic_telepon: '081233333333', kategori: 'air', keterangan: 'Masjid' }
      ]
    },
    meteran: {
      headers: [
        { key: 'no', label: 'NO' },
        { key: 'blok', label: 'BLOK' },
        { key: 'nomor', label: 'NO RUMAH' },
        { key: 'status_penghuni', label: 'STATUS PENGHUNI' },
        { key: 'pic', label: 'PIC BULAN INI' },
        { key: 'meter_lalu', label: 'METER LALU' },
        { key: 'meter_sekarang', label: 'METER SKRG' },
        { key: 'keterangan', label: 'KETERANGAN' }
      ],
      sample: [
        { no: 1, blok: 'A', nomor: '1', status_penghuni: 'ada', pic: 'Budi', meter_lalu: 100, meter_sekarang: '', keterangan: '' },
        { no: 2, blok: 'A', nomor: '2', status_penghuni: 'kosong', pic: '-', meter_lalu: 50, meter_sekarang: 50, keterangan: 'Kontrakan kosong' }
      ]
    },
    pembayaran: {
      headers: [
        { key: 'no', label: 'NO' },
        { key: 'blok', label: 'BLOK' },
        { key: 'nomor', label: 'NO RUMAH' },
        { key: 'periode', label: 'PERIODE' },
        { key: 'jumlah', label: 'BAYAR RP' },
        { key: 'metode', label: 'METODE' },
        { key: 'keterangan', label: 'KETERANGAN' }
      ],
      sample: [
        { no: 1, blok: 'A', nomor: '1', periode: '2026-07', jumlah: 50000, metode: 'transfer', keterangan: 'Transfer BCA' },
        { no: 2, blok: 'A', nomor: '2', periode: '2026-07', jumlah: 65000, metode: 'cash', keterangan: '' }
      ]
    }
  }

  const template = templates[props.type]
  if (!template) return

  let exportData = props.data

  // For meteran, fetch data from API if not provided
  if (props.type === 'meteran' && exportData.length === 0) {
    exportData = await fetchMeteranData()
  }

  // Fallback to sample if still empty
  if (exportData.length === 0) {
    exportData = template.sample
  }

  const filename = props.filename || props.type
  downloadTemplate(template.headers, filename, exportData)
}
</script>
