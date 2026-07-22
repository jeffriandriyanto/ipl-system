import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TENANT_ID = 'waris1'

async function main() {
  console.log('💰 Generate kas_masuk dari data pembayaran...\n')

  // 1. Ambil semua pembayaran
  const allPembayaran = await prisma.pembayaran.findMany({
    where: { tenant_id: TENANT_ID },
    include: { rumah: true }
  })
  console.log(`📦 Total pembayaran: ${allPembayaran.length}\n`)

  // 2. Ambil kas_transaksi yang sudah ada (untuk hindari duplikat)
  const existingKas = await prisma.kasTransaksi.findMany({
    where: { 
      tenant_id: TENANT_ID,
      keterangan: { contains: 'Pembayaran IPL' }
    }
  })
  const existingKeterangan = new Set(existingKas.map(k => k.keterangan))
  console.log(`📋 Kas transaksi existing (dari pembayaran): ${existingKas.length}\n`)

  // 3. Buat kas_masuk untuk setiap pembayaran yang belum ada
  let created = 0
  let skipped = 0

  for (const p of allPembayaran) {
    const keterangan = `Pembayaran IPL ${p.rumah?.blok || ''}-${p.rumah?.nomor || ''} periode ${p.periode}`
    
    // Skip jika sudah ada
    if (existingKeterangan.has(keterangan)) {
      skipped++
      continue
    }

    try {
      await prisma.kasTransaksi.create({
        data: {
          tenant_id: TENANT_ID,
          tipe: 'masuk',
          jumlah: p.jumlah,
          tanggal: p.tanggal,
          keterangan,
          kategori: 'iuran',
          input_oleh: 'migrated'
        }
      })
      created++
    } catch (error: any) {
      console.error(`   ❌ ${keterangan}: ${error.message}`)
    }
  }

  // Summary
  console.log('\n═══════════════════════════════════════')
  console.log('📊 RINGKASAN')
  console.log('═══════════════════════════════════════')
  console.log(`   ✅ Dibuat: ${created}`)
  console.log(`   ⏭️  Skip (sudah ada): ${skipped}`)
  console.log('═══════════════════════════════════════\n')

  await prisma.$disconnect()
  console.log('✅ Selesai!')
}

main().catch((error) => {
  console.error('❌ Gagal:', error)
  prisma.$disconnect()
  process.exit(1)
})
