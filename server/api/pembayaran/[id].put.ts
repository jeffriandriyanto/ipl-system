import prisma from '../../utils/prisma'
import { createAuditLog } from '../../utils/audit'

// PUT /api/pembayaran/:id - Update pembayaran
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { jumlah, tanggal, metode, keterangan } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID pembayaran wajib diisi'
    })
  }

  try {
    // Get old pembayaran
    const oldPembayaran = await prisma.pembayaran.findUnique({
      where: { id },
      include: { tagihan: true, rumah: true }
    })

    if (!oldPembayaran) {
      throw createError({
        statusCode: 404,
        message: 'Pembayaran tidak ditemukan'
      })
    }

    const oldJumlah = oldPembayaran.jumlah
    const newJumlah = jumlah || oldJumlah

    // Update pembayaran
    const pembayaran = await prisma.pembayaran.update({
      where: { id },
      data: {
        jumlah: newJumlah,
        tanggal: tanggal ? new Date(tanggal) : undefined,
        metode: metode || undefined,
        keterangan: keterangan !== undefined ? keterangan : undefined
      }
    })

    // Update tagihan if jumlah changed
    if (newJumlah !== oldJumlah && oldPembayaran.tagihan) {
      const tagihan = oldPembayaran.tagihan
      const diff = newJumlah - oldJumlah
      const newTotalBayar = tagihan.total_bayar + diff
      const newSelisih = newTotalBayar - tagihan.total_tagihan
      const newStatus = newTotalBayar === 0 ? 'belum_bayar' :
                        newSelisih >= 0 ? (newSelisih > 0 ? 'lebih' : 'lunas') : 'kurang'

      await prisma.tagihan.update({
        where: { id: tagihan.id },
        data: {
          total_bayar: newTotalBayar,
          selisih: newSelisih,
          status: newStatus,
          saldo_lebih: newSelisih > 0 ? newSelisih : 0
        }
      })

      // Update saldo_lebih di rumah
      if (oldPembayaran.rumah) {
        const rumah = oldPembayaran.rumah
        if (diff > 0 && newSelisih > 0) {
          // Increase saldo_lebih
          await prisma.rumah.update({
            where: { id: rumah.id },
            data: { saldo_lebih: { increment: diff } }
          })
        } else if (diff < 0 && rumah.saldo_lebih > 0) {
          // Decrease saldo_lebih
          const decrease = Math.min(Math.abs(diff), rumah.saldo_lebih)
          await prisma.rumah.update({
            where: { id: rumah.id },
            data: { saldo_lebih: { decrement: decrease } }
          })
        }
      }
    }

    // Update corresponding kas_masuk
    const kasKeterangan = `Pembayaran IPL ${oldPembayaran.rumah?.blok || ''}-${oldPembayaran.rumah?.nomor || ''} periode ${oldPembayaran.periode}`
    await prisma.kasTransaksi.updateMany({
      where: {
        tenant_id: oldPembayaran.tenant_id,
        keterangan: kasKeterangan,
        tipe: 'masuk',
        kategori: 'iuran'
      },
      data: {
        jumlah: newJumlah,
        tanggal: tanggal ? new Date(tanggal) : undefined
      }
    })

    // Audit log
    await createAuditLog({
      tenant_id: oldPembayaran.tenant_id,
      aksi: 'update',
      koleksi: 'pembayaran',
      dokumen_id: id,
      perubahan: {
        before: { jumlah: oldJumlah, tanggal: oldPembayaran.tanggal, metode: oldPembayaran.metode },
        after: { jumlah: newJumlah, tanggal, metode }
      },
      user_id: 'admin',
      user_nama: 'Admin'
    })

    return pembayaran
  } catch (error) {
    console.error('Error updating pembayaran:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengupdate pembayaran'
    })
  }
})
