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
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))

// Initialize Firebase
const app = initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore(app)

// Initialize Prisma
const prisma = new PrismaClient()

const TENANT_ID = 'waris1'

function parseTimestamp(ts: any): Date {
  if (!ts) return new Date()
  if (ts.toDate) return ts.toDate()
  if (ts instanceof Date) return ts
  return new Date(ts)
}

async function main() {
  console.log('💰 Memulai migrasi Pembayaran dari Firebase...\n')

  // 1. Fetch ipl_records yang Terbayarkan
  console.log('📥 Mengambil data dari Firebase...')
  const recordsSnap = await db.collection('ipl_records').get()
  const terbayarRecords = recordsSnap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter((r: any) => r.status_iuran === 'Terbayarkan')

  console.log(`   📦 Total ipl_records: ${recordsSnap.docs.length}`)
  console.log(`   ✅ Terbayarkan: ${terbayarRecords.length}\n`)

  // 2. Ambil semua tagihan yang lunas dari database
  console.log('📋 Mengambil tagihan dari database...')
  const tagihanList = await prisma.tagihan.findMany({
    where: {
      tenant_id: TENANT_ID,
      status: 'lunas'
    },
    include: {
      periode: true,
      rumah: true
    }
  })

  // Index tagihan by period + block + house_number
  const tagihanMap = new Map<string, typeof tagihanList[0]>()
  for (const t of tagihanList) {
    const key = `${t.periode.periode}_${t.blok.toLowerCase()}_${t.nomor_rumah.toLowerCase()}`
    tagihanMap.set(key, t)
  }

  console.log(`   📦 Tagihan lunas di DB: ${tagihanList.length}\n`)

  // 3. Buat Pembayaran
  console.log('💰 Migrasi Pembayaran...')
  let success = 0
  let skipped = 0
  let failed = 0
  let totalUpdated = 0

  // Hapus pembayaran migrated sebelumnya (jika ada)
  const deletedCount = await prisma.pembayaran.deleteMany({
    where: { tenant_id: TENANT_ID, input_oleh: 'migrated' }
  })
  if (deletedCount.count > 0) {
    console.log(`   🗑️  Hapus ${deletedCount.count} pembayaran migrated sebelumnya`)
  }

  for (const record of terbayarRecords) {
    const r = record as any
    const period = r.period
    const blok = (r.block || '').trim()
    const nomor = (r.house_number || '').trim()
    const tagihanKey = `${period}_${blok.toLowerCase()}_${nomor.toLowerCase()}`

    const tagihan = tagihanMap.get(tagihanKey)
    if (!tagihan) {
      console.log(`   ⚠️  Skip ${blok}-${nomor} (${period}): tagihan tidak ditemukan`)
      skipped++
      continue
    }

    try {
      // Tentukan jumlah bayar
      // Prioritas: amount_paid (jika ada) > total_tagihan
      const amountPaid = r.amount_paid ? Number(r.amount_paid) : tagihan.total_tagihan
      const tanggalBayar = r.updated_at ? parseTimestamp(r.updated_at) : new Date()

      // Buat Pembayaran
      await prisma.pembayaran.create({
        data: {
          tenant_id: TENANT_ID,
          rumah_id: tagihan.rumah_id,
          tagihan_id: tagihan.id,
          periode: period,
          jumlah: amountPaid,
          tanggal: tanggalBayar,
          metode: 'transfer',
          keterangan: r.amount_paid ? `Migrated (amount_paid: ${r.amount_paid})` : 'Migrated from Firebase',
          input_oleh: 'migrated'
        }
      })

      // Update total_bayar di tagihan jika amount_paid berbeda
      if (amountPaid !== tagihan.total_bayar) {
        await prisma.tagihan.update({
          where: { id: tagihan.id },
          data: {
            total_bayar: amountPaid,
            selisih: amountPaid - tagihan.total_tagihan,
            status: amountPaid >= tagihan.total_tagihan ? 'lunas' : 
                    amountPaid > 0 ? 'kurang' : 'belum_bayar',
            saldo_lebih: amountPaid > tagihan.total_tagihan ? amountPaid - tagihan.total_tagihan : 0
          }
        })
        totalUpdated++
      }

      success++
    } catch (error: any) {
      console.error(`   ❌ ${blok}-${nomor} (${period}): ${error.message}`)
      failed++
    }
  }

  // ==============================
  // Summary
  // ==============================
  console.log('\n═══════════════════════════════════════')
  console.log('📊 RINGKASAN MIGRASI PEMBAYARAN')
  console.log('═══════════════════════════════════════')
  console.log(`   💰 Pembayaran:     ${success} berhasil, ${failed} gagal, ${skipped} skip`)
  console.log(`   📝 Tagihan update: ${totalUpdated} diperbarui`)
  console.log('═══════════════════════════════════════\n')

  await prisma.$disconnect()
  console.log('✅ Migrasi pembayaran selesai!')
}

main().catch((error) => {
  console.error('❌ Migrasi gagal:', error)
  prisma.$disconnect()
  process.exit(1)
})
