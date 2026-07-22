import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TENANT_ID = 'waris1'

async function main() {
  console.log('🔧 Fix tanggal kas_transaksi migrated...\n')

  // Ambil semua kas iuran migrated
  const kasMigrated = await prisma.kasTransaksi.findMany({
    where: { 
      tenant_id: TENANT_ID,
      kategori: 'iuran',
      input_oleh: 'migrated'
    }
  })
  console.log(`📦 Kas migrated: ${kasMigrated.length}\n`)

  let updated = 0
  let skipped = 0

  for (const kas of kasMigrated) {
    // Extract periode from keterangan: "Pembayaran IPL X-Y periode 2026-06"
    const match = kas.keterangan?.match(/periode (\d{4}-\d{2})/)
    if (!match) {
      skipped++
      continue
    }

    const periode = match[1]
    const [year, month] = periode.split('-').map(Number)
    
    // Set tanggal ke tanggal 15 bulan periode (tengah bulan)
    const correctDate = new Date(year, month - 1, 15)
    
    // Check if already correct
    const currentMonth = kas.tanggal.getMonth()
    const currentYear = kas.tanggal.getFullYear()
    
    if (currentMonth === month - 1 && currentYear === year) {
      skipped++
      continue
    }

    await prisma.kasTransaksi.update({
      where: { id: kas.id },
      data: { tanggal: correctDate }
    })
    updated++
  }

  console.log('\n═══════════════════════════════════════')
  console.log('📊 RINGKASAN')
  console.log('═══════════════════════════════════════')
  console.log(`   ✅ Updated: ${updated}`)
  console.log(`   ⏭️  Skip (sudah benar): ${skipped}`)
  console.log('═══════════════════════════════════════\n')

  await prisma.$disconnect()
  console.log('✅ Selesai!')
}

main().catch((error) => {
  console.error('❌ Gagal:', error)
  prisma.$disconnect()
  process.exit(1)
})
