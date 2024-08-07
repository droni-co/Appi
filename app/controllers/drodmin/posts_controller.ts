import type { HttpContext } from '@adonisjs/core/http'

import Post from '#models/post'
import Category from '#models/category'
import Comment from '#models/comment'
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
      q = 'null',
      lang = 'all'
    } = request.qs()
    const posts = await Post.query()
      .where('site_id', siteId)
      .andWhere(function (query) {
        if (q !== 'null') {
          query.andWhere('name', 'LIKE', `%${q}%`)
        }
      })
      .andWhere(function (query) {
        if (lang !== 'all') {
          query.andWhere('lang', lang)
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
    const post = await Post.create({...payload, siteId, userId: user.id})
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
      .preload('user')
      .preload('categories')
      .firstOrFail()
    return post
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const post = await Post.query()
      .where('site_id', params.siteId)
      .andWhere('id', params.id)
      .firstOrFail()
    const payload = await adminPostValidator.validate({
      ...request.all(),
      siteId: params.siteId,
      postId: post.id,
      lang: post.lang
    })

    if(payload.categories) {
      this.attachCategories(post, payload.categories)
    }
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

  /**
   * Props Lists
   */
  async props({ params }: HttpContext) {
    const siteId = params.siteId
    const props = await Post.query().select('props').where('site_id', siteId).andWhereNotNull('props')
    const result = new Set()
    props.forEach(e => {
      if(!e.props || typeof e.props === 'string') return
      e.props.forEach((ei: any) => {
        result.add(ei.name)
      })
    })
    return Array.from(result)
  }

  /**
   * Attach categories to post
   */
  async attachCategories(post: Post, categories:{id: number}[]) {
    const categoryIds = categories.map(e => e.id)
    const categiesList = await Category.query()
      .where('site_id', post.siteId)
      .andWhereIn('id', categoryIds)
      .andWhere('lang', post.lang)
    await post.related('categories').sync(categiesList.map(e => e.id))
  }

  /**
   * Moderate All comments
   */
  async comments({ params }: HttpContext) {
    const { page=1, limit=20, approved=false } = params
    const siteId = params.siteId
    const comments = await Comment.query().whereHas('post', (query) => {
      query.where('site_id', siteId)
    })
    .andWhere('approved', approved)
    .preload('post')
    .preload('user')
    .preload('children')
    .orderBy('created_at', 'asc')
    .paginate(page, limit)

    return comments
  }
}