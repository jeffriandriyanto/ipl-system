import { d as defineEventHandler, g as getQuery, c as createError } from '../../../nitro/nitro.mjs';
import { PrismaClient } from '@prisma/client';
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

const prisma = new PrismaClient();
const cek_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { blok, nomor } = query;
  if (!blok || !nomor) {
    throw createError({
      statusCode: 400,
      message: "Blok dan nomor rumah wajib diisi"
    });
  }
  try {
    const currentPeriod = await prisma.periode.findFirst({
      where: { status: "draft" },
      orderBy: { periode: "desc" }
    });
    if (!currentPeriod) {
      throw createError({
        statusCode: 404,
        message: "Periode aktif tidak ditemukan"
      });
    }
    const tagihan = await prisma.tagihan.findFirst({
      where: {
        blok,
        nomor_rumah: nomor,
        periode_id: currentPeriod.id
      },
      include: {
        items: true
      }
    });
    if (!tagihan) {
      return null;
    }
    return {
      ...tagihan,
      periode: currentPeriod.periode
    };
  } catch (error) {
    console.error("Error fetching tagihan:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal mengambil data tagihan"
    });
  }
});

export { cek_get as default };
//# sourceMappingURL=cek.get.mjs.map
