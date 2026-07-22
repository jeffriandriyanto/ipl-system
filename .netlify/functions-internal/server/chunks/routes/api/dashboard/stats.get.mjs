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
const stats_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const tenant_id = query.tenant_id;
  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: "tenant_id wajib diisi"
    });
  }
  try {
    const currentPeriod = await prisma.periode.findFirst({
      where: {
        tenant_id,
        status: "draft"
      },
      orderBy: { periode: "desc" }
    });
    const totalRumah = await prisma.rumah.count({
      where: {
        tenant_id,
        status: "aktif"
      }
    });
    let sudahBayar = 0;
    let belumBayar = 0;
    let totalTerkumpul = 0;
    if (currentPeriod) {
      sudahBayar = await prisma.tagihan.count({
        where: {
          tenant_id,
          periode_id: currentPeriod.id,
          status: { in: ["lunas", "lebih"] }
        }
      });
      belumBayar = await prisma.tagihan.count({
        where: {
          tenant_id,
          periode_id: currentPeriod.id,
          status: { in: ["belum_bayar", "kurang"] }
        }
      });
      const payments = await prisma.pembayaran.aggregate({
        where: {
          tenant_id,
          periode: currentPeriod.periode
        },
        _sum: {
          jumlah: true
        }
      });
      totalTerkumpul = payments._sum.jumlah || 0;
    }
    return {
      totalRumah,
      sudahBayar,
      belumBayar,
      totalTerkumpul
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal mengambil data dashboard"
    });
  }
});

export { stats_get as default };
//# sourceMappingURL=stats.get.mjs.map
