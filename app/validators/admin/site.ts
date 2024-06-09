import vine from '@vinejs/vine'

/**
 * Validates post creation
 */
export const adminSiteValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    domain: vine.string().trim().unique(async (db, domain, data) => {
      const site = await db.from('sites')
        .select('id')
        .where('domain', domain)
        .andWhereNot('id', data.data.siteId ?? 0)
        .first()
      return !site
    }),
    description: vine.string().trim(),
    logo: vine.string().url().trim(),
    props: vine.array(vine.object({
      name: vine.string().trim(),
      value: vine.string().trim(),
    }))
  })
)