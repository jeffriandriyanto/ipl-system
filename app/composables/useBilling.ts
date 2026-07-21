export const useBilling = () => {
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const parseRupiah = (rupiah: string): number => {
    return parseInt(rupiah.replace(/[^0-9]/g, ''), 10) || 0
  }

  const hitungMeteran = (
    meterLalu: number,
    meterSekarang: number,
    minimumKuota: number,
    minimumTarif: number,
    tarifPerM3: number
  ): number => {
    const pemakaian = meterSekarang - meterLalu

    if (pemakaian < 0) return 0
    if (pemakaian <= minimumKuota) return minimumTarif

    const kelebihan = pemakaian - minimumKuota
    return minimumTarif + (kelebihan * tarifPerM3)
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'lunas':
        return 'text-green-600 bg-green-100'
      case 'belum_bayar':
        return 'text-red-600 bg-red-100'
      case 'kurang':
        return 'text-yellow-600 bg-yellow-100'
      case 'lebih':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string, selisih?: number): string => {
    switch (status) {
      case 'lunas':
        return 'LUNAS'
      case 'belum_bayar':
        return 'BELUM LUNAS'
      case 'kurang':
        return `KURANG ${formatRupiah(Math.abs(selisih || 0))}`
      case 'lebih':
        return 'LEBIH BAYAR'
      default:
        return status
    }
  }

  return {
    formatRupiah,
    parseRupiah,
    hitungMeteran,
    getStatusColor,
    getStatusText
  }
}
