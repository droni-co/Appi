import type { HttpContext } from '@adonisjs/core/http'

import Post from '#models/post'
import { adminPostValidator } from '#validators/admin/post'

export default class PostsController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const siteId = request.param('siteId')
    const { page, limit, orderBy, sort } = request.qs()
    const posts = await Post.query()
      .where('site_id', siteId)
      .orderBy(orderBy || 'updated_at', sort || 'desc')
      .paginate(page, limit)
    return posts
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth }: HttpContext) {
    const siteId = request.param('siteId')
    const user = await auth.authenticate()
    const payload = adminPostValidator.validate({... request.all(), siteId, userId: user.id})
    return payload

    const post = await Post.create(data)
    return post
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}