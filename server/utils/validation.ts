/**
 * Validation utility for IPL System
 */

interface ValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Validate meter reading input
 */
export function validateMeteran(
  meterLalu: number,
  meterSekarang: number,
  keterangan?: string
): ValidationResult {
  const errors: string[] = []

  if (meterSekarang < 0) {
    errors.push('Meter sekarang tidak boleh negatif')
  }

  if (meterSekarang < meterLalu) {
    if (!keterangan || keterangan.trim() === '') {
      errors.push('Meter sekarang lebih kecil dari meter lalu. Harus isi keterangan.')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate payment input
 */
export function validatePembayaran(
  jumlah: number,
  tanggal: string | Date
): ValidationResult {
  const errors: string[] = []

  if (jumlah <= 0) {
    errors.push('Jumlah bayar harus lebih dari 0')
  }

  if (!tanggal) {
    errors.push('Tanggal bayar wajib diisi')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate master rumah input
 */
export function validateRumah(
  blok: string,
  nomor: string,
  tipe: string,
  status: string,
  picNama?: string,
  kategoriIuran?: string[]
): ValidationResult {
  const errors: string[] = []

  if (!blok || blok.trim() === '') {
    errors.push('Blok wajib diisi')
  }

  if (!nomor || nomor.trim() === '') {
    errors.push('Nomor rumah wajib diisi')
  }

  if (!['pribadi', 'kontrakan', 'fasum'].includes(tipe)) {
    errors.push('Tipe rumah tidak valid')
  }

  if (!['aktif', 'nonaktif'].includes(status)) {
    errors.push('Status rumah tidak valid')
  }

  if (status === 'aktif' && (!picNama || picNama.trim() === '')) {
    errors.push('PIC wajib diisi untuk rumah aktif')
  }

  if (!kategoriIuran || kategoriIuran.length === 0) {
    errors.push('Minimal 1 kategori iuran wajib dipilih')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate master kategori iuran input
 */
export function validateKategori(
  nama: string,
  tipe: string,
  tarifFlat: number,
  tarifPerM3: number,
  minimumKuota: number,
  minimumTarif: number
): ValidationResult {
  const errors: string[] = []

  if (!nama || nama.trim() === '') {
    errors.push('Nama kategori wajib diisi')
  }

  if (!['flat', 'meteran'].includes(tipe)) {
    errors.push('Tipe kategori tidak valid')
  }

  if (tipe === 'flat' && tarifFlat <= 0) {
    errors.push('Tarif flat harus lebih dari 0')
  }

  if (tipe === 'meteran') {
    if (tarifPerM3 <= 0) {
      errors.push('Tarif per m³ harus lebih dari 0')
    }
    if (minimumKuota <= 0) {
      errors.push('Minimum kuota harus lebih dari 0')
    }
    if (minimumTarif <= 0) {
      errors.push('Minimum tarif harus lebih dari 0')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate period format (YYYY-MM)
 */
export function validatePeriode(periode: string): ValidationResult {
  const errors: string[] = []

  if (!periode || !/^\d{4}-\d{2}$/.test(periode)) {
    errors.push('Format periode tidak valid (harus YYYY-MM)')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format (Indonesian)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/
  return phoneRegex.test(phone.replace(/[-\s]/g, ''))
}
