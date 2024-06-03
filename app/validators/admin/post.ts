import vine from '@vinejs/vine'

/**
 * Validates post creation
 */
export const adminPostValidator = vine.compile(
  vine.object({
    siteId: vine.string().trim(),
    userId: vine.string().trim(),
    name: vine.string().trim(),
    slug: vine.string().trim(),
    description: vine.string().trim().optional(),
    image: vine.string().trim().optional(),
    content: vine.string().trim().optional(),
    format: vine.string().trim().in(['html', 'markdown']),
    active: vine.boolean(),
    props: vine.any().optional(),
    lang: vine.string().trim().in(['es', 'en']),
  })
)