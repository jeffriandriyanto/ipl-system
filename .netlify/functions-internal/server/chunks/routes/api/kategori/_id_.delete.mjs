import { d as defineEventHandler, a as getRouterParam, c as createError, p as prisma } from '../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
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
    const tagihanCount = await prisma.tagihanDetail.count({
      where: { kategori_id: id }
    });
    if (tagihanCount > 0) {
      throw createError({
        statusCode: 400,
        message: "Kategori tidak bisa dihapus karena sudah digunakan dalam tagihan"
      });
    }
    await prisma.kategoriIuran.delete({
      where: { id }
    });
    return { message: "Kategori berhasil dihapus" };
  } catch (error) {
    console.error("Error deleting kategori:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal menghapus kategori"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
