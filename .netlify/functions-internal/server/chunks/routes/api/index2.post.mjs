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
  const { tenant_id, nama, tipe, tarif_flat, tarif_per_m3, minimum_kuota, minimum_tarif } = body;
  if (!tenant_id || !nama || !tipe) {
    throw createError({
      statusCode: 400,
      message: "tenant_id, nama, dan tipe wajib diisi"
    });
  }
  if (!["flat", "meteran"].includes(tipe)) {
    throw createError({
      statusCode: 400,
      message: "Tipe harus flat atau meteran"
    });
  }
  if (tipe === "flat" && (!tarif_flat || tarif_flat <= 0)) {
    throw createError({
      statusCode: 400,
      message: "Tarif flat harus lebih dari 0"
    });
  }
  if (tipe === "meteran") {
    if (!tarif_per_m3 || tarif_per_m3 <= 0) {
      throw createError({
        statusCode: 400,
        message: "Tarif per m\xB3 harus lebih dari 0"
      });
    }
    if (!minimum_kuota || minimum_kuota <= 0) {
      throw createError({
        statusCode: 400,
        message: "Minimum kuota harus lebih dari 0"
      });
    }
    if (!minimum_tarif || minimum_tarif <= 0) {
      throw createError({
        statusCode: 400,
        message: "Minimum tarif harus lebih dari 0"
      });
    }
  }
  try {
    const existing = await prisma.kategoriIuran.findFirst({
      where: {
        tenant_id,
        nama
      }
    });
    if (existing) {
      throw createError({
        statusCode: 400,
        message: "Kategori dengan nama tersebut sudah ada"
      });
    }
    const kategori = await prisma.kategoriIuran.create({
      data: {
        tenant_id,
        nama,
        tipe,
        tarif_flat: tipe === "flat" ? tarif_flat : 0,
        tarif_per_m3: tipe === "meteran" ? tarif_per_m3 : 0,
        minimum_kuota: tipe === "meteran" ? minimum_kuota : 0,
        minimum_tarif: tipe === "meteran" ? minimum_tarif : 0,
        status: "aktif"
      }
    });
    return kategori;
  } catch (error) {
    console.error("Error creating kategori:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal membuat kategori"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index2.post.mjs.map
