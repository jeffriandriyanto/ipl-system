import prisma from '../../utils/prisma'

// GET /api/rumah - List all rumah for a tenant
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tenant_id = query.tenant_id as string
  const blok = query.blok as string
  const status = query.status as string
  const has_saldo_lebih = query.has_saldo_lebih as string

  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id wajib diisi'
    })
  }

  try {
    const where: any = { tenant_id }
    if (blok) where.blok = blok
    if (status) where.status = status
    if (has_saldo_lebih === 'true') where.saldo_lebih = { gt: 0 }

    const rumah = await prisma.rumah.findMany({
      where,
      orderBy: [
        { blok: 'asc' },
        { nomor: 'asc' }
      ]
    })

    return rumah
  } catch (error) {
    console.error('Error fetching rumah:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengambil data rumah'
    })
  }
})
