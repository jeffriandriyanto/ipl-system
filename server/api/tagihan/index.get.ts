import prisma from '../../utils/prisma'

// GET /api/tagihan - Get tagihan list for a period
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tenant_id = query.tenant_id as string
  const periode = query.periode as string
  const status = query.status as string

  if (!tenant_id || !periode) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id dan periode wajib diisi'
    })
  }

  try {
    // Get period
    const periodData = await prisma.periode.findFirst({
      where: { tenant_id, periode }
    })

    if (!periodData) {
      throw createError({
        statusCode: 404,
        message: 'Periode tidak ditemukan'
      })
    }

    const where: any = {
      tenant_id,
      periode_id: periodData.id
    }

    if (status) {
      where.status = status
    }

    const tagihan = await prisma.tagihan.findMany({
      where,
      include: { items: true },
      orderBy: [
        { blok: 'asc' },
        { nomor_rumah: 'asc' }
      ]
    })

    // Calculate summary
    const summary = {
      total_rumah: tagihan.length,
      total_tagihan: tagihan.reduce((sum, t) => sum + t.total_tagihan, 0),
      total_bayar: tagihan.reduce((sum, t) => sum + t.total_bayar, 0),
      lunas: tagihan.filter(t => t.status === 'lunas' || t.status === 'lebih').length,
      belum_lunas: tagihan.filter(t => t.status === 'belum_bayar' || t.status === 'kurang').length
    }

    return {
      periode: periodData,
      summary,
      data: tagihan
    }
  } catch (error) {
    console.error('Error fetching tagihan:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengambil data tagihan'
    })
  }
})
