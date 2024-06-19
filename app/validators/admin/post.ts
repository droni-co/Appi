import vine from '@vinejs/vine'

/**
 * Validates post creation
 */
export const adminPostValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    slug: vine.string().trim().unique(async (db, slug, data) => {
      const post = await db.from('posts')
        .select('id')
        .where('slug', slug)
        .andWhere('site_id', data.data.siteId)
        .andWhereNot('id', data.data.postId ?? 0)
        .first()
      return !post
    }),
    description: vine.string().trim().optional(),
    image: vine.string().trim().optional(),
    content: vine.string().trim().optional(),
    format: vine.string().trim().in(['html', 'markdown']),
    active: vine.boolean(),
    props: vine.array(vine.object({
      name: vine.string().trim(),
      value: vine.string().trim(),
    })),
    lang: vine.string().trim().in(['es', 'en']),
  })
)