import vine from '@vinejs/vine'

/**
 * Validates comment creation
 */
export const addCommentValidator = vine.compile(
  vine.object({
    parentId: vine.number().exists(async (db, parentId, data) => {
      if (Number(parentId) === 0) return true
      const comment = await db.from('comments')
        .select('id')
        .where('id', parentId)
        .where('parent_id', 0)
        .andWhere('post_id', data.data.postId)
        .first()
      return !!comment
    }),
    content: vine.string().trim().minLength(3),
  })
)
