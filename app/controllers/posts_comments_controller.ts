import type { HttpContext } from '@adonisjs/core/http'

import Comment from '#models/comment'
import Post from '#models/post'
import { addCommentValidator } from '#validators/comment'

export default class PostsCommentsController {
  /**
   * Display a list of resource
   */
  async index({ params }: HttpContext) {
    const post = await Post.query()
      .where('site_id', params.siteId)
      .andWhere('slug', params.post_id)
      .firstOrFail()
    
    const comments = await Comment.query()
      .where('post_id', post.id)
      .andWhere('parent_id', 0)
      .andWhere('approved', true)
      .orderBy('created_at', 'asc')
      .preload('user')
      .preload('children', (query) => {
        query.where('approved', true)
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
        .andWhere('slug', params.post_id)
        .firstOrFail()
      
      const user = await auth.authenticate()
  
      const payload = await addCommentValidator.validate({
        ...request.all(),
        postId: post.id,
        userId: user.id
      })

      const approved = await Comment.query()
        .select('id')
        .where('userId', user.id)
        .andWhere('approved', true)
        .andWhereHas('post', (query) => {
          query.where('siteId', params.siteId)
        }).first()
      
      const comment = (await Comment.create({...payload, postId: post.id, userId: user.id, approved: Boolean(approved)}))
  
      return comment
    }

  /**
   * Delete record
   */
  async destroy({ auth, params }: HttpContext) {
    const post = await Post.query()
      .where('site_id', params.siteId)
      .andWhere('slug', params.post_id)
      .firstOrFail()
    
    const comment = await Comment.query()
      .where('post_id', post.id)
      .andWhere('id', params.id)
      .andWhere('userId', auth.user!.id)
      .firstOrFail()

    await comment.related('children').query().delete()
    await comment.delete()

    return comment
  }
}