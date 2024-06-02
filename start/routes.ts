/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import SitesController from '#controllers/sites_controller'
import { middleware } from '#start/kernel'
import PostsController from '#controllers/posts_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.group(() => {
  router.get('/', [SitesController, 'show'])
  router.post('/login', [AuthController, 'login'])
  router.resource('posts', PostsController).params({ slug: 'slug'}).only(['index', 'show'])
}).prefix('/:siteId').use(middleware.site())

