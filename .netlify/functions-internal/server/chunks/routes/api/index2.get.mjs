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
  const tipe = query.tipe;
  const bulan = query.bulan;
  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: "tenant_id wajib diisi"
    });
  }
  try {
    const where = { tenant_id };
    if (tipe) where.tipe = tipe;
    if (bulan) {
      const startDate = /* @__PURE__ */ new Date(bulan + "-01");
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      where.tanggal = {
        gte: startDate,
        lt: endDate
      };
    }
    const kas = await prisma.kasTransaksi.findMany({
      where,
      orderBy: { tanggal: "desc" }
    });
    const masuk = kas.filter((k) => k.tipe === "masuk").reduce((sum, k) => sum + k.jumlah, 0);
    const keluar = kas.filter((k) => k.tipe === "keluar").reduce((sum, k) => sum + k.jumlah, 0);
    return {
      data: kas,
      summary: {
        total_masuk: masuk,
        total_keluar: keluar,
        saldo: masuk - keluar
      }
    };
  } catch (error) {
    console.error("Error fetching kas:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal mengambil data kas"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index2.get.mjs.map
