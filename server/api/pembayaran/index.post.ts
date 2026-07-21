import prisma from '../../utils/prisma'

// POST /api/pembayaran - Create pembayaran
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { tenant_id, rumah_id, periode, jumlah, tanggal, metode, keterangan } = body

  if (!tenant_id || !rumah_id || !periode || !jumlah || !tanggal) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id, rumah_id, periode, jumlah, dan tanggal wajib diisi'
    })
  }

  if (jumlah <= 0) {
    throw createError({
      statusCode: 400,
      message: 'Jumlah bayar harus lebih dari 0'
    })
  }

  try {
    // Get tagihan for this rumah and period
    const periodData = await prisma.periode.findFirst({
      where: { tenant_id, periode }
    })

    if (!periodData) {
      throw createError({
        statusCode: 404,
        message: 'Periode tidak ditemukan'
      })
    }

    const tagihan = await prisma.tagihan.findFirst({
      where: {
        tenant_id,
        periode_id: periodData.id,
        rumah_id
      }
    })

    if (!tagihan) {
      throw createError({
        statusCode: 404,
        message: 'Tagihan tidak ditemukan untuk rumah dan periode ini'
      })
    }

    // Create pembayaran
    const pembayaran = await prisma.pembayaran.create({
      data: {
        tenant_id,
        rumah_id,
        tagihan_id: tagihan.id,
        periode,
        jumlah,
        tanggal: new Date(tanggal),
        metode: metode || 'transfer',
        keterangan: keterangan || null,
        input_oleh: 'admin' // TODO: get from auth
      }
    })

    // Update tagihan
    const totalBayar = tagihan.total_bayar + jumlah
    const selisih = totalBayar - tagihan.total_tagihan
    const status = totalBayar === 0 ? 'belum_bayar' :
                   selisih >= 0 ? (selisih > 0 ? 'lebih' : 'lunas') : 'kurang'

    await prisma.tagihan.update({
      where: { id: tagihan.id },
      data: {
        total_bayar: totalBayar,
        selisih,
        status,
        saldo_lebih: selisih > 0 ? selisih : 0
      }
    })

    // Update periode stats
    const allTagihan = await prisma.tagihan.findMany({
      where: { periode_id: periodData.id }
    })

    const totalTagihanAll = allTagihan.reduce((sum, t) => sum + t.total_tagihan, 0)
    const totalBayarAll = allTagihan.reduce((sum, t) => sum + t.total_bayar, 0)
    const lunasCount = allTagihan.filter(t => t.status === 'lunas' || t.status === 'lebih').length

    await prisma.periode.update({
      where: { id: periodData.id },
      data: {
        total_tagihan: totalTagihanAll,
        total_bayar: totalBayarAll,
        total_selisih: totalBayarAll - totalTagihanAll,
        jumlah_lunas: lunasCount,
        jumlah_belum: allTagihan.length - lunasCount
      }
    })

    return pembayaran
  } catch (error) {
    console.error('Error creating pembayaran:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal membuat pembayaran'
    })
  }
})
