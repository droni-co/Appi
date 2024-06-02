import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'

export default class PostsController {
  /**
   * Display a list of resource
   */
  async index({ params }: HttpContext) {
    const posts = await Post.query().where('site_id', params.siteId)
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