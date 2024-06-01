import vine from '@vinejs/vine'

/**
 * Validates login
 */
export const authLoginValidator = vine.compile(
  vine.object({
    access_token: vine.string().trim(),
    provider: vine.string().trim().in(['google', 'facebook', 'github']),
    lang: vine.string().trim().in(['es', 'en']),
  })
)