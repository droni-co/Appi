import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Site from '#models/site'

export default class SiteMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const { siteId } = ctx.params
    const { key } = ctx.request.headers()
    const site = await Site.query().where('id', siteId).where('key', key ?? '').first()
    if (!site) return ctx.response.status(404).json({ message: 'Site not found'})

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}