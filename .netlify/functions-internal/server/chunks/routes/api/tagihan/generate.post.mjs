import { d as defineEventHandler, r as readBody, c as createError, h as hitungTagihanKategori } from '../../../nitro/nitro.mjs';
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
const generate_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { periode, tenant_id } = body;
  if (!periode || !tenant_id) {
    throw createError({
      statusCode: 400,
      message: "Periode dan tenant_id wajib diisi"
    });
  }
  try {
    let period = await prisma.periode.findFirst({
      where: { periode, tenant_id }
    });
    if (!period) {
      period = await prisma.periode.create({
        data: {
          periode,
          tenant_id,
          status: "draft"
        }
      });
    }
    if (period.status === "ditutup") {
      throw createError({
        statusCode: 400,
        message: "Periode sudah ditutup"
      });
    }
    const rumahList = await prisma.rumah.findMany({
      where: {
        tenant_id,
        status: "aktif"
      }
    });
    const kategoriList = await prisma.kategoriIuran.findMany({
      where: {
        tenant_id,
        status: "aktif"
      }
    });
    const kategoriMap = new Map(kategoriList.map((k) => [k.id, k]));
    const prevPeriod = await prisma.periode.findFirst({
      where: {
        tenant_id,
        periode: { lt: periode }
      },
      orderBy: { periode: "desc" }
    });
    const prevTagihanMap = /* @__PURE__ */ new Map();
    if (prevPeriod) {
      const prevTagihan = await prisma.tagihan.findMany({
        where: {
          tenant_id,
          periode_id: prevPeriod.id
        },
        include: { items: true }
      });
      prevTagihan.forEach((t) => {
        prevTagihanMap.set(t.rumah_id, t);
      });
    }
    const tagihanData = [];
    let totalTagihanAll = 0;
    let jumlahRumah = 0;
    for (const rumah of rumahList) {
      const kategoriIds = rumah.kategori_iuran || [];
      const items = [];
      let totalTagihan = 0;
      for (const kategoriId of kategoriIds) {
        const kategori = kategoriMap.get(kategoriId);
        if (!kategori) continue;
        const prevTagihan = prevTagihanMap.get(rumah.id);
        const prevItem = prevTagihan == null ? void 0 : prevTagihan.items.find((i) => i.kategori_id === kategoriId);
        let meterLalu = (prevItem == null ? void 0 : prevItem.meter_sekarang) || 0;
        let meterSekarang = 0;
        let pemakaian = 0;
        let tagihan = 0;
        if (kategori.tipe === "meteran") {
          meterSekarang = meterLalu;
          pemakaian = meterSekarang - meterLalu;
          tagihan = hitungTagihanKategori(kategori, meterLalu, meterSekarang);
        } else {
          tagihan = hitungTagihanKategori(kategori);
        }
        items.push({
          kategori_id: kategoriId,
          kategori_nama: kategori.nama,
          tipe: kategori.tipe,
          meter_lalu: kategori.tipe === "meteran" ? meterLalu : null,
          meter_sekarang: kategori.tipe === "meteran" ? meterSekarang : null,
          pemakaian: kategori.tipe === "meteran" ? pemakaian : null,
          tagihan
        });
        totalTagihan += tagihan;
      }
      tagihanData.push({
        tenant_id,
        periode_id: period.id,
        rumah_id: rumah.id,
        blok: rumah.blok,
        nomor_rumah: rumah.nomor,
        tipe_rumah: rumah.tipe,
        status_penghuni: "ada",
        pic_nama: rumah.pic_nama,
        pic_telepon: rumah.pic_telepon,
        total_tagihan: totalTagihan,
        total_bayar: 0,
        selisih: -totalTagihan,
        status: "belum_bayar",
        items
      });
      totalTagihanAll += totalTagihan;
      jumlahRumah++;
    }
    for (const data of tagihanData) {
      const existing = await prisma.tagihan.findFirst({
        where: {
          tenant_id,
          periode_id: period.id,
          rumah_id: data.rumah_id
        }
      });
      if (existing) {
        await prisma.tagihan.update({
          where: { id: existing.id },
          data: {
            total_tagihan: data.total_tagihan,
            selisih: data.selisih,
            items: {
              deleteMany: {},
              create: data.items
            }
          }
        });
      } else {
        await prisma.tagihan.create({
          data: {
            ...data,
            items: {
              create: data.items
            }
          }
        });
      }
    }
    await prisma.periode.update({
      where: { id: period.id },
      data: {
        jumlah_rumah: jumlahRumah,
        total_tagihan: totalTagihanAll
      }
    });
    return {
      success: true,
      message: `Berhasil generate ${jumlahRumah} tagihan`,
      data: {
        periode: period.periode,
        jumlah_rumah: jumlahRumah,
        total_tagihan: totalTagihanAll
      }
    };
  } catch (error) {
    console.error("Error generating tagihan:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal generate tagihan"
    });
  }
});

export { generate_post as default };
//# sourceMappingURL=generate.post.mjs.map
