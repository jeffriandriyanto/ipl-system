import { d as defineEventHandler, r as readBody, c as createError, p as prisma } from '../../../nitro/nitro.mjs';
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

const batch_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { tenant_id, rumah_id, periodes, jumlah, tanggal, metode, keterangan } = body;
  if (!tenant_id || !rumah_id || !periodes || !Array.isArray(periodes) || !jumlah || !tanggal) {
    throw createError({
      statusCode: 400,
      message: "tenant_id, rumah_id, periodes (array), jumlah, dan tanggal wajib diisi"
    });
  }
  if (jumlah <= 0) {
    throw createError({
      statusCode: 400,
      message: "Jumlah bayar harus lebih dari 0"
    });
  }
  if (periodes.length === 0) {
    throw createError({
      statusCode: 400,
      message: "Minimal 1 periode wajib dipilih"
    });
  }
  try {
    const rumah = await prisma.rumah.findUnique({
      where: { id: rumah_id }
    });
    if (!rumah) {
      throw createError({
        statusCode: 404,
        message: "Rumah tidak ditemukan"
      });
    }
    const tagihanList = await prisma.tagihan.findMany({
      where: {
        tenant_id,
        rumah_id,
        periode: { in: periodes }
      }
    });
    if (tagihanList.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Tagihan tidak ditemukan untuk periode yang dipilih"
      });
    }
    let sisaBayar = jumlah;
    const allocations = [];
    const sortedTagihan = tagihanList.sort((a, b) => a.periode.localeCompare(b.periode));
    for (const tagihan of sortedTagihan) {
      const sisaTagihan = Math.max(0, tagihan.total_tagihan - tagihan.total_bayar);
      const alokasi = Math.min(sisaBayar, sisaTagihan);
      if (alokasi > 0) {
        allocations.push({
          tagihan_id: tagihan.id,
          periode: tagihan.periode,
          jumlah: alokasi,
          tagihan: tagihan.total_tagihan,
          sudah_bayar: tagihan.total_bayar
        });
        sisaBayar -= alokasi;
      }
    }
    const results = await prisma.$transaction(async (tx) => {
      const pembayaranList = [];
      for (const alloc of allocations) {
        const pembayaran = await tx.pembayaran.create({
          data: {
            tenant_id,
            rumah_id,
            tagihan_id: alloc.tagihan_id,
            periode: alloc.periode,
            jumlah: alloc.jumlah,
            tanggal: new Date(tanggal),
            metode: metode || "transfer",
            keterangan: keterangan || null,
            input_oleh: "admin"
            // TODO: get from auth
          }
        });
        pembayaranList.push(pembayaran);
        const tagihan = sortedTagihan.find((t) => t.id === alloc.tagihan_id);
        if (tagihan) {
          const newTotalBayar = tagihan.total_bayar + alloc.jumlah;
          const newSelisih = newTotalBayar - tagihan.total_tagihan;
          const newStatus = newTotalBayar === 0 ? "belum_bayar" : newSelisih >= 0 ? newSelisih > 0 ? "lebih" : "lunas" : "kurang";
          await tx.tagihan.update({
            where: { id: alloc.tagihan_id },
            data: {
              total_bayar: newTotalBayar,
              selisih: newSelisih,
              status: newStatus,
              saldo_lebih: newSelisih > 0 ? newSelisih : 0
            }
          });
        }
      }
      for (const periode of periodes) {
        const periodData = await tx.periode.findFirst({
          where: { tenant_id, periode }
        });
        if (periodData) {
          const allTagihan = await tx.tagihan.findMany({
            where: { periode_id: periodData.id }
          });
          const totalTagihan = allTagihan.reduce((sum, t) => sum + t.total_tagihan, 0);
          const totalBayar = allTagihan.reduce((sum, t) => sum + t.total_bayar, 0);
          const lunasCount = allTagihan.filter((t) => t.status === "lunas" || t.status === "lebih").length;
          await tx.periode.update({
            where: { id: periodData.id },
            data: {
              total_tagihan: totalTagihan,
              total_bayar: totalBayar,
              total_selisih: totalBayar - totalTagihan,
              jumlah_lunas: lunasCount,
              jumlah_belum: allTagihan.length - lunasCount
            }
          });
        }
      }
      return pembayaranList;
    });
    return {
      success: true,
      message: `Berhasil input pembayaran ${allocations.length} periode`,
      data: {
        total_bayar: jumlah,
        alokasi: allocations,
        sisa: sisaBayar
      }
    };
  } catch (error) {
    console.error("Error creating multi-periode payment:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal input pembayaran multi-periode"
    });
  }
});

export { batch_post as default };
//# sourceMappingURL=batch.post.mjs.map
