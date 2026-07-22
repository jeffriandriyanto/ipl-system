import { d as defineEventHandler, g as getQuery, c as createError, p as prisma } from '../../nitro/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import '@iconify/utils';
import 'consola';

const index_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const tenant_id = query.tenant_id;
  const periode = query.periode;
  const rumah_id = query.rumah_id;
  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: "tenant_id wajib diisi"
    });
  }
  try {
    const where = { tenant_id };
    if (periode) where.periode = periode;
    if (rumah_id) where.rumah_id = rumah_id;
    const pembayaran = await prisma.pembayaran.findMany({
      where,
      include: {
        rumah: {
          select: {
            blok: true,
            nomor: true,
            pic_nama: true
          }
        }
      },
      orderBy: { tanggal: "desc" }
    });
    return pembayaran;
  } catch (error) {
    console.error("Error fetching pembayaran:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal mengambil data pembayaran"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index5.get.mjs.map
