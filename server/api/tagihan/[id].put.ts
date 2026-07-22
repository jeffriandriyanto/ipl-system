import prisma from '../../utils/prisma'

// PUT /api/tagihan/[id] - Update tagihan (is_exempt, status, etc)
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID tagihan wajib diisi'
    })
  }

  try {
    const tagihan = await prisma.tagihan.update({
      where: { id },
      data: body
    })

    return tagihan
  } catch (error) {
    console.error('Error updating tagihan:', error)
    throw createError({
      statusCode: 500,
      message: 'Gagal mengupdate tagihan'
    })
  }
})
