import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Enrollment from '#models/enrollment'

export default class AdminSiteMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const { siteId } = ctx.params
    const user = ctx.auth.user

    const enrollment = await Enrollment.query()
      .where('site_id', siteId)
      .andWhere('user_id', user!.id)
      .andWhere('role', 'admin')
      .first()
    if (!enrollment) return ctx.response.status(404).json({ message: 'Access denied'})

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}