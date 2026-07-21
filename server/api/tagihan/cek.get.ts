import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { blok, nomor } = query

  if (!blok || !nomor) {
    throw createError({
      statusCode: 400,
      message: 'Blok dan nomor rumah wajib diisi'
    })
  }

  try {
    // Get current period (latest open period)
    const currentPeriod = await prisma.periode.findFirst({
      where: { status: 'draft' },
      orderBy: { periode: 'desc' }
    })

    if (!currentPeriod) {
      throw createError({
        statusCode: 404,
        message: 'Periode aktif tidak ditemukan'
      })
    }

    // Find tagihan for this house in current period
    const tagihan = await prisma.tagihan.findFirst({
      where: {
        blok: blok as string,
        nomor_rumah: nomor as string,
        periode_id: currentPeriod.id
      },
      include: {
        items: true
      }
    })

    if (!tagihan) {
      return null
    }

    return {
      ...tagihan,
      periode: currentPeriod.periode
    }
  } catch (error) {
    console.error('Error fetching tagihan:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengambil data tagihan'
    })
  }
})
