import type { HttpContext } from '@adonisjs/core/http'
import Attachment from '#models/attachment'
import { adminAttachmentValidator } from '#validators/admin/attachments'

export default class AttachmentsController {
  /**
   * Display a list of resource
   */
  async index({ request, params }: HttpContext) {
    const siteId = params.siteId
    const { page, limit, orderBy, sort } = request.qs()
    const attachments = await Attachment.query()
      .where('site_id', siteId)
      .orderBy(orderBy || 'created_at', sort || 'desc')
      .paginate(page, limit)

    return attachments
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth, params  }: HttpContext) {
    const siteId = params.siteId
    const user = await auth.authenticate()
    const payload = await adminAttachmentValidator.validate({...request.all(), file: request.file('file')})
    const attachment = await Attachment.create({
      siteId,
      userId: user.id,
      name: payload.name,
      path: 'uploads/' + payload.file.clientName,
      size: payload.file.size,
      mime: payload.file.type,
    })
    return attachment
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}