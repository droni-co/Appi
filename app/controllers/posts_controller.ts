import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'

export default class PostsController {
  /**
   * Display a list of resource
   */
  async index({ params, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10
    const posts = await Post.query().where('site_id', params.siteId).paginate(page, limit)
    return posts
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const slug = params.id
    const post = await Post.query()
      .where('site_id', params.siteId)
      .andWhere('slug', slug)
      .andWhere('active', true)
      .firstOrFail()
    return post
  }

}