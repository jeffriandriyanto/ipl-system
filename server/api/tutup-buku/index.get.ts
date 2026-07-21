import prisma from '../../utils/prisma'

// GET /api/tutup-buku - List periods with status
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tenant_id = query.tenant_id as string

  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id wajib diisi'
    })
  }

  try {
    const periodes = await prisma.periode.findMany({
      where: { tenant_id },
      orderBy: { periode: 'desc' }
    })

    return periodes
  } catch (error) {
    console.error('Error fetching periodes:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengambil data periode'
    })
  }
})
