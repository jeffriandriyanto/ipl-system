import { d as defineEventHandler, r as readBody, c as createError, p as prisma, b as createAuditLog } from '../../nitro/nitro.mjs';
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
  const { tenant_id, rumah_id, periode, jumlah, tanggal, metode, keterangan } = body;
  if (!tenant_id || !rumah_id || !periode || !jumlah || !tanggal) {
    throw createError({
      statusCode: 400,
      message: "tenant_id, rumah_id, periode, jumlah, dan tanggal wajib diisi"
    });
  }
  if (jumlah <= 0) {
    throw createError({
      statusCode: 400,
      message: "Jumlah bayar harus lebih dari 0"
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
    const tagihan = await prisma.tagihan.findFirst({
      where: {
        tenant_id,
        periode_id: periodData.id,
        rumah_id
      }
    });
    if (!tagihan) {
      throw createError({
        statusCode: 404,
        message: "Tagihan tidak ditemukan untuk rumah dan periode ini"
      });
    }
    const rumah = await prisma.rumah.findUnique({ where: { id: rumah_id } });
    const pembayaran = await prisma.pembayaran.create({
      data: {
        tenant_id,
        rumah_id,
        tagihan_id: tagihan.id,
        periode,
        jumlah,
        tanggal: new Date(tanggal),
        metode: metode || "transfer",
        keterangan: keterangan || null,
        input_oleh: "admin"
        // TODO: get from auth
      }
    });
    const totalBayar = tagihan.total_bayar + jumlah;
    const selisih = totalBayar - tagihan.total_tagihan;
    const status = totalBayar === 0 ? "belum_bayar" : selisih >= 0 ? selisih > 0 ? "lebih" : "lunas" : "kurang";
    await prisma.tagihan.update({
      where: { id: tagihan.id },
      data: {
        total_bayar: totalBayar,
        selisih,
        status,
        saldo_lebih: selisih > 0 ? selisih : 0
      }
    });
    if (selisih > 0) {
      await prisma.rumah.update({
        where: { id: rumah_id },
        data: { saldo_lebih: { increment: selisih } }
      });
    }
    const allTagihan = await prisma.tagihan.findMany({
      where: { periode_id: periodData.id }
    });
    const totalTagihanAll = allTagihan.reduce((sum, t) => sum + t.total_tagihan, 0);
    const totalBayarAll = allTagihan.reduce((sum, t) => sum + t.total_bayar, 0);
    const lunasCount = allTagihan.filter((t) => t.status === "lunas" || t.status === "lebih").length;
    await prisma.periode.update({
      where: { id: periodData.id },
      data: {
        total_tagihan: totalTagihanAll,
        total_bayar: totalBayarAll,
        total_selisih: totalBayarAll - totalTagihanAll,
        jumlah_lunas: lunasCount,
        jumlah_belum: allTagihan.length - lunasCount
      }
    });
    await prisma.kasTransaksi.create({
      data: {
        tenant_id,
        tipe: "masuk",
        jumlah,
        tanggal: new Date(tanggal),
        keterangan: `Pembayaran IPL ${(rumah == null ? void 0 : rumah.blok) || ""}-${(rumah == null ? void 0 : rumah.nomor) || ""} periode ${periode}`,
        kategori: "iuran",
        input_oleh: "system"
      }
    });
    await createAuditLog({
      tenant_id,
      aksi: "create",
      koleksi: "pembayaran",
      dokumen_id: pembayaran.id,
      perubahan: {
        after: {
          rumah: `${(rumah == null ? void 0 : rumah.blok) || ""}-${(rumah == null ? void 0 : rumah.nomor) || ""}`,
          periode,
          jumlah,
          metode,
          status_tagihan: status
        }
      },
      user_id: "admin",
      user_nama: "Admin"
    });
    return pembayaran;
  } catch (error) {
    console.error("Error creating pembayaran:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal membuat pembayaran"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index4.post.mjs.map
