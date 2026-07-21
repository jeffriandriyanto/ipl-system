import prisma from '../../utils/prisma'

// DELETE /api/kategori/:id - Delete kategori
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID kategori wajib diisi'
    })
  }

  try {
    // Check if kategori exists
    const existing = await prisma.kategoriIuran.findUnique({
      where: { id }
    })

    if (!existing) {
      throw createError({
        statusCode: 404,
        message: 'Kategori tidak ditemukan'
      })
    }

    // Check if kategori is used in tagihan
    const tagihanCount = await prisma.tagihanDetail.count({
      where: { kategori_id: id }
    })

    if (tagihanCount > 0) {
      throw createError({
        statusCode: 400,
        message: 'Kategori tidak bisa dihapus karena sudah digunakan dalam tagihan'
      })
    }

    await prisma.kategoriIuran.delete({
      where: { id }
    })

    return { message: 'Kategori berhasil dihapus' }
  } catch (error) {
    console.error('Error deleting kategori:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal menghapus kategori'
    })
  }
})
