import prisma from '../../utils/prisma'

// PUT /api/kategori/:id - Update kategori
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { nama, tipe, tarif_flat, tarif_per_m3, minimum_kuota, minimum_tarif, status } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID kategori wajib diisi'
    })
  }

  try {
    // Check if kategori exists
    const existing = await prisma.kategoriIuran.findUnique({
      where: { id }
    })

    if (!existing) {
      throw createError({
        statusCode: 404,
        message: 'Kategori tidak ditemukan'
      })
    }

    // Validate tipe if changed
    if (tipe && !['flat', 'meteran'].includes(tipe)) {
      throw createError({
        statusCode: 400,
        message: 'Tipe harus flat atau meteran'
      })
    }

    // Check if nama already exists (if changed)
    if (nama && nama !== existing.nama) {
      const namaExists = await prisma.kategoriIuran.findFirst({
        where: {
          tenant_id: existing.tenant_id,
          nama,
          id: { not: id }
        }
      })

      if (namaExists) {
        throw createError({
          statusCode: 400,
          message: 'Kategori dengan nama tersebut sudah ada'
        })
      }
    }

    const updateData: any = {}
    if (nama) updateData.nama = nama
    if (tipe) updateData.tipe = tipe
    if (status) updateData.status = status

    if (tipe === 'flat' || existing.tipe === 'flat') {
      if (tarif_flat !== undefined) updateData.tarif_flat = tarif_flat
    }

    if (tipe === 'meteran' || existing.tipe === 'meteran') {
      if (tarif_per_m3 !== undefined) updateData.tarif_per_m3 = tarif_per_m3
      if (minimum_kuota !== undefined) updateData.minimum_kuota = minimum_kuota
      if (minimum_tarif !== undefined) updateData.minimum_tarif = minimum_tarif
    }

    const kategori = await prisma.kategoriIuran.update({
      where: { id },
      data: updateData
    })

    return kategori
  } catch (error) {
    console.error('Error updating kategori:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengupdate kategori'
    })
  }
})
