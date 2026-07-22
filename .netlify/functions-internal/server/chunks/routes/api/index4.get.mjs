import { d as defineEventHandler, g as getQuery, c as createError, p as prisma } from '../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const tenant_id = query.tenant_id;
  const periode = query.periode;
  if (!tenant_id || !periode) {
    throw createError({
      statusCode: 400,
      message: "tenant_id dan periode wajib diisi"
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
    const rumahList = await prisma.rumah.findMany({
      where: {
        tenant_id,
        status: "aktif"
      },
      orderBy: [
        { blok: "asc" },
        { nomor: "asc" }
      ]
    });
    const kategoriList = await prisma.kategoriIuran.findMany({
      where: { tenant_id, status: "aktif" }
    });
    const kategoriMap = new Map(kategoriList.map((k) => [k.id, k]));
    const existingTagihan = await prisma.tagihan.findMany({
      where: {
        tenant_id,
        periode_id: periodData.id
      },
      include: { items: true }
    });
    const tagihanMap = new Map(existingTagihan.map((t) => [t.rumah_id, t]));
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
    const meteranData = rumahList.map((rumah) => {
      const tagihan = tagihanMap.get(rumah.id);
      const prevTagihan = prevTagihanMap.get(rumah.id);
      const kategoriIds = rumah.kategori_iuran || [];
      const meteranItems = kategoriIds.map((katId) => {
        const kategori = kategoriMap.get(katId);
        if (!kategori || kategori.tipe !== "meteran") return null;
        const tagihanItem = tagihan == null ? void 0 : tagihan.items.find((i) => i.kategori_id === katId);
        const prevItem = prevTagihan == null ? void 0 : prevTagihan.items.find((i) => i.kategori_id === katId);
        return {
          kategori_id: katId,
          kategori_nama: kategori.nama,
          meter_lalu: (prevItem == null ? void 0 : prevItem.meter_sekarang) || 0,
          meter_sekarang: (tagihanItem == null ? void 0 : tagihanItem.meter_sekarang) || 0,
          pemakaian: (tagihanItem == null ? void 0 : tagihanItem.pemakaian) || 0,
          sudah_diinput: !!tagihanItem
        };
      }).filter(Boolean);
      return {
        rumah_id: rumah.id,
        blok: rumah.blok,
        nomor: rumah.nomor,
        tipe: rumah.tipe,
        pic_nama: rumah.pic_nama,
        status_penghuni: (tagihan == null ? void 0 : tagihan.status_penghuni) || "ada",
        meteran: meteranItems,
        sudah_ada_tagihan: !!tagihan
      };
    });
    return {
      periode: periodData,
      data: meteranData
    };
  } catch (error) {
    console.error("Error fetching meteran:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal mengambil data meteran"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index4.get.mjs.map
