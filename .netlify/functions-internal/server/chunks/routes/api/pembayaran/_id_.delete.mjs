import { d as defineEventHandler, a as getRouterParam, c as createError, p as prisma, b as createAuditLog } from '../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "ID pembayaran wajib diisi"
    });
  }
  try {
    const pembayaran = await prisma.pembayaran.findUnique({
      where: { id },
      include: { tagihan: true, rumah: true }
    });
    if (!pembayaran) {
      throw createError({
        statusCode: 404,
        message: "Pembayaran tidak ditemukan"
      });
    }
    await prisma.pembayaran.delete({ where: { id } });
    const tagihan = pembayaran.tagihan;
    if (tagihan) {
      const newTotalBayar = Math.max(0, tagihan.total_bayar - pembayaran.jumlah);
      const newSelisih = newTotalBayar - tagihan.total_tagihan;
      const newStatus = newTotalBayar === 0 ? "belum_bayar" : newSelisih >= 0 ? newSelisih > 0 ? "lebih" : "lunas" : "kurang";
      await prisma.tagihan.update({
        where: { id: tagihan.id },
        data: {
          total_bayar: newTotalBayar,
          selisih: newSelisih,
          status: newStatus,
          saldo_lebih: newSelisih > 0 ? newSelisih : 0
        }
      });
      if (pembayaran.rumah && pembayaran.jumlah > tagihan.total_tagihan) {
        const excess = pembayaran.jumlah - tagihan.total_tagihan;
        await prisma.rumah.update({
          where: { id: pembayaran.rumah_id },
          data: { saldo_lebih: { decrement: Math.min(excess, pembayaran.rumah.saldo_lebih) } }
        });
      }
    }
    const kasKeterangan = `Pembayaran IPL ${((_a = pembayaran.rumah) == null ? void 0 : _a.blok) || ""}-${((_b = pembayaran.rumah) == null ? void 0 : _b.nomor) || ""} periode ${pembayaran.periode}`;
    await prisma.kasTransaksi.deleteMany({
      where: {
        tenant_id: pembayaran.tenant_id,
        keterangan: kasKeterangan,
        tipe: "masuk",
        kategori: "iuran"
      }
    });
    await createAuditLog({
      tenant_id: pembayaran.tenant_id,
      aksi: "delete",
      koleksi: "pembayaran",
      dokumen_id: id,
      perubahan: {
        before: {
          rumah: `${((_c = pembayaran.rumah) == null ? void 0 : _c.blok) || ""}-${((_d = pembayaran.rumah) == null ? void 0 : _d.nomor) || ""}`,
          periode: pembayaran.periode,
          jumlah: pembayaran.jumlah
        }
      },
      user_id: "admin",
      user_nama: "Admin"
    });
    return { message: "Pembayaran berhasil dihapus" };
  } catch (error) {
    console.error("Error deleting pembayaran:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal menghapus pembayaran"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
