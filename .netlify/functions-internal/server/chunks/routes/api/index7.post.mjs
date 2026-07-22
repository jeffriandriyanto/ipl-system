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
  const { tenant_id, email, nama, role, telepon } = body;
  if (!tenant_id || !email || !nama || !role) {
    throw createError({
      statusCode: 400,
      message: "tenant_id, email, nama, dan role wajib diisi"
    });
  }
  if (!["admin", "petugas"].includes(role)) {
    throw createError({
      statusCode: 400,
      message: "Role harus admin atau petugas"
    });
  }
  try {
    const existing = await prisma.user.findFirst({
      where: {
        tenant_id,
        email
      }
    });
    if (existing) {
      throw createError({
        statusCode: 400,
        message: "Email sudah terdaftar"
      });
    }
    const user = await prisma.user.create({
      data: {
        tenant_id,
        email,
        nama,
        role,
        telepon: telepon || null,
        status: "aktif"
      }
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal membuat user"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index7.post.mjs.map
