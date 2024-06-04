import type { HttpContext } from '@adonisjs/core/http'
import Site from '#models/site'
export default class SitesController {

  async index() {
    const sites = await Site.all()
    return sites
  }

  async show({ params }: HttpContext) {
    const site = await Site.findOrFail(params.siteId)
    return site
  }
}