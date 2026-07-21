import prisma from '../../utils/prisma'

// POST /api/settings - Update settings for a tenant
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { tenant_id, ...settingsData } = body

  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id wajib diisi'
    })
  }

  try {
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
  } catch (error) {
    console.error('Error updating settings:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengupdate pengaturan'
    })
  }
})
