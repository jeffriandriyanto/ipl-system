import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TENANT_ID = 'waris1'

async function main() {
  console.log('💰 Menghitung saldo lebih dari data existing...\n')

  // 1. Ambil semua rumah
  const allRumah = await prisma.rumah.findMany({
    where: { tenant_id: TENANT_ID },
    orderBy: [{ blok: 'asc' }, { nomor: 'asc' }]
  })
  console.log(`📦 Total rumah: ${allRumah.length}\n`)

  // 2. Ambil semua periode (Mei 2026 ke atas)
  const periodes = await prisma.periode.findMany({
    where: {
      tenant_id: TENANT_ID,
      periode: { gte: '2026-05' }
    },
    orderBy: { periode: 'asc' }
  })
  console.log(`📅 Periode: ${periodes.map(p => p.periode).join(', ')}\n`)

  // 3. Ambil semua pembayaran
  const allPembayaran = await prisma.pembayaran.findMany({
    where: { tenant_id: TENANT_ID }
  })

  // Index pembayaran by rumah_id + periode
  const pembayaranMap = new Map<string, number>()
  for (const p of allPembayaran) {
    const key = `${p.rumah_id}_${p.periode}`
    pembayaranMap.set(key, (pembayaranMap.get(key) || 0) + p.jumlah)
  }

  // 4. Ambil semua tagihan
  const allTagihan = await prisma.tagihan.findMany({
    where: {
      tenant_id: TENANT_ID,
      periode_id: { in: periodes.map(p => p.id) }
    }
  })

  // Index tagihan by rumah_id + periode
  const tagihanMap = new Map<string, typeof allTagihan[0]>()
  for (const t of allTagihan) {
    const periode = periodes.find(p => p.id === t.periode_id)
    if (periode) {
      tagihanMap.set(`${t.rumah_id}_${periode.periode}`, t)
    }
  }

  // 5. Hitung saldo lebih per rumah
  console.log('📊 Menghitung saldo lebih...\n')
  let totalUpdated = 0
  let totalSaldoLebih = 0

  for (const rumah of allRumah) {
    let runningBalance = 0

    for (const periode of periodes) {
      const tagihanKey = `${rumah.id}_${periode.periode}`
      const tagihan = tagihanMap.get(tagihanKey)
      const pembayaran = pembayaranMap.get(tagihanKey) || 0

      if (!tagihan) continue

      // Hitung total yang harus dibayar
      const totalTagihan = tagihan.total_tagihan

      // Hitung sisa dari periode sebelumnya + pembayaran periode ini
      const totalAvailable = runningBalance + pembayaran

      if (totalAvailable >= totalTagihan) {
        // Lunas atau lebih
        const excess = totalAvailable - totalTagihan
        runningBalance = excess

        // Update tagihan
        await prisma.tagihan.update({
          where: { id: tagihan.id },
          data: {
            total_bayar: Math.min(totalAvailable, totalTagihan + (excess > 0 ? excess : 0)),
            selisih: excess,
            status: excess > 0 ? 'lebih' : 'lunas',
            saldo_lebih: excess
          }
        })
      } else {
        // Kurang atau belum bayar
        const deficit = totalTagihan - totalAvailable
        runningBalance = 0

        // Update tagihan
        await prisma.tagihan.update({
          where: { id: tagihan.id },
          data: {
            total_bayar: totalAvailable,
            selisih: -deficit,
            status: totalAvailable > 0 ? 'kurang' : 'belum_bayar',
            saldo_lebih: 0
          }
        })
      }
    }

    // Update saldo_lebih di rumah
    const finalBalance = runningBalance
    if (finalBalance > 0) {
      await prisma.rumah.update({
        where: { id: rumah.id },
        data: { saldo_lebih: finalBalance }
      })
      totalUpdated++
      totalSaldoLebih += finalBalance

      console.log(`   ✅ ${rumah.blok}-${rumah.nomor}: saldo lebih ${formatRupiah(finalBalance)}`)
    }
  }

  // Summary
  console.log('\n═══════════════════════════════════════')
  console.log('📊 RINGKASAN SALDO LEBIH')
  console.log('═══════════════════════════════════════')
  console.log(`   🏠 Rumah dengan saldo lebih: ${totalUpdated}`)
  console.log(`   💰 Total saldo lebih: ${formatRupiah(totalSaldoLebih)}`)
  console.log('═══════════════════════════════════════\n')

  await prisma.$disconnect()
  console.log('✅ Perhitungan saldo lebih selesai!')
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

main().catch((error) => {
  console.error('❌ Gagal menghitung saldo lebih:', error)
  prisma.$disconnect()
  process.exit(1)
})
