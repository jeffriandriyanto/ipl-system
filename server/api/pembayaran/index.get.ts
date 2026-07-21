import prisma from '../../utils/prisma'

// GET /api/pembayaran - Get pembayaran list
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tenant_id = query.tenant_id as string
  const periode = query.periode as string
  const rumah_id = query.rumah_id as string

  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id wajib diisi'
    })
  }

  try {
    const where: any = { tenant_id }
    if (periode) where.periode = periode
    if (rumah_id) where.rumah_id = rumah_id

    const pembayaran = await prisma.pembayaran.findMany({
      where,
      include: {
        rumah: {
          select: {
            blok: true,
            nomor: true,
            pic_nama: true
          }
        }
      },
      orderBy: { tanggal: 'desc' }
    })

    return pembayaran
  } catch (error) {
    console.error('Error fetching pembayaran:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengambil data pembayaran'
    })
  }
})
