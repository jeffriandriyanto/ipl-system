import * as XLSX from 'xlsx'

export const useExcel = () => {
  /**
   * Export data to Excel file
   */
  function exportToExcel(data: any[], filename: string, sheetName = 'Sheet1') {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)

    const colWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(
        key.length,
        ...data.map(row => String(row[key] || '').length)
      ) + 2
    }))
    ws['!cols'] = colWidths

    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    XLSX.writeFile(wb, `${filename}.xlsx`)
  }

  /**
   * Export multiple sheets to Excel
   */
  function exportMultiSheetToExcel(sheets: { name: string; data: any[] }[], filename: string) {
    const wb = XLSX.utils.book_new()

    for (const sheet of sheets) {
      const ws = XLSX.utils.json_to_sheet(sheet.data)

      const colWidths = Object.keys(sheet.data[0] || {}).map(key => ({
        wch: Math.max(
          key.length,
          ...sheet.data.map(row => String(row[key] || '').length)
        ) + 2
      }))
      ws['!cols'] = colWidths

      XLSX.utils.book_append_sheet(wb, ws, sheet.name)
    }

    XLSX.writeFile(wb, `${filename}.xlsx`)
  }

  /**
   * Read Excel file and return data
   */
  function readExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet)
          resolve(jsonData)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * Generate template Excel for download
   */
  function downloadTemplate(headers: { key: string; label: string }[], filename: string, sampleData: any[] = []) {
    const wb = XLSX.utils.book_new()

    const headerRow = headers.map(h => h.label)
    const ws = XLSX.utils.aoa_to_sheet([headerRow, ...sampleData.map(row => headers.map(h => row[h.key] || ''))])

    const colWidths = headers.map((h) => ({
      wch: Math.max(
        h.label.length,
        ...sampleData.map(row => String(row[h.key] || '').length)
      ) + 2
    }))
    ws['!cols'] = colWidths

    XLSX.utils.book_append_sheet(wb, ws, 'Template')
    XLSX.writeFile(wb, `template-${filename}.xlsx`)
  }

  /**
   * Format Rupiah for Excel
   */
  function formatRupiahExcel(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return {
    exportToExcel,
    exportMultiSheetToExcel,
    readExcelFile,
    downloadTemplate,
    formatRupiahExcel
  }
}
