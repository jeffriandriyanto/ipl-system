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
  const { nama, role, telepon, status } = body;
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
    if (role && !["admin", "petugas"].includes(role)) {
      throw createError({
        statusCode: 400,
        message: "Role harus admin atau petugas"
      });
    }
    if (status && !["aktif", "nonaktif"].includes(status)) {
      throw createError({
        statusCode: 400,
        message: "Status harus aktif atau nonaktif"
      });
    }
    const updateData = {};
    if (nama) updateData.nama = nama;
    if (role) updateData.role = role;
    if (telepon !== void 0) updateData.telepon = telepon || null;
    if (status) updateData.status = status;
    const user = await prisma.user.update({
      where: { id },
      data: updateData
    });
    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal mengupdate user"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
