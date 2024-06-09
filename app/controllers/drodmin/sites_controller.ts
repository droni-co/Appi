import type { HttpContext } from '@adonisjs/core/http'
import Site from '#models/site'
import { adminSiteValidator } from '#validators/admin/site'
export default class SitesController {

  async show({ params }: HttpContext) {
    const site = await Site.findOrFail(params.siteId)
    return site
  }

  async update({ params, request }: HttpContext) {
    const site = await Site.findOrFail(params.siteId)
    const payload = await adminSiteValidator.validate({...request.except(['key', 'id']), siteId: params.siteId })
    site.merge(payload)
    await site.save()
    return site
  }
}