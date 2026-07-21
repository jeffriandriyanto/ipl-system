import prisma from '../../utils/prisma'

// POST /api/kas - Create kas transaction
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { tenant_id, tipe, jumlah, tanggal, keterangan, kategori } = body

  if (!tenant_id || !tipe || !jumlah || !tanggal) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id, tipe, jumlah, dan tanggal wajib diisi'
    })
  }

  // Validate tipe
  if (!['masuk', 'keluar'].includes(tipe)) {
    throw createError({
      statusCode: 400,
      message: 'Tipe harus masuk atau keluar'
    })
  }

  // Validate jumlah
  if (jumlah <= 0) {
    throw createError({
      statusCode: 400,
      message: 'Jumlah harus lebih dari 0'
    })
  }

  try {
    const kas = await prisma.kasTransaksi.create({
      data: {
        tenant_id,
        tipe,
        jumlah,
        tanggal: new Date(tanggal),
        keterangan: keterangan || null,
        kategori: kategori || 'lainnya',
        input_oleh: 'admin' // TODO: get from auth
      }
    })

    return kas
  } catch (error) {
    console.error('Error creating kas:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal membuat transaksi kas'
    })
  }
})
