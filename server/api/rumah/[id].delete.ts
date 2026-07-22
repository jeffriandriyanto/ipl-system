import prisma from '../../utils/prisma'
import { createAuditLog } from '../../utils/audit'

// DELETE /api/rumah/:id - Delete rumah
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID rumah wajib diisi'
    })
  }

  try {
    // Check if rumah exists
    const existing = await prisma.rumah.findUnique({
      where: { id }
    })

    if (!existing) {
      throw createError({
        statusCode: 404,
        message: 'Rumah tidak ditemukan'
      })
    }

    // Check if rumah has tagihan
    const tagihanCount = await prisma.tagihan.count({
      where: { rumah_id: id }
    })

    if (tagihanCount > 0) {
      throw createError({
        statusCode: 400,
        message: 'Rumah tidak bisa dihapus karena sudah memiliki tagihan'
      })
    }

    // Check if rumah has pembayaran
    const pembayaranCount = await prisma.pembayaran.count({
      where: { rumah_id: id }
    })

    if (pembayaranCount > 0) {
      throw createError({
        statusCode: 400,
        message: 'Rumah tidak bisa dihapus karena sudah memiliki pembayaran'
      })
    }

    await prisma.rumah.delete({
      where: { id }
    })

    // Audit log
    await createAuditLog({
      tenant_id: existing.tenant_id,
      aksi: 'delete',
      koleksi: 'rumah',
      dokumen_id: id,
      perubahan: {
        before: { blok: existing.blok, nomor: existing.nomor, tipe: existing.tipe, pic_nama: existing.pic_nama }
      },
      user_id: 'admin',
      user_nama: 'Admin'
    })

    return { message: 'Rumah berhasil dihapus' }
  } catch (error) {
    console.error('Error deleting rumah:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal menghapus rumah'
    })
  }
})
