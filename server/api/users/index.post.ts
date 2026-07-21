import prisma from '../../utils/prisma'

// POST /api/users - Create new user
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { tenant_id, email, nama, role, telepon } = body

  if (!tenant_id || !email || !nama || !role) {
    throw createError({
      statusCode: 400,
      message: 'tenant_id, email, nama, dan role wajib diisi'
    })
  }

  // Validate role
  if (!['admin', 'petugas'].includes(role)) {
    throw createError({
      statusCode: 400,
      message: 'Role harus admin atau petugas'
    })
  }

  try {
    // Check if email already exists for this tenant
    const existing = await prisma.user.findFirst({
      where: {
        tenant_id,
        email
      }
    })

    if (existing) {
      throw createError({
        statusCode: 400,
        message: 'Email sudah terdaftar'
      })
    }

    const user = await prisma.user.create({
      data: {
        tenant_id,
        email,
        nama,
        role,
        telepon: telepon || null,
        status: 'aktif'
      }
    })

    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal membuat user'
    })
  }
})
