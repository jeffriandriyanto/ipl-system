import prisma from '../../utils/prisma'

// GET /api/meteran - Get meteran data for a period
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tenant_id = query.tenant_id as string
  const periode = query.periode as string

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

    // Get all active rumah with meteran kategori
    const rumahList = await prisma.rumah.findMany({
      where: {
        tenant_id,
        status: 'aktif'
      },
      orderBy: [
        { blok: 'asc' },
        { nomor: 'asc' }
      ]
    })

    // Get kategori
    const kategoriList = await prisma.kategoriIuran.findMany({
      where: { tenant_id, status: 'aktif' }
    })
    const kategoriMap = new Map(kategoriList.map(k => [k.id, k]))

    // Get existing tagihan for this period
    const existingTagihan = await prisma.tagihan.findMany({
      where: {
        tenant_id,
        periode_id: periodData.id
      },
      include: { items: true }
    })
    const tagihanMap = new Map(existingTagihan.map(t => [t.rumah_id, t]))

    // Get previous period for meter_lalu
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

    // Build meteran data
    const meteranData = rumahList.map(rumah => {
      const tagihan = tagihanMap.get(rumah.id)
      const prevTagihan = prevTagihanMap.get(rumah.id)
      const kategoriIds = rumah.kategori_iuran || []

      const meteranItems = kategoriIds
        .map(katId => {
          const kategori = kategoriMap.get(katId)
          if (!kategori || kategori.tipe !== 'meteran') return null

          const tagihanItem = tagihan?.items.find(i => i.kategori_id === katId)
          const prevItem = prevTagihan?.items.find(i => i.kategori_id === katId)

          return {
            kategori_id: katId,
            kategori_nama: kategori.nama,
            meter_lalu: prevItem?.meter_sekarang || 0,
            meter_sekarang: tagihanItem?.meter_sekarang || 0,
            pemakaian: tagihanItem?.pemakaian || 0,
            sudah_diinput: !!tagihanItem
          }
        })
        .filter(Boolean)

      return {
        rumah_id: rumah.id,
        blok: rumah.blok,
        nomor: rumah.nomor,
        tipe: rumah.tipe,
        pic_nama: rumah.pic_nama,
        status_penghuni: tagihan?.status_penghuni || 'ada',
        meteran: meteranItems,
        sudah_ada_tagihan: !!tagihan
      }
    })

    return {
      periode: periodData,
      data: meteranData
    }
  } catch (error) {
    console.error('Error fetching meteran:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengambil data meteran'
    })
  }
})
