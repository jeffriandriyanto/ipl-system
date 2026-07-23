import { d as defineEventHandler, g as getQuery, c as createError, p as prisma } from '../../nitro/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';

const index_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const tenant_id = query.tenant_id;
  const koleksi = query.koleksi;
  const limit = parseInt(query.limit) || 50;
  const page = parseInt(query.page) || 1;
  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: "tenant_id wajib diisi"
    });
  }
  try {
    const where = { tenant_id };
    if (koleksi) where.koleksi = koleksi;
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: "desc" },
        skip,
        take: limit
      }),
      prisma.auditLog.count({ where })
    ]);
    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal mengambil data audit log"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
