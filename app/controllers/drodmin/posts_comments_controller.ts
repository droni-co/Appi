import type { HttpContext } from '@adonisjs/core/http'

import Post from '#models/post'
import Comment from '#models/comment'

import { adminAddCommentValidator, adminUpdateCommentValidator } from '#validators/admin/comment'

export default class PostsCommentsController {
  /**
   * Display a list of resource
   */
  async index({ params }: HttpContext) {
    const post = await Post.query()
      .where('site_id', params.siteId)
      .andWhere('id', params.post_id)
      .firstOrFail()

    const comments = await Comment.query()
      .where('post_id', post.id)
      .andWhere('parent_id', 0)
      .orderBy('created_at', 'asc')
      .preload('user')
      .preload('children', (query) => {
        query.orderBy('created_at', 'asc')
        query.preload('user')
      })

    return comments
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request, params }: HttpContext) {
    const post = await Post.query()
      .where('site_id', params.siteId)
      .andWhere('id', params.post_id)
      .firstOrFail()
    
    const user = await auth.authenticate()

    const payload = await adminAddCommentValidator.validate({
      ...request.all(),
      postId: post.id,
      userId: user.id
    })

    const comment = await Comment.create({...payload, postId: post.id, userId: user.id, approved: true})

    return comment
  }


  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const post = await Post.query()
      .where('site_id', params.siteId)
      .andWhere('id', params.post_id)
      .firstOrFail()
    
    const comment = await Comment.query()
      .where('post_id', post.id)
      .andWhere('id', params.id)
      .firstOrFail()

    const payload = await adminUpdateCommentValidator.validate(request.all())

    comment.merge(payload)
    await comment.save()

    return comment
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const post = await Post.query()
      .where('site_id', params.siteId)
      .andWhere('id', params.post_id)
      .firstOrFail()
    
    const comment = await Comment.query()
      .where('post_id', post.id)
      .andWhere('id', params.id)
      .firstOrFail()

    await comment.related('children').query().delete()    
    await comment.delete()

    return comment
  }
}