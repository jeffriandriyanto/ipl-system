import { d as defineEventHandler, a as getRouterParam, r as readBody, c as createError, p as prisma, b as createAuditLog } from '../../../nitro/nitro.mjs';
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
  const {
    blok,
    nomor,
    alamat,
    tipe,
    status,
    pic_nama,
    pic_telepon,
    pic_email,
    pemilik_nama,
    pemilik_telepon,
    kategori_iuran,
    keterangan
  } = body;
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "ID rumah wajib diisi"
    });
  }
  try {
    const existing = await prisma.rumah.findUnique({
      where: { id }
    });
    if (!existing) {
      throw createError({
        statusCode: 404,
        message: "Rumah tidak ditemukan"
      });
    }
    if (tipe && !["pribadi", "kontrakan", "fasum"].includes(tipe)) {
      throw createError({
        statusCode: 400,
        message: "Tipe harus pribadi, kontrakan, atau fasum"
      });
    }
    if (status && !["aktif", "nonaktif"].includes(status)) {
      throw createError({
        statusCode: 400,
        message: "Status harus aktif atau nonaktif"
      });
    }
    if (blok && blok !== existing.blok || nomor && nomor !== existing.nomor) {
      const namaExists = await prisma.rumah.findFirst({
        where: {
          tenant_id: existing.tenant_id,
          blok: blok || existing.blok,
          nomor: nomor || existing.nomor,
          id: { not: id }
        }
      });
      if (namaExists) {
        throw createError({
          statusCode: 400,
          message: "Rumah dengan blok dan nomor tersebut sudah ada"
        });
      }
    }
    const updateData = {};
    if (blok) updateData.blok = blok;
    if (nomor) updateData.nomor = nomor;
    if (alamat !== void 0) updateData.alamat = alamat || null;
    if (tipe) updateData.tipe = tipe;
    if (status) updateData.status = status;
    if (pic_nama !== void 0) updateData.pic_nama = pic_nama || null;
    if (pic_telepon !== void 0) updateData.pic_telepon = pic_telepon || null;
    if (pic_email !== void 0) updateData.pic_email = pic_email || null;
    if (pemilik_nama !== void 0) updateData.pemilik_nama = pemilik_nama || null;
    if (pemilik_telepon !== void 0) updateData.pemilik_telepon = pemilik_telepon || null;
    if (kategori_iuran) updateData.kategori_iuran = kategori_iuran;
    if (keterangan !== void 0) updateData.keterangan = keterangan || null;
    const rumah = await prisma.rumah.update({
      where: { id },
      data: updateData
    });
    await createAuditLog({
      tenant_id: existing.tenant_id,
      aksi: "update",
      koleksi: "rumah",
      dokumen_id: id,
      perubahan: {
        before: { blok: existing.blok, nomor: existing.nomor, tipe: existing.tipe, status: existing.status },
        after: updateData
      },
      user_id: "admin",
      user_nama: "Admin"
    });
    return rumah;
  } catch (error) {
    console.error("Error updating rumah:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal mengupdate rumah"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
