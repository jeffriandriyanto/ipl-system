/**
 * Audit trail utility for IPL System
 */

import prisma from './prisma'

interface AuditLogData {
  tenant_id: string
  aksi: 'create' | 'update' | 'delete'
  koleksi: string
  dokumen_id: string
  perubahan: {
    before?: Record<string, unknown>
    after?: Record<string, unknown>
  }
  user_id: string
  user_nama: string
}

/**
 * Create audit log entry
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        tenant_id: data.tenant_id,
        aksi: data.aksi,
        koleksi: data.koleksi,
        dokumen_id: data.dokumen_id,
        perubahan: data.perubahan,
        user_id: data.user_id,
        user_nama: data.user_nama
      }
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
    // Don't throw - audit logging should not break main flow
  }
}

/**
 * Get audit logs for a tenant
 */
export async function getAuditLogs(
  tenantId: string,
  options?: {
    koleksi?: string
    user_id?: string
    startDate?: Date
    endDate?: Date
    page?: number
    limit?: number
  }
) {
  const where: Record<string, unknown> = { tenant_id: tenantId }

  if (options?.koleksi) {
    where.koleksi = options.koleksi
  }
  if (options?.user_id) {
    where.user_id = options.user_id
  }
  if (options?.startDate || options?.endDate) {
    where.timestamp = {}
    if (options.startDate) {
      (where.timestamp as Record<string, unknown>).gte = options.startDate
    }
    if (options.endDate) {
      (where.timestamp as Record<string, unknown>).lte = options.endDate
    }
  }

  const page = options?.page || 1
  const limit = options?.limit || 50
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
}
