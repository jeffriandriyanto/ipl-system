import prisma from '../../utils/prisma'

// GET /api/users - List all users for a tenant
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
    const users = await prisma.user.findMany({
      where: { tenant_id },
      orderBy: { nama: 'asc' }
    })

    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengambil data user'
    })
  }
})
