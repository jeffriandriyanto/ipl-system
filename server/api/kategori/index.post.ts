import prisma from '../../utils/prisma'

// POST /api/kategori - Create new kategori
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { tenant_id, nama, tipe, tarif_flat, tarif_per_m3, minimum_kuota, minimum_tarif } = body

  if (!tenant_id || !nama || !tipe) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id, nama, dan tipe wajib diisi'
    })
  }

  // Validate tipe
  if (!['flat', 'meteran'].includes(tipe)) {
    throw createError({
      statusCode: 400,
      message: 'Tipe harus flat atau meteran'
    })
  }

  // Validate based on tipe
  if (tipe === 'flat' && (!tarif_flat || tarif_flat <= 0)) {
    throw createError({
      statusCode: 400,
      message: 'Tarif flat harus lebih dari 0'
    })
  }

  if (tipe === 'meteran') {
    if (!tarif_per_m3 || tarif_per_m3 <= 0) {
      throw createError({
        statusCode: 400,
        message: 'Tarif per m³ harus lebih dari 0'
      })
    }
    if (!minimum_kuota || minimum_kuota <= 0) {
      throw createError({
        statusCode: 400,
        message: 'Minimum kuota harus lebih dari 0'
      })
    }
    if (!minimum_tarif || minimum_tarif <= 0) {
      throw createError({
        statusCode: 400,
        message: 'Minimum tarif harus lebih dari 0'
      })
    }
  }

  try {
    // Check if nama already exists for this tenant
    const existing = await prisma.kategoriIuran.findFirst({
      where: {
        tenant_id,
        nama
      }
    })

    if (existing) {
      throw createError({
        statusCode: 400,
        message: 'Kategori dengan nama tersebut sudah ada'
      })
    }

    const kategori = await prisma.kategoriIuran.create({
      data: {
        tenant_id,
        nama,
        tipe,
        tarif_flat: tipe === 'flat' ? tarif_flat : 0,
        tarif_per_m3: tipe === 'meteran' ? tarif_per_m3 : 0,
        minimum_kuota: tipe === 'meteran' ? minimum_kuota : 0,
        minimum_tarif: tipe === 'meteran' ? minimum_tarif : 0,
        status: 'aktif'
      }
    })

    return kategori
  } catch (error) {
    console.error('Error creating kategori:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal membuat kategori'
    })
  }
})
