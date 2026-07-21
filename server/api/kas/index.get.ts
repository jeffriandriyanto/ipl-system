import prisma from '../../utils/prisma'

// GET /api/kas - List kas transactions
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tenant_id = query.tenant_id as string
  const tipe = query.tipe as string
  const bulan = query.bulan as string

  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id wajib diisi'
    })
  }

  try {
    const where: any = { tenant_id }
    if (tipe) where.tipe = tipe

    // Filter by month if provided
    if (bulan) {
      const startDate = new Date(bulan + '-01')
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + 1)

      where.tanggal = {
        gte: startDate,
        lt: endDate
      }
    }

    const kas = await prisma.kasTransaksi.findMany({
      where,
      orderBy: { tanggal: 'desc' }
    })

    // Calculate summary
    const masuk = kas.filter(k => k.tipe === 'masuk').reduce((sum, k) => sum + k.jumlah, 0)
    const keluar = kas.filter(k => k.tipe === 'keluar').reduce((sum, k) => sum + k.jumlah, 0)

    return {
      data: kas,
      summary: {
        total_masuk: masuk,
        total_keluar: keluar,
        saldo: masuk - keluar
      }
    }
  } catch (error) {
    console.error('Error fetching kas:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengambil data kas'
    })
  }
})
