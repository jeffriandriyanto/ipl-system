import { d as defineEventHandler, a as getRouterParam, r as readBody, c as createError, p as prisma } from '../../../nitro/nitro.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const { nama, tipe, tarif_flat, tarif_per_m3, minimum_kuota, minimum_tarif, status } = body;
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "ID kategori wajib diisi"
    });
  }
  try {
    const existing = await prisma.kategoriIuran.findUnique({
      where: { id }
    });
    if (!existing) {
      throw createError({
        statusCode: 404,
        message: "Kategori tidak ditemukan"
      });
    }
    if (tipe && !["flat", "meteran"].includes(tipe)) {
      throw createError({
        statusCode: 400,
        message: "Tipe harus flat atau meteran"
      });
    }
    if (nama && nama !== existing.nama) {
      const namaExists = await prisma.kategoriIuran.findFirst({
        where: {
          tenant_id: existing.tenant_id,
          nama,
          id: { not: id }
        }
      });
      if (namaExists) {
        throw createError({
          statusCode: 400,
          message: "Kategori dengan nama tersebut sudah ada"
        });
      }
    }
    const updateData = {};
    if (nama) updateData.nama = nama;
    if (tipe) updateData.tipe = tipe;
    if (status) updateData.status = status;
    if (tipe === "flat" || existing.tipe === "flat") {
      if (tarif_flat !== void 0) updateData.tarif_flat = tarif_flat;
    }
    if (tipe === "meteran" || existing.tipe === "meteran") {
      if (tarif_per_m3 !== void 0) updateData.tarif_per_m3 = tarif_per_m3;
      if (minimum_kuota !== void 0) updateData.minimum_kuota = minimum_kuota;
      if (minimum_tarif !== void 0) updateData.minimum_tarif = minimum_tarif;
    }
    const kategori = await prisma.kategoriIuran.update({
      where: { id },
      data: updateData
    });
    return kategori;
  } catch (error) {
    console.error("Error updating kategori:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal mengupdate kategori"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
