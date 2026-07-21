import prisma from '../../utils/prisma'

// POST /api/tutup-buku/:periode/action - Publish or Close period
export default defineEventHandler(async (event) => {
  const periode = getRouterParam(event, 'periode')
  const body = await readBody(event)
  const { tenant_id, action } = body

  if (!tenant_id || !periode || !action) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id, periode, dan action wajib diisi'
    })
  }

  if (!['publish', 'tutup'].includes(action)) {
    throw createError({
      statusCode: 400,
      message: 'Action harus publish atau tutup'
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

    // Validation based on action
    if (action === 'publish') {
      if (periodData.status !== 'draft') {
        throw createError({
          statusCode: 400,
          message: 'Hanya periode dengan status draft yang bisa dipublish'
        })
      }

      // Validation: Check if all active houses have tagihan
      const activeRumah = await prisma.rumah.count({
        where: { tenant_id, status: 'aktif' }
      })

      const tagihanCount = await prisma.tagihan.count({
        where: { tenant_id, periode_id: periodData.id }
      })

      if (tagihanCount < activeRumah) {
        const missing = activeRumah - tagihanCount
        throw createError({
          statusCode: 400,
          message: `Masih ada ${missing} rumah yang belum memiliki tagihan. Generate tagihan terlebih dahulu.`
        })
      }

      // Publish period
      const updated = await prisma.periode.update({
        where: { id: periodData.id },
        data: { status: 'published' }
      })

      return {
        message: `Periode ${periode} berhasil dipublish. Warga sudah bisa melihat tagihan.`,
        data: updated
      }
    }

    if (action === 'tutup') {
      if (periodData.status !== 'published') {
        throw createError({
          statusCode: 400,
          message: 'Hanya periode dengan status published yang bisa ditutup'
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
        message: `Periode ${periode} berhasil ditutup. Data tidak bisa diubah lagi.`,
        data: updated
      }
    }
  } catch (error) {
    console.error('Error processing period action:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal memproses aksi periode'
    })
  }
})
