import prisma from '../../utils/prisma'

// POST /api/settings - Update settings for a tenant
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { tenant_id, ...data } = body

  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id wajib diisi'
    })
  }

  // Fields yang milik Tenant
  const tenantFields = ['logo', 'primary_color', 'secondary_color', 'footer_text', 'domain']
  // Fields yang milik Settings
  const settingsFields = ['nama_aplikasi', 'nama_perumahan', 'alamat', 'kontak', 'payment_info']

  const tenantData: Record<string, any> = {}
  const settingsData: Record<string, any> = {}

  for (const [key, value] of Object.entries(data)) {
    if (tenantFields.includes(key)) {
      tenantData[key] = value
    } else if (settingsFields.includes(key)) {
      settingsData[key] = value
    }
  }

  try {
    // Update Tenant jika ada data white-label
    if (Object.keys(tenantData).length > 0) {
      await prisma.tenant.update({
        where: { id: tenant_id },
        data: tenantData
      })
    }

    // Update/insert Settings
    if (Object.keys(settingsData).length > 0) {
      const settings = await prisma.settings.upsert({
        where: { tenant_id },
        update: settingsData,
        create: {
          tenant_id,
          nama_aplikasi: settingsData.nama_aplikasi || 'IPL System',
          ...settingsData
        }
      })
      return settings
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error updating settings:', error)
    throw createError({
      statusCode: 500,
      message: error?.message || 'Gagal mengupdate pengaturan'
    })
  }
})
