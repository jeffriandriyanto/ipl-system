import { d as defineEventHandler, a as getRouterParam, r as readBody, c as createError, p as prisma } from '../../../nitro/nitro.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "ID tagihan wajib diisi"
    });
  }
  try {
    const tagihan = await prisma.tagihan.update({
      where: { id },
      data: body
    });
    return tagihan;
  } catch (error) {
    console.error("Error updating tagihan:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal mengupdate tagihan"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
