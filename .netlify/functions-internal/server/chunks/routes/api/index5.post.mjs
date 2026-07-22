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
  const {
    tenant_id,
    blok,
    nomor,
    alamat,
    tipe,
    status,
    pic_nama,
    pic_telepon,
    pic_email,
    pemilik_nama,
    pemilik_telepon,
    kategori_iuran,
    keterangan
  } = body;
  if (!tenant_id || !blok || !nomor || !tipe) {
    throw createError({
      statusCode: 400,
      message: "tenant_id, blok, nomor, dan tipe wajib diisi"
    });
  }
  if (!["pribadi", "kontrakan", "fasum"].includes(tipe)) {
    throw createError({
      statusCode: 400,
      message: "Tipe harus pribadi, kontrakan, atau fasum"
    });
  }
  if (status && !["aktif", "nonaktif"].includes(status)) {
    throw createError({
      statusCode: 400,
      message: "Status harus aktif atau nonaktif"
    });
  }
  if (!kategori_iuran || !Array.isArray(kategori_iuran) || kategori_iuran.length === 0) {
    throw createError({
      statusCode: 400,
      message: "Minimal 1 kategori iuran wajib dipilih"
    });
  }
  try {
    const existing = await prisma.rumah.findFirst({
      where: {
        tenant_id,
        blok,
        nomor
      }
    });
    if (existing) {
      throw createError({
        statusCode: 400,
        message: "Rumah dengan blok dan nomor tersebut sudah ada"
      });
    }
    const rumah = await prisma.rumah.create({
      data: {
        tenant_id,
        blok,
        nomor,
        alamat: alamat || null,
        tipe,
        status: status || "aktif",
        pic_nama: pic_nama || null,
        pic_telepon: pic_telepon || null,
        pic_email: pic_email || null,
        pemilik_nama: pemilik_nama || null,
        pemilik_telepon: pemilik_telepon || null,
        kategori_iuran,
        keterangan: keterangan || null
      }
    });
    await createAuditLog({
      tenant_id,
      aksi: "create",
      koleksi: "rumah",
      dokumen_id: rumah.id,
      perubahan: {
        after: { blok, nomor, tipe, status: status || "aktif", pic_nama }
      },
      user_id: "admin",
      user_nama: "Admin"
    });
    return rumah;
  } catch (error) {
    console.error("Error creating rumah:", error);
    throw createError({
      statusCode: 500,
      message: "Gagal membuat rumah"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index5.post.mjs.map
