import prisma from '../../utils/prisma'

// POST /api/rumah/batch - Bulk import rumah from Excel
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { tenant_id, data } = body

  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id wajib diisi'
    })
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Data tidak boleh kosong'
    })
  }

  // Get kategori map (nama -> id)
  const kategoriList = await prisma.kategoriIuran.findMany({
    where: { tenant_id }
  })
  const kategoriMap = new Map(kategoriList.map(k => [k.nama.toLowerCase(), k.id]))

  const results = { success: 0, failed: 0, errors: [] as string[] }

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const rowNum = i + 2 // Excel row (header = row 1)

    try {
      const blok = String(row.BLOK || row.blok || '').trim()
      const nomor = String(row['NO RUMAH'] || row.nomor || '').trim()

      if (!blok || !nomor) {
        results.errors.push(`Baris ${rowNum}: BLOK dan NO RUMAH wajib diisi`)
        results.failed++
        continue
      }

      // Parse kategori iuran
      const kategoriStr = String(row['KATEGORI IURAN'] || row.kategori || '')
      const kategoriIds = kategoriStr
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(k => k && kategoriMap.has(k))
        .map(k => kategoriMap.get(k)!)

      // Upsert rumah
      await prisma.rumah.upsert({
        where: {
          tenant_id_blok_nomor: {
            tenant_id,
            blok,
            nomor
          }
        },
        update: {
          tipe: String(row.TIPE || row.tipe || 'pribadi').toLowerCase(),
          status: String(row.STATUS || row.status || 'aktif').toLowerCase(),
          pic_nama: String(row.PIC || row.pic_nama || '').trim() || null,
          pic_telepon: String(row.TELEPON || row.pic_telepon || '').trim() || null,
          kategori_iuran: kategoriIds,
          keterangan: String(row.KETERANGAN || row.keterangan || '').trim() || null
        },
        create: {
          tenant_id,
          blok,
          nomor,
          tipe: String(row.TIPE || row.tipe || 'pribadi').toLowerCase(),
          status: String(row.STATUS || row.status || 'aktif').toLowerCase(),
          pic_nama: String(row.PIC || row.pic_nama || '').trim() || null,
          pic_telepon: String(row.TELEPON || row.pic_telepon || '').trim() || null,
          kategori_iuran: kategoriIds,
          keterangan: String(row.KETERANGAN || row.keterangan || '').trim() || null
        }
      })

      results.success++
    } catch (error: any) {
      results.errors.push(`Baris ${rowNum}: ${error.message || 'Gagal menyimpan'}`)
      results.failed++
    }
  }

  return results
})
