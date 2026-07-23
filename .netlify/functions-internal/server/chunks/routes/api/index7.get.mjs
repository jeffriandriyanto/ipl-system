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
  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: "tenant_id wajib diisi"
    });
  }
  try {
    const settings = await prisma.settings.findUnique({
      where: { tenant_id }
    });
    return settings || {};
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal mengambil pengaturan"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index7.get.mjs.map
