/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AuthController from '#controllers/auth_controller'
import SitesController from '#controllers/sites_controller'
import PostsController from '#controllers/posts_controller'
// Admin controllers
import AdminPostsController from '#controllers/admin/posts_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.group(() => {
  router.get('/', [SitesController, 'show'])
  router.post('/login', [AuthController, 'login'])
  router.resource('posts', PostsController).params({ slug: 'slug'}).only(['index', 'show'])
  // User area
  router.group(() => {
    router.get('/me', [AuthController, 'me'])
  }).use(middleware.auth())

  // Admin site
  router.group(() => {
    router.resource('posts', AdminPostsController).apiOnly()
  })
  .prefix('/admin').as('admin')
  .use([middleware.auth(), middleware.adminSite()])
  
}).prefix('/:siteId').use(middleware.site())


