import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { PrismaClient } from '@prisma/client'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load service account key
const serviceAccountPath = join(__dirname, 'serviceAccountKey.json')
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ File serviceAccountKey.json tidak ditemukan di folder scripts/')
  process.exit(1)
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))

// Initialize Firebase
const app = initializeApp({
  credential: cert(serviceAccount)
})
const db = getFirestore(app)

// Initialize Prisma
const prisma = new PrismaClient()

const TENANT_ID = 'waris1'

// Tarif config
const WATER_MIN_QUOTA = 10 // m³
const WATER_MIN_FEE = 25000 // flat untuk ≤ 10m³
const WATER_PRICE_PER_CUBIC = 3000 // per m³ setelah 10m³
const TRASH_FLAT_FEE = 25000

// ==============================
// Type definitions
// ==============================

interface HouseDoc {
  block: string
  house_number: string
  pic: string
  is_active?: boolean
  created_at?: any
}

interface IplRecordDoc {
  period: string
  house_id: string
  block: string
  house_number: string
  status_rumah: string
  jenis_iuran: string
  status_iuran: string
  water_meter_past: number
  water_meter_current: number
  amount_paid?: number
  updated_at?: any
}

interface KasLogDoc {
  period: string
  type: string
  category: string
  description: string
  amount: number
  transaction_date?: any
  created_at?: any
}

// ==============================
// Helper functions
// ==============================

function parseTimestamp(ts: any): Date {
  if (!ts) return new Date()
  if (ts.toDate) return ts.toDate() // Firestore Timestamp
  if (ts instanceof Date) return ts
  return new Date(ts)
}

function mapStatusPenghuni(status: string): string {
  switch (status) {
    case 'Ditinggali':
    case 'Disewakan':
      return 'ada'
    case 'Kosong':
      return 'kosong'
    default:
      return 'ada'
  }
}

function mapStatusIuran(status: string): string {
  switch (status) {
    case 'Terbayarkan':
      return 'lunas'
    case 'Belum Terbayarkan':
    default:
      return 'belum_bayar'
  }
}

function mapKasCategory(category: string): string {
  const lower = category.toLowerCase()
  if (lower === 'donasi' || lower === 'iuran tambahan' || lower === 'sumbangan') return 'donasi'
  if (['perbaikan', 'operasional', 'infrastruktur', 'kebersihan'].includes(lower)) return 'operasional'
  return 'lainnya'
}

function calcAirFee(pemakaian: number): number {
  if (pemakaian <= WATER_MIN_QUOTA) {
    return WATER_MIN_FEE
  }
  return WATER_MIN_FEE + (pemakaian - WATER_MIN_QUOTA) * WATER_PRICE_PER_CUBIC
}

function calcSampahFee(): number {
  return TRASH_FLAT_FEE
}

// ==============================
// Main migration
// ==============================

