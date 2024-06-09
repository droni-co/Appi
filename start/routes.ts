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
import DrodminSitesController from '#controllers/drodmin/sites_controller'
import DrodminAttachmentsController from '#controllers/drodmin/attachments_controller'
import DrodminPostsController from '#controllers/drodmin/posts_controller'


// Drodmin routes
router.group(() => {
  router.get('/', [DrodminSitesController, 'show']).as('site')
  router.get('/me', [AuthController, 'me']).as('me')
  router.resource('attachments', DrodminAttachmentsController).only(['index', 'store', 'destroy'])
  router.get('/posts/props', [DrodminPostsController, 'props']).as('posts.props')
  router.resource('posts', DrodminPostsController).apiOnly()

})
.prefix('/drodmin/:siteId').as('drodmin')
.use([middleware.auth(), middleware.adminSite()])

router.get('/', [SitesController, 'index'])
router.group(() => {
  router.get('/me', [AuthController, 'me'])
}).use(middleware.auth())
router.group(() => {
  router.get('/', [SitesController, 'show'])
  router.post('/login', [AuthController, 'login'])
  router.resource('posts', PostsController).only(['index', 'show'])
  // User area
  
}).prefix('/:siteId').use(middleware.site())



