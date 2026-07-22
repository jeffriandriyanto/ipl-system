import { d as defineEventHandler, r as readBody, c as createError, p as prisma, h as hitungTagihanKategori } from '../../nitro/nitro.mjs';
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
  const { tenant_id, periode, rumah_id, status_penghuni, items } = body;
  if (!tenant_id || !periode || !rumah_id) {
    throw createError({
      statusCode: 400,
      message: "tenant_id, periode, dan rumah_id wajib diisi"
    });
  }
  try {
    let period = await prisma.periode.findFirst({
      where: { tenant_id, periode }
    });
    if (!period) {
      period = await prisma.periode.create({
        data: {
          tenant_id,
          periode,
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
    const rumah = await prisma.rumah.findUnique({
      where: { id: rumah_id }
    });
    if (!rumah) {
      throw createError({
        statusCode: 404,
        message: "Rumah tidak ditemukan"
      });
    }
    const kategoriList = await prisma.kategoriIuran.findMany({
      where: { tenant_id, status: "aktif" }
    });
    const kategoriMap = new Map(kategoriList.map((k) => [k.id, k]));
    const tagihanItems = [];
    let totalTagihan = 0;
    if (status_penghuni === "kosong") {
      tagihanItems.push(...(rumah.kategori_iuran || []).map((katId) => {
        const kategori = kategoriMap.get(katId);
        if (!kategori) return null;
        return {
          kategori_id: katId,
          kategori_nama: kategori.nama,
          tipe: kategori.tipe,
          meter_lalu: null,
          meter_sekarang: null,
          pemakaian: null,
          jumlah_tagihan: 0
        };
      }).filter(Boolean));
    } else {
      for (const item of items || []) {
        const kategori = kategoriMap.get(item.kategori_id);
        if (!kategori) continue;
        let tagihan2 = 0;
        let pemakaian = 0;
        if (kategori.tipe === "meteran") {
          pemakaian = (item.meter_sekarang || 0) - (item.meter_lalu || 0);
          if (pemakaian < 0) pemakaian = 0;
          tagihan2 = hitungTagihanKategori(kategori, item.meter_lalu, item.meter_sekarang);
        } else {
          tagihan2 = hitungTagihanKategori(kategori);
        }
        tagihanItems.push({
          kategori_id: item.kategori_id,
          kategori_nama: kategori.nama,
          tipe: kategori.tipe,
          meter_lalu: item.meter_lalu || null,
          meter_sekarang: item.meter_sekarang || null,
          pemakaian: kategori.tipe === "meteran" ? pemakaian : null,
          jumlah_tagihan: tagihan2
        });
        totalTagihan += tagihan2;
      }
    }
    const existingTagihan = await prisma.tagihan.findFirst({
      where: {
        tenant_id,
        periode_id: period.id,
        rumah_id
      }
    });
    let tagihan;
    if (existingTagihan) {
      await prisma.tagihanDetail.deleteMany({
        where: { tagihan_id: existingTagihan.id }
      });
      tagihan = await prisma.tagihan.update({
        where: { id: existingTagihan.id },
        data: {
          status_penghuni: status_penghuni || "ada",
          pic_nama: rumah.pic_nama,
          pic_telepon: rumah.pic_telepon,
          total_tagihan: totalTagihan,
          selisih: existingTagihan.total_bayar - totalTagihan,
          status: existingTagihan.total_bayar === 0 ? "belum_bayar" : existingTagihan.total_bayar >= totalTagihan ? "lunas" : "kurang",
          items: {
            create: tagihanItems
          }
        },
        include: { items: true }
      });
    } else {
      tagihan = await prisma.tagihan.create({
        data: {
          tenant_id,
          periode_id: period.id,
          rumah_id,
          blok: rumah.blok,
          nomor_rumah: rumah.nomor,
          tipe_rumah: rumah.tipe,
          status_penghuni: status_penghuni || "ada",
          pic_nama: rumah.pic_nama,
          pic_telepon: rumah.pic_telepon,
          total_tagihan: totalTagihan,
          total_bayar: 0,
          selisih: -totalTagihan,
          status: "belum_bayar",
          items: {
            create: tagihanItems
          }
        },
        include: { items: true }
      });
    }
    return tagihan;
  } catch (error) {
    console.error("Error inputting meteran:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal input meteran"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index3.post.mjs.map
