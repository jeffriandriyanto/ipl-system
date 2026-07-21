import prisma from '../../utils/prisma'

// POST /api/tutup-buku/:periode - Close period
export default defineEventHandler(async (event) => {
  const periode = getRouterParam(event, 'periode')
  const body = await readBody(event)
  const { tenant_id } = body

  if (!tenant_id || !periode) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id dan periode wajib diisi'
    })
  }

  try {
    // Get period
    const periodData = await prisma.periode.findFirst({
      where: { tenant_id, periode }
    })

    if (!periodData) {
      throw createError({
        statusCode: 404,
        message: 'Periode tidak ditemukan'
      })
    }

    if (periodData.status === 'ditutup') {
      throw createError({
        statusCode: 400,
        message: 'Periode sudah ditutup'
      })
    }

    // Validation: Check if all active houses have tagihan
    const activeRumah = await prisma.rumah.count({
      where: {
        tenant_id,
        status: 'aktif'
      }
    })

    const tagihanCount = await prisma.tagihan.count({
      where: {
        tenant_id,
        periode_id: periodData.id
      }
    })

    if (tagihanCount < activeRumah) {
      const missing = activeRumah - tagihanCount
      throw createError({
        statusCode: 400,
        message: `Masih ada ${missing} rumah yang belum memiliki tagihan`
      })
    }

    // Close period
    const updated = await prisma.periode.update({
      where: { id: periodData.id },
      data: {
        status: 'ditutup',
        ditutup_pada: new Date(),
        ditutup_oleh: 'admin' // TODO: get from auth
      }
    })

    return {
      message: `Periode ${periode} berhasil ditutup`,
      data: updated
    }
  } catch (error) {
    console.error('Error closing period:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal menutup periode'
    })
  }
})
