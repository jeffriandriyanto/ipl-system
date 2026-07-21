import prisma from '../../utils/prisma'

// GET /api/audit-log - List audit logs
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tenant_id = query.tenant_id as string
  const koleksi = query.koleksi as string
  const limit = parseInt(query.limit as string) || 50
  const page = parseInt(query.page as string) || 1

  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id wajib diisi'
    })
  }

  try {
    const where: any = { tenant_id }
    if (koleksi) where.koleksi = koleksi

    const skip = (page - 1) * limit

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit
      }),
      prisma.auditLog.count({ where })
    ])

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengambil data audit log'
    })
  }
})
