import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tenant_id = query.tenant_id as string

  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id wajib diisi'
    })
  }

  try {
    // Get current period
    const currentPeriod = await prisma.periode.findFirst({
      where: {
        tenant_id,
        status: 'draft'
      },
      orderBy: { periode: 'desc' }
    })

    // Total rumah aktif
    const totalRumah = await prisma.rumah.count({
      where: {
        tenant_id,
        status: 'aktif'
      }
    })

    // Stats for current period
    let sudahBayar = 0
    let belumBayar = 0
    let totalTerkumpul = 0

    if (currentPeriod) {
      // Count paid
      sudahBayar = await prisma.tagihan.count({
        where: {
          tenant_id,
          periode_id: currentPeriod.id,
          status: { in: ['lunas', 'lebih'] }
        }
      })

      // Count unpaid
      belumBayar = await prisma.tagihan.count({
        where: {
          tenant_id,
          periode_id: currentPeriod.id,
          status: { in: ['belum_bayar', 'kurang'] }
        }
      })

      // Sum payments
      const payments = await prisma.pembayaran.aggregate({
        where: {
          tenant_id,
          periode: currentPeriod.periode
        },
        _sum: {
          jumlah: true
        }
      })

      totalTerkumpul = payments._sum.jumlah || 0
    }

    return {
      totalRumah,
      sudahBayar,
      belumBayar,
      totalTerkumpul
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengambil data dashboard'
    })
  }
})