async function main() {
  console.log('🔥 Memulai migrasi Firebase → PostgreSQL...\n')

  // 1. Fetch data dari Firebase
  console.log('📥 Mengambil data dari Firebase...')

  const housesSnap = await db.collection('houses').get()
  const recordsSnap = await db.collection('ipl_records').get()
  const kasSnap = await db.collection('kas_log').get()

  const houses = housesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as HouseDoc & { id: string }))
  const records = recordsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as IplRecordDoc & { id: string }))
  const kasLogs = kasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as KasLogDoc & { id: string }))

  console.log(`   📦 houses: ${houses.length} dokumen`)
  console.log(`   📦 ipl_records: ${records.length} dokumen`)
  console.log(`   📦 kas_log: ${kasLogs.length} dokumen\n`)

  // 2. Ambil kategori iuran IDs
  console.log('📋 Mengambil kategori iuran...')
  const kategoriAir = await prisma.kategoriIuran.findFirst({
    where: { tenant_id: TENANT_ID, nama: 'Air' }
  })
  const kategoriSampah = await prisma.kategoriIuran.findFirst({
    where: { tenant_id: TENANT_ID, nama: 'Sampah' }
  })

  if (!kategoriAir || !kategoriSampah) {
    console.error('❌ Kategori iuran "Air" dan/atau "Sampah" tidak ditemukan. Jalankan seed dulu.')
    await prisma.$disconnect()
    process.exit(1)
  }
  console.log(`   ✅ Air: ${kategoriAir.id}`)
  console.log(`   ✅ Sampah: ${kategoriSampah.id}\n`)

  // ==============================
  // 3. Upsert Rumah
  // ==============================
  console.log('🏠 Migrasi Rumah...')
  let rumahSuccess = 0
  let rumahFailed = 0
  const rumahMap = new Map<string, string>() // key: block_house_number → rumah_id

  for (const house of houses) {
    const blok = house.block.trim()
    const nomor = house.house_number.trim()
    const mapKey = `${blok.toLowerCase()}_${nomor.toLowerCase()}`

    try {
      const rumah = await prisma.rumah.upsert({
        where: {
          tenant_id_blok_nomor: {
            tenant_id: TENANT_ID,
            blok,
            nomor
          }
        },
        update: {
          pic_nama: house.pic?.trim() || null,
          kategori_iuran: [kategoriAir.id, kategoriSampah.id]
        },
        create: {
          tenant_id: TENANT_ID,
          blok,
          nomor,
          tipe: 'pribadi',
          status: 'aktif',
          pic_nama: house.pic?.trim() || null,
          kategori_iuran: [kategoriAir.id, kategoriSampah.id]
        }
      })
      rumahMap.set(mapKey, rumah.id)
      rumahSuccess++
    } catch (error: any) {
      console.error(`   ❌ Gagal: ${blok}-${nomor}: ${error.message}`)
      rumahFailed++
    }
  }
  console.log(`   ✅ Berhasil: ${rumahSuccess} | ❌ Gagal: ${rumahFailed}\n`)

  // ==============================
  // 4. Upsert Periode
  // ==============================
  console.log('📅 Migrasi Periode...')
  const uniquePeriods = [...new Set(records.map(r => r.period))].sort()
  const periodeMap = new Map<string, string>() // period string → periode_id

  for (const period of uniquePeriods) {
    try {
      const periode = await prisma.periode.upsert({
        where: {
          tenant_id_periode: {
            tenant_id: TENANT_ID,
            periode: period
          }
        },
        update: {},
        create: {
          tenant_id: TENANT_ID,
          periode: period,
          status: 'draft'
        }
      })
      periodeMap.set(period, periode.id)
      console.log(`   ✅ ${period}`)
    } catch (error: any) {
      console.error(`   ❌ ${period}: ${error.message}`)
    }
  }
  console.log(`   Total: ${periodeMap.size} periode\n`)

  // ==============================
  // 5. Upsert Tagihan + TagihanDetail
  // ==============================
  console.log('📝 Migrasi Tagihan...')
  let tagihanSuccess = 0
  let tagihanFailed = 0

  // Pre-load semua rumah untuk hindari query berulang
  const allRumah = await prisma.rumah.findMany({
    where: { tenant_id: TENANT_ID }
  })
  const rumahByIdMap = new Map(allRumah.map(r => [r.id, r]))
  const rumahByBlokNomor = new Map<string, typeof allRumah[0]>()
  for (const r of allRumah) {
    rumahByBlokNomor.set(`${r.blok.toLowerCase()}_${r.nomor.toLowerCase()}`, r)
  }

  // Group by period + house to combine Air & Sampah
  const tagihanGroups = new Map<string, IplRecordDoc[]>()

  for (const record of records) {
    const groupKey = `${record.period}_${record.block.toLowerCase()}_${record.house_number.toLowerCase()}`
    if (!tagihanGroups.has(groupKey)) {
      tagihanGroups.set(groupKey, [])
    }
    tagihanGroups.get(groupKey)!.push(record)
  }

  const tagihanDataList: Array<{
    tenant_id: string
    periode_id: string
    rumah_id: string
    blok: string
    nomor_rumah: string
    tipe_rumah: string
    status_penghuni: string
    total_tagihan: number
    total_bayar: number
    selisih: number
    status: string
    saldo_lebih: number
    details: Array<{
      kategori_id: string
      kategori_nama: string
      tipe: string
      meter_lalu: number | null
      meter_sekarang: number | null
      pemakaian: number | null
      jumlah_tagihan: number
    }>
  }> = []

  for (const [groupKey, groupRecords] of tagihanGroups) {
    const first = groupRecords[0]
    const period = first.period
    const blok = first.block.trim()
    const nomor = first.house_number.trim()
    const rumahKey = `${blok.toLowerCase()}_${nomor.toLowerCase()}`
    const rumahData = rumahByBlokNomor.get(rumahKey)
    const periodeId = periodeMap.get(period)

    if (!rumahData || !periodeId) {
      console.error(`   ⚠️  Skip ${blok}-${nomor} (${period}): rumah/periode tidak ditemukan`)
      tagihanFailed++
      continue
    }

    // Calculate TagihanDetails
    const details: typeof tagihanDataList[0]['details'] = []
    let totalTagihan = 0

    for (const rec of groupRecords) {
      const jenisIuran = rec.jenis_iuran?.trim() || ''

      // Air detail (selalu ada)
      const pemakaian = Math.max(0, (rec.water_meter_current || 0) - (rec.water_meter_past || 0))
      const airFee = calcAirFee(pemakaian)

      details.push({
        kategori_id: kategoriAir.id,
        kategori_nama: 'Air',
        tipe: 'meteran',
        meter_lalu: rec.water_meter_past || 0,
        meter_sekarang: rec.water_meter_current || 0,
        pemakaian,
        jumlah_tagihan: airFee
      })
      totalTagihan += airFee

      // Sampah detail (jika ikut sampah)
      if (jenisIuran.includes('Sampah')) {
        const sampahFee = calcSampahFee()
        details.push({
          kategori_id: kategoriSampah.id,
          kategori_nama: 'Sampah',
          tipe: 'flat',
          meter_lalu: null,
          meter_sekarang: null,
          pemakaian: null,
          jumlah_tagihan: sampahFee
        })
        totalTagihan += sampahFee
      }
    }

    const statusPenghuni = mapStatusPenghuni(first.status_rumah)
    const statusIuran = mapStatusIuran(first.status_iuran)
    const totalBayar = statusIuran === 'lunas' ? totalTagihan : 0

    tagihanDataList.push({
      tenant_id: TENANT_ID,
      periode_id: periodeId,
      rumah_id: rumahData.id,
      blok,
      nomor_rumah: nomor,
      tipe_rumah: rumahData.tipe,
      status_penghuni: statusPenghuni,
      total_tagihan: totalTagihan,
      total_bayar: totalBayar,
      selisih: totalBayar - totalTagihan,
      status: statusIuran,
      saldo_lebih: 0,
      details
    })
  }

  // Batch delete existing tagihan for these periods
  const periodeIds = [...periodeMap.values()]
  const existingTagihan = await prisma.tagihan.findMany({
    where: { tenant_id: TENANT_ID, periode_id: { in: periodeIds } }
  })
  const existingIds = existingTagihan.map(t => t.id)

  if (existingIds.length > 0) {
    await prisma.tagihanDetail.deleteMany({ where: { tagihan_id: { in: existingIds } } })
    await prisma.tagihan.deleteMany({ where: { id: { in: existingIds } } })
    console.log(`   🗑️  Hapus ${existingIds.length} tagihan lama`)
  }

  // Batch insert tagihan
  for (const td of tagihanDataList) {
    try {
      const tagihan = await prisma.tagihan.create({
        data: {
          tenant_id: td.tenant_id,
          periode_id: td.periode_id,
          rumah_id: td.rumah_id,
          blok: td.blok,
          nomor_rumah: td.nomor_rumah,
          tipe_rumah: td.tipe_rumah,
          status_penghuni: td.status_penghuni,
          total_tagihan: td.total_tagihan,
          total_bayar: td.total_bayar,
          selisih: td.selisih,
          status: td.status,
          saldo_lebih: td.saldo_lebih,
          items: {
            create: td.details
          }
        }
      })
      tagihanSuccess++
    } catch (error: any) {
      console.error(`   ❌ ${td.blok}-${td.nomor_rumah}: ${error.message}`)
      tagihanFailed++
    }
  }
  console.log(`   ✅ Berhasil: ${tagihanSuccess} | ❌ Gagal: ${tagihanFailed}\n`)

  // ==============================
  // 6. Insert KasTransaksi
  // ==============================
  console.log('💰 Migrasi Kas Transaksi...')
  let kasSuccess = 0
  let kasFailed = 0

  for (const kas of kasLogs) {
    try {
      await prisma.kasTransaksi.create({
        data: {
          tenant_id: TENANT_ID,
          tipe: kas.type === 'masuk' ? 'masuk' : 'keluar',
          jumlah: kas.amount || 0,
          tanggal: parseTimestamp(kas.transaction_date),
          keterangan: kas.description?.trim() || null,
          kategori: mapKasCategory(kas.category),
          input_oleh: 'migrated'
        }
      })
      kasSuccess++
    } catch (error: any) {
      console.error(`   ❌ ${kas.description}: ${error.message}`)
      kasFailed++
    }
  }
  console.log(`   ✅ Berhasil: ${kasSuccess} | ❌ Gagal: ${kasFailed}\n`)

  // ==============================
  // Summary
  // ==============================
  console.log('═══════════════════════════════════════')
  console.log('📊 RINGKASAN MIGRASI')
  console.log('═══════════════════════════════════════')
  console.log(`   🏠 Rumah:          ${rumahSuccess} berhasil, ${rumahFailed} gagal`)
  console.log(`   📅 Periode:        ${periodeMap.size} periode`)
  console.log(`   📝 Tagihan:        ${tagihanSuccess} berhasil, ${tagihanFailed} gagal`)
  console.log(`   💰 Kas Transaksi:  ${kasSuccess} berhasil, ${kasFailed} gagal`)
  console.log('═══════════════════════════════════════\n')

  await prisma.$disconnect()
  console.log('✅ Migrasi selesai!')
}

main().catch((error) => {
  console.error('❌ Migrasi gagal:', error)
  prisma.$disconnect()
  process.exit(1)
})
