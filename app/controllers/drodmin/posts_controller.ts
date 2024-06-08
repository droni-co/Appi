import type { HttpContext } from '@adonisjs/core/http'

import Post from '#models/post'
import { adminPostValidator } from '#validators/admin/post'

export default class PostsController {
  /**
   * Display a list of resource
   */
  async index({ request, params }: HttpContext) {
    const siteId = params.siteId
    const {
      page=1,
      limit=20,
      orderBy='created_at',
      sort='desc',
      q = 'null'
    } = request.qs()
    const posts = await Post.query()
      .where('site_id', siteId)
      .andWhere(function (query) {
        if (q !== 'null') {
          query.andWhere('name', 'LIKE', `%${q}%`)
        }
      })
      .orderBy(orderBy, sort)
      .preload('user')
      .paginate(page, limit)
    return posts.serialize({
      fields: {
        omit: ['content']
      }
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth, params }: HttpContext) {
    const siteId = params.siteId
    const user = await auth.authenticate()
    const payload = await adminPostValidator.validate({... request.all(), siteId, userId: user.id})
    const post = await Post.create(payload)
    return post
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const siteId = params.siteId
    const post = await Post.query()
      .where('site_id', siteId)
      .andWhere('id', params.id)
      .preload('user').firstOrFail()
    return post
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const siteId = params.siteId
    const post = await Post.query()
      .where('site_id', siteId)
      .andWhere('id', params.id)
      .firstOrFail()
    const payload = await adminPostValidator.validate({...request.all(), siteId, userId: post.userId, postId: post.id})
    post.merge(payload)
    await post.save()
    return post
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const siteId = params.siteId
    const post = await Post.query().where('site_id', siteId).where('id', params.id).firstOrFail()
    await post.delete()
    return post
  }
}