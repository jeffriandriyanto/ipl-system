import { PrismaClient } from '@prisma/client'
import { hitungTagihanKategori } from '../../utils/billing'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { periode, tenant_id } = body

  if (!periode || !tenant_id) {
    throw createError({
      statusCode: 400,
      message: 'Periode dan tenant_id wajib diisi'
    })
  }

  try {
    // Check if period exists
    let period = await prisma.periode.findFirst({
      where: { periode, tenant_id }
    })

    // Create period if not exists
    if (!period) {
      period = await prisma.periode.create({
        data: {
          periode,
          tenant_id,
          status: 'draft'
        }
      })
    }

    if (period.status === 'ditutup') {
      throw createError({
        statusCode: 400,
        message: 'Periode sudah ditutup'
      })
    }

    // Get all active houses for this tenant
    const rumahList = await prisma.rumah.findMany({
      where: {
        tenant_id,
        status: 'aktif'
      }
    })

    // Get all active categories
    const kategoriList = await prisma.kategoriIuran.findMany({
      where: {
        tenant_id,
        status: 'aktif'
      }
    })

    // Create kategori map
    const kategoriMap = new Map(kategoriList.map(k => [k.id, k]))

    // Get previous period for meter readings
    const prevPeriod = await prisma.periode.findFirst({
      where: {
        tenant_id,
        periode: { lt: periode }
      },
      orderBy: { periode: 'desc' }
    })

    const prevTagihanMap = new Map()
    if (prevPeriod) {
      const prevTagihan = await prisma.tagihan.findMany({
        where: {
          tenant_id,
          periode_id: prevPeriod.id
        },
        include: { items: true }
      })
      prevTagihan.forEach(t => {
        prevTagihanMap.set(t.rumah_id, t)
      })
    }

    // Generate tagihan for each house
    const tagihanData = []
    let totalTagihanAll = 0
    let jumlahRumah = 0

    for (const rumah of rumahList) {
      const kategoriIds = rumah.kategori_iuran || []
      const items = []
      let totalTagihan = 0

      for (const kategoriId of kategoriIds) {
        const kategori = kategoriMap.get(kategoriId)
        if (!kategori) continue

        const prevTagihan = prevTagihanMap.get(rumah.id)
        const prevItem = prevTagihan?.items.find(i => i.kategori_id === kategoriId)

        let meterLalu = prevItem?.meter_sekarang || 0
        let meterSekarang = 0
        let pemakaian = 0
        let tagihan = 0

        if (kategori.tipe === 'meteran') {
          // Meteran calculation
          meterSekarang = meterLalu // Will be updated by petugas
          pemakaian = meterSekarang - meterLalu
          tagihan = hitungTagihanKategori(kategori, meterLalu, meterSekarang)
        } else {
          // Flat calculation
          tagihan = hitungTagihanKategori(kategori)
        }

        items.push({
          kategori_id: kategoriId,
          kategori_nama: kategori.nama,
          tipe: kategori.tipe,
          meter_lalu: kategori.tipe === 'meteran' ? meterLalu : null,
          meter_sekarang: kategori.tipe === 'meteran' ? meterSekarang : null,
          pemakaian: kategori.tipe === 'meteran' ? pemakaian : null,
          tagihan
        })

        totalTagihan += tagihan
      }

      tagihanData.push({
        tenant_id,
        periode_id: period.id,
        rumah_id: rumah.id,
        blok: rumah.blok,
        nomor_rumah: rumah.nomor,
        tipe_rumah: rumah.tipe,
        status_penghuni: 'ada',
        pic_nama: rumah.pic_nama,
        pic_telepon: rumah.pic_telepon,
        total_tagihan: totalTagihan,
        total_bayar: 0,
        selisih: -totalTagihan,
        status: 'belum_bayar',
        items
      })

      totalTagihanAll += totalTagihan
      jumlahRumah++
    }

    // Batch create/update tagihan
    for (const data of tagihanData) {
      const existing = await prisma.tagihan.findFirst({
        where: {
          tenant_id,
          periode_id: period.id,
          rumah_id: data.rumah_id
        }
      })

      if (existing) {
        // Update existing
        await prisma.tagihan.update({
          where: { id: existing.id },
          data: {
            total_tagihan: data.total_tagihan,
            selisih: data.selisih,
            items: {
              deleteMany: {},
              create: data.items
            }
          }
        })
      } else {
        // Create new
        await prisma.tagihan.create({
          data: {
            ...data,
            items: {
              create: data.items
            }
          }
        })
      }
    }

    // Update period stats
    await prisma.periode.update({
      where: { id: period.id },
      data: {
        jumlah_rumah: jumlahRumah,
        total_tagihan: totalTagihanAll
      }
    })

    return {
      success: true,
      message: `Berhasil generate ${jumlahRumah} tagihan`,
      data: {
        periode: period.periode,
        jumlah_rumah: jumlahRumah,
        total_tagihan: totalTagihanAll
      }
    }
  } catch (error) {
    console.error('Error generating tagihan:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal generate tagihan'
    })
  }
})
