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
  const periode = query.periode;
  const status = query.status;
  if (!tenant_id || !periode) {
    throw createError({
      statusCode: 400,
      message: "tenant_id dan periode wajib diisi"
    });
  }
  try {
    const periodData = await prisma.periode.findFirst({
      where: { tenant_id, periode }
    });
    if (!periodData) {
      throw createError({
        statusCode: 404,
        message: "Periode tidak ditemukan"
      });
    }
    const where = {
      tenant_id,
      periode_id: periodData.id
    };
    if (status) {
      where.status = status;
    }
    const tagihan = await prisma.tagihan.findMany({
      where,
      include: { items: true },
      orderBy: [
        { blok: "asc" },
        { nomor_rumah: "asc" }
      ]
    });
    const summary = {
      total_rumah: tagihan.length,
      total_tagihan: tagihan.reduce((sum, t) => sum + t.total_tagihan, 0),
      total_bayar: tagihan.reduce((sum, t) => sum + t.total_bayar, 0),
      lunas: tagihan.filter((t) => t.status === "lunas" || t.status === "lebih").length,
      belum_lunas: tagihan.filter((t) => (t.status === "belum_bayar" || t.status === "kurang") && !t.is_exempt).length,
      exempt: tagihan.filter((t) => t.is_exempt).length
    };
    return {
      periode: periodData,
      summary,
      data: tagihan
    };
  } catch (error) {
    console.error("Error fetching tagihan:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal mengambil data tagihan"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index8.get.mjs.map
