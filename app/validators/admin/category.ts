import vine from '@vinejs/vine'

/**
 * Validates post creation
 */
export const adminCategoryValidator = vine.compile(
  vine.object({
    parentId: vine.number().exists(async (db, parentId, data) => {
      if (Number(parentId) === 0) return true
      const category = await db.from('categories')
        .select('id')
        .where('id', parentId)
        .andWhere('site_id', data.data.siteId)
        .first()
      return !!category
    }),
    name: vine.string().trim(),
    slug: vine.string().unique(async (db, slug, data) => {
      const category = await db.from('categories')
        .select('id')
        .where('slug', slug)
        .andWhere('site_id', data.data.siteId)
        .andWhereNot('id', data.data.categoryId ?? 0)
        .first()
      return !category
    }),
    description: vine.string().trim().optional(),
    image: vine.string().trim().optional(),
    lang: vine.string().trim().in(['es', 'en']),
  })
)