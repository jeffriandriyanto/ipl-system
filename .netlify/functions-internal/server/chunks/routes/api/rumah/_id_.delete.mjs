import { d as defineEventHandler, a as getRouterParam, c as createError, p as prisma, b as createAuditLog } from '../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
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
    const tagihanCount = await prisma.tagihan.count({
      where: { rumah_id: id }
    });
    if (tagihanCount > 0) {
      throw createError({
        statusCode: 400,
        message: "Rumah tidak bisa dihapus karena sudah memiliki tagihan"
      });
    }
    const pembayaranCount = await prisma.pembayaran.count({
      where: { rumah_id: id }
    });
    if (pembayaranCount > 0) {
      throw createError({
        statusCode: 400,
        message: "Rumah tidak bisa dihapus karena sudah memiliki pembayaran"
      });
    }
    await prisma.rumah.delete({
      where: { id }
    });
    await createAuditLog({
      tenant_id: existing.tenant_id,
      aksi: "delete",
      koleksi: "rumah",
      dokumen_id: id,
      perubahan: {
        before: { blok: existing.blok, nomor: existing.nomor, tipe: existing.tipe, pic_nama: existing.pic_nama }
      },
      user_id: "admin",
      user_nama: "Admin"
    });
    return { message: "Rumah berhasil dihapus" };
  } catch (error) {
    console.error("Error deleting rumah:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal menghapus rumah"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
