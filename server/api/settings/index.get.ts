import prisma from '../../utils/prisma'

// GET /api/settings - Get settings for a tenant
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
    const settings = await prisma.settings.findUnique({
      where: { tenant_id }
    })

    return settings || {}
  } catch (error) {
    console.error('Error fetching settings:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengambil pengaturan'
    })
  }
})
