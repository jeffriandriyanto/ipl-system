import prisma from '../../utils/prisma'

// GET /api/kategori - List all kategori for a tenant
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
    const kategori = await prisma.kategoriIuran.findMany({
      where: { tenant_id },
      orderBy: { nama: 'asc' }
    })

    return kategori
  } catch (error) {
    console.error('Error fetching kategori:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengambil data kategori'
    })
  }
})
