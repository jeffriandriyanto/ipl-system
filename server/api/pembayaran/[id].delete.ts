import prisma from '../../utils/prisma'
import { createAuditLog } from '../../utils/audit'

// DELETE /api/pembayaran/:id - Delete pembayaran
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID pembayaran wajib diisi'
    })
  }

  try {
    // Get pembayaran with tagihan info
    const pembayaran = await prisma.pembayaran.findUnique({
      where: { id },
      include: { tagihan: true, rumah: true }
    })

    if (!pembayaran) {
      throw createError({
        statusCode: 404,
        message: 'Pembayaran tidak ditemukan'
      })
    }

    // Delete pembayaran
    await prisma.pembayaran.delete({ where: { id } })

    // Reverse tagihan update
    const tagihan = pembayaran.tagihan
    if (tagihan) {
      const newTotalBayar = Math.max(0, tagihan.total_bayar - pembayaran.jumlah)
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
      if (pembayaran.rumah && pembayaran.jumlah > tagihan.total_tagihan) {
        const excess = pembayaran.jumlah - tagihan.total_tagihan
        await prisma.rumah.update({
          where: { id: pembayaran.rumah_id },
          data: { saldo_lebih: { decrement: Math.min(excess, pembayaran.rumah.saldo_lebih) } }
        })
      }
    }

    // Delete corresponding kas_masuk
    const kasKeterangan = `Pembayaran IPL ${pembayaran.rumah?.blok || ''}-${pembayaran.rumah?.nomor || ''} periode ${pembayaran.periode}`
    await prisma.kasTransaksi.deleteMany({
      where: {
        tenant_id: pembayaran.tenant_id,
        keterangan: kasKeterangan,
        tipe: 'masuk',
        kategori: 'iuran'
      }
    })

    // Audit log
    await createAuditLog({
      tenant_id: pembayaran.tenant_id,
      aksi: 'delete',
      koleksi: 'pembayaran',
      dokumen_id: id,
      perubahan: {
        before: {
          rumah: `${pembayaran.rumah?.blok || ''}-${pembayaran.rumah?.nomor || ''}`,
          periode: pembayaran.periode,
          jumlah: pembayaran.jumlah
        }
      },
      user_id: 'admin',
      user_nama: 'Admin'
    })

    return { message: 'Pembayaran berhasil dihapus' }
  } catch (error) {
    console.error('Error deleting pembayaran:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal menghapus pembayaran'
    })
  }
})
