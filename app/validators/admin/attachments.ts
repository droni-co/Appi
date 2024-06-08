import vine from '@vinejs/vine'

/**
 * Validates post creation
 */
export const adminAttachmentValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    file: vine.file({
      size: '1mb',
      extnames: ['jpg', 'png', 'pdf', 'xlsx', 'webp']
    })
  })
)