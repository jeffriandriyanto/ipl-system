import { d as defineEventHandler, a as getRouterParam, c as createError, p as prisma } from '../../../nitro/nitro.mjs';
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
      message: "ID user wajib diisi"
    });
  }
  try {
    const existing = await prisma.user.findUnique({
      where: { id }
    });
    if (!existing) {
      throw createError({
        statusCode: 404,
        message: "User tidak ditemukan"
      });
    }
    await prisma.user.delete({
      where: { id }
    });
    return { message: "User berhasil dihapus" };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal menghapus user"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
