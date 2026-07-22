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

const _periode__action_post = defineEventHandler(async (event) => {
  const periode = getRouterParam(event, "periode");
  const body = await readBody(event);
  const { tenant_id, action } = body;
  if (!tenant_id || !periode || !action) {
    throw createError({
      statusCode: 400,
      message: "tenant_id, periode, dan action wajib diisi"
    });
  }
  if (!["publish", "tutup"].includes(action)) {
    throw createError({
      statusCode: 400,
      message: "Action harus publish atau tutup"
    });
  }
  try {
    const periodData = await prisma.periode.findFirst({
      where: { tenant_id, periode }
    });
    if (!periodData) {
      throw createError({
        statusCode: 404,
        message: "Periode tidak ditemukan"
      });
    }
    if (action === "publish") {
      if (periodData.status !== "draft") {
        throw createError({
          statusCode: 400,
          message: "Hanya periode dengan status draft yang bisa dipublish"
        });
      }
      const activeRumah = await prisma.rumah.count({
        where: { tenant_id, status: "aktif" }
      });
      const tagihanCount = await prisma.tagihan.count({
        where: { tenant_id, periode_id: periodData.id }
      });
      if (tagihanCount < activeRumah) {
        const missing = activeRumah - tagihanCount;
        throw createError({
          statusCode: 400,
          message: `Masih ada ${missing} rumah yang belum memiliki tagihan. Generate tagihan terlebih dahulu.`
        });
      }
      const updated = await prisma.periode.update({
        where: { id: periodData.id },
        data: { status: "published" }
      });
      return {
        message: `Periode ${periode} berhasil dipublish. Warga sudah bisa melihat tagihan.`,
        data: updated
      };
    }
    if (action === "tutup") {
      if (periodData.status !== "published") {
        throw createError({
          statusCode: 400,
          message: "Hanya periode dengan status published yang bisa ditutup"
        });
      }
      const updated = await prisma.periode.update({
        where: { id: periodData.id },
        data: {
          status: "ditutup",
          ditutup_pada: /* @__PURE__ */ new Date(),
          ditutup_oleh: "admin"
          // TODO: get from auth
        }
      });
      return {
        message: `Periode ${periode} berhasil ditutup. Data tidak bisa diubah lagi.`,
        data: updated
      };
    }
  } catch (error) {
    console.error("Error processing period action:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal memproses aksi periode"
    });
  }
});

export { _periode__action_post as default };
//# sourceMappingURL=_periode__action.post.mjs.map
