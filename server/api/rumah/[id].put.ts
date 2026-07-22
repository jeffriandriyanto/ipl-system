import prisma from '../../utils/prisma'
import { createAuditLog } from '../../utils/audit'

// PUT /api/rumah/:id - Update rumah
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { 
    blok, nomor, alamat, tipe, status,
    pic_nama, pic_telepon, pic_email,
    pemilik_nama, pemilik_telepon,
    kategori_iuran, keterangan 
  } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID rumah wajib diisi'
    })
  }

  try {
    // Check if rumah exists
    const existing = await prisma.rumah.findUnique({
      where: { id }
    })

    if (!existing) {
      throw createError({
        statusCode: 404,
        message: 'Rumah tidak ditemukan'
      })
    }

    // Validate tipe if changed
    if (tipe && !['pribadi', 'kontrakan', 'fasum'].includes(tipe)) {
      throw createError({
        statusCode: 400,
        message: 'Tipe harus pribadi, kontrakan, atau fasum'
      })
    }

    // Validate status if changed
    if (status && !['aktif', 'nonaktif'].includes(status)) {
      throw createError({
        statusCode: 400,
        message: 'Status harus aktif atau nonaktif'
      })
    }

    // Check if blok + nomor already exists (if changed)
    if ((blok && blok !== existing.blok) || (nomor && nomor !== existing.nomor)) {
      const namaExists = await prisma.rumah.findFirst({
        where: {
          tenant_id: existing.tenant_id,
          blok: blok || existing.blok,
          nomor: nomor || existing.nomor,
          id: { not: id }
        }
      })

      if (namaExists) {
        throw createError({
          statusCode: 400,
          message: 'Rumah dengan blok dan nomor tersebut sudah ada'
        })
      }
    }

    const updateData: any = {}
    if (blok) updateData.blok = blok
    if (nomor) updateData.nomor = nomor
    if (alamat !== undefined) updateData.alamat = alamat || null
    if (tipe) updateData.tipe = tipe
    if (status) updateData.status = status
    if (pic_nama !== undefined) updateData.pic_nama = pic_nama || null
    if (pic_telepon !== undefined) updateData.pic_telepon = pic_telepon || null
    if (pic_email !== undefined) updateData.pic_email = pic_email || null
    if (pemilik_nama !== undefined) updateData.pemilik_nama = pemilik_nama || null
    if (pemilik_telepon !== undefined) updateData.pemilik_telepon = pemilik_telepon || null
    if (kategori_iuran) updateData.kategori_iuran = kategori_iuran
    if (keterangan !== undefined) updateData.keterangan = keterangan || null

    const rumah = await prisma.rumah.update({
      where: { id },
      data: updateData
    })

    // Audit log
    await createAuditLog({
      tenant_id: existing.tenant_id,
      aksi: 'update',
      koleksi: 'rumah',
      dokumen_id: id,
      perubahan: {
        before: { blok: existing.blok, nomor: existing.nomor, tipe: existing.tipe, status: existing.status },
        after: updateData
      },
      user_id: 'admin',
      user_nama: 'Admin'
    })

    return rumah
  } catch (error) {
    console.error('Error updating rumah:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengupdate rumah'
    })
  }
})
