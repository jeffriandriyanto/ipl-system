import { d as defineEventHandler, r as readBody, c as createError, p as prisma } from '../../nitro/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { tenant_id, tipe, jumlah, tanggal, keterangan, kategori } = body;
  if (!tenant_id || !tipe || !jumlah || !tanggal) {
    throw createError({
      statusCode: 400,
      message: "tenant_id, tipe, jumlah, dan tanggal wajib diisi"
    });
  }
  if (!["masuk", "keluar"].includes(tipe)) {
    throw createError({
      statusCode: 400,
      message: "Tipe harus masuk atau keluar"
    });
  }
  if (jumlah <= 0) {
    throw createError({
      statusCode: 400,
      message: "Jumlah harus lebih dari 0"
    });
  }
  try {
    const kas = await prisma.kasTransaksi.create({
      data: {
        tenant_id,
        tipe,
        jumlah,
        tanggal: new Date(tanggal),
        keterangan: keterangan || null,
        kategori: kategori || "lainnya",
        input_oleh: "admin"
        // TODO: get from auth
      }
    });
    return kas;
  } catch (error) {
    console.error("Error creating kas:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal membuat transaksi kas"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
