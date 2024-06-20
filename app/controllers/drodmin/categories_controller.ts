import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { adminCategoryValidator } from '#validators/admin/category'

export default class CategoriesController {
  /**
   * Display a list of resource
   */
  async index({ request, params }: HttpContext) {
    const siteId = params.siteId
    const { lang = 'all', parentId=null } = request.qs()

    const categories = await Category.query()
      .where('site_id', siteId)
      .andWhere(function (query) {
        if (lang !== 'all') {
          query.andWhere('lang', lang)
        }
      })
      .andWhere(function (query) {
        if (parentId) {
          query.andWhere('parent_id', parentId)
        }
      })
      .orderBy('parent_id', 'asc')
      .preload('children')
      .preload('parent')

    return categories
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, params }: HttpContext) {
    const siteId = params.siteId
    const payload = await adminCategoryValidator.validate({ ...request.all(), siteId })
    const category = await Category.create({...payload, siteId})
    return category
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const siteId = params.siteId
    const category = await Category.query()
      .where('site_id', siteId)
      .andWhere('id', params.id)
      .preload('children')
      .preload('parent')
      .firstOrFail()
    return category
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const siteId = params.siteId
    const category = await Category.query()
      .where('site_id', siteId)
      .andWhere('id', params.id)
      .firstOrFail()
    
    const payload = await adminCategoryValidator.validate({
      ...request.all(),
      siteId,
      categoryId: category.id,
      lang: category.lang
    })

    category.merge(payload)
    await category.save()
    return category
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const siteId = params.siteId
    const category = await Category.query()
      .where('site_id', siteId)
      .where('id', params.id)
      .firstOrFail()
    await category.delete()

    return category
  }
}