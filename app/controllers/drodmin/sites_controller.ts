import type { HttpContext } from '@adonisjs/core/http'
import Site from '#models/site'
export default class SitesController {

  async show({ params }: HttpContext) {
    const site = await Site.findOrFail(params.siteId)
    return site
  }
}