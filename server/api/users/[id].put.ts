import prisma from '../../utils/prisma'

// PUT /api/users/:id - Update user
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { nama, role, telepon, status } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID user wajib diisi'
    })
  }

  try {
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { id }
    })

    if (!existing) {
      throw createError({
        statusCode: 404,
        message: 'User tidak ditemukan'
      })
    }

    // Validate role if changed
    if (role && !['admin', 'petugas'].includes(role)) {
      throw createError({
        statusCode: 400,
        message: 'Role harus admin atau petugas'
      })
    }

    // Validate status if changed
    if (status && !['aktif', 'nonaktif'].includes(status)) {
      throw createError({
        statusCode: 400,
        message: 'Status harus aktif atau nonaktif'
      })
    }

    const updateData: any = {}
    if (nama) updateData.nama = nama
    if (role) updateData.role = role
    if (telepon !== undefined) updateData.telepon = telepon || null
    if (status) updateData.status = status

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    })

    return user
  } catch (error) {
    console.error('Error updating user:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengupdate user'
    })
  }
})
