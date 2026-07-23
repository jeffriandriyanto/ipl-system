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
  const blok = query.blok;
  const status = query.status;
  const has_saldo_lebih = query.has_saldo_lebih;
  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: "tenant_id wajib diisi"
    });
  }
  try {
    const where = { tenant_id };
    if (blok) where.blok = blok;
    if (status) where.status = status;
    if (has_saldo_lebih === "true") where.saldo_lebih = { gt: 0 };
    const rumah = await prisma.rumah.findMany({
      where,
      orderBy: [
        { blok: "asc" },
        { nomor: "asc" }
      ]
    });
    return rumah;
  } catch (error) {
    console.error("Error fetching rumah:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal mengambil data rumah"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index6.get.mjs.map
