import prisma from '../../utils/prisma'

// DELETE /api/users/:id - Delete user
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

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

    await prisma.user.delete({
      where: { id }
    })

    return { message: 'User berhasil dihapus' }
  } catch (error) {
    console.error('Error deleting user:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal menghapus user'
    })
  }
})
