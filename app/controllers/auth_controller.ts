import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Enrollment from '#models/enrollment'
import { authLoginValidator } from '#validators/auth'
import string from '@adonisjs/core/helpers/string'

export default class AuthController {
  async login({ request, ally, params }: HttpContext) {
    const siteId = params.siteId
    const payload = await authLoginValidator.validate(request.all())
    
    const allyUser = await ally.use('google').userFromToken(payload.access_token)
    const user = await User.firstOrCreate({
        email: allyUser.email,
      }, {
        id: crypto.randomUUID(),
        email: allyUser.email,
        name: allyUser.name,
        username: string.slug(allyUser.name)+string.random(4),
        avatar: allyUser.avatarUrl,
        lang: payload.lang,
        provider: payload.provider,
        password: string.generateRandom(32),
      })

      // Create enrollment
      const enrollment = await Enrollment.firstOrCreate({
        userId: user.id,
        siteId: siteId,
      }, {
        userId: user.id,
        siteId: siteId,
        role: 'user'
      })

      const token = await User.accessTokens.create(
        user,
        ['*'],
        {
          name: 'Appi',
          expiresIn: '30 days'
        }
      )
    
    return {user, token, enrollment}
  }
  async me({ auth }: HttpContext) {
    const enrollments = await Enrollment.query()
      .where('user_id', auth.user!.id)
      .orderBy('role', 'asc')
      .orderBy('created_at', 'desc')
      .preload('site')
    return { 
      user: auth.user,
      enrollments
    }
  }
}