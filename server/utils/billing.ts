/**
 * Billing calculation utility
 * Supports: flat rate and meteran (meter-based) billing
 */

interface KategoriIuran {
  id: string
  nama: string
  tipe: 'flat' | 'meteran'
  tarif_flat: number
  tarif_per_m3: number
  minimum_kuota: number
  minimum_tarif: number
}

interface TagihanItem {
  kategori_id: string
  kategori_nama: string
  tipe: string
  meter_lalu: number | null
  meter_sekarang: number | null
  pemakaian: number | null
  tagihan: number
}

/**
 * Calculate bill for a single category
 */
export function hitungTagihanKategori(
  kategori: KategoriIuran,
  meterLalu?: number | null,
  meterSekarang?: number | null
): number {
  if (kategori.tipe === 'flat') {
    return kategori.tarif_flat
  }

  // Meteran calculation
  if (meterLalu == null || meterSekarang == null) {
    return 0
  }

  const pemakaian = meterSekarang - meterLalu

  if (pemakaian < 0) {
    // Invalid: meter mundur
    return 0
  }

  if (pemakaian <= kategori.minimum_kuota) {
    return kategori.minimum_tarif
  }

  const kelebihan = pemakaian - kategori.minimum_kuota
  return kategori.minimum_tarif + (kelebihan * kategori.tarif_per_m3)
}

/**
 * Calculate total bill for a house with multiple categories
 */
export function hitungTotalTagihan(items: TagihanItem[]): number {
  return items.reduce((total, item) => total + item.tagihan, 0)
}

/**
 * Calculate bill status
 */
export function hitungStatusTagihan(
  totalTagihan: number,
  totalBayar: number
): {
  selisih: number
  status: 'belum_bayar' | 'lunas' | 'kurang' | 'lebih'
  saldo_lebih: number
} {
  const selisih = totalBayar - totalTagihan

  let status: 'belum_bayar' | 'lunas' | 'kurang' | 'lebih'
  let saldo_lebih = 0

  if (totalBayar === 0) {
    status = 'belum_bayar'
  } else if (selisih === 0) {
    status = 'lunas'
  } else if (selisih < 0) {
    status = 'kurang'
  } else {
    status = 'lebih'
    saldo_lebih = selisih
  }

  return { selisih, status, saldo_lebih }
}

/**
 * Format currency to Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Parse Rupiah string to number
 */
export function parseRupiah(rupiah: string): number {
  return parseInt(rupiah.replace(/[^0-9]/g, ''), 10) || 0
}
