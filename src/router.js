import VueRouter from 'vue-router'

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    { 
      path: '/',
      redirect: '/login'
    },
    { 
      path: '/login',
      name: 'login',
      component: () => import('./components/login.vue')
    },
    { 
      path: '/register',
      name: 'register',
      component: () => import('./components/register.vue')
    },
    { 
      path: '/forgot',
      component: () => import('./components/forgot.vue')
    },
    { 
      path: '/info',
      component: () => import('./components/info.vue'),
      redirect: '/info/home',
      children: [{
        path: 'home',
        name: 'home',
        component: () => import('./components/home.vue'),
      }, {
        path: 'post',
        component: () => import('./components/post.vue'),
      }, {
        path: 'post/:id',
        component: () => import('./components/post-detail.vue'),
      }, {
        path: 'user/:id',
        redirect: 'user/:id/activities',
        component: () => import('./components/user.vue'),
        children: [{
          path: 'activities',
          component: () => import('./components/user-activities.vue'),
        }, {
          path: 'posts',
          component: () => import('./components/user-posts.vue'),
        }, {
          path: 'likes',
          component: () => import('./components/user-likes.vue'),
        }, {
          path: 'followees',
          component: () => import('./components/user-followees.vue'),
        }, {
          path: 'followers',
          component: () => import('./components/user-followers.vue'),
        }]
      }, {
        path: 'user/setting/profile',
        component: () => import('./components/profile.vue'),
      }, {
        path: 'editor',
        component: () => import('./components/editor.vue'),
      }, {
        path: 'editor/:id',
        component: () => import('./components/editor.vue'),
      }, {
        path: 'notification',
        component: () => import('./components/notification.vue'),
      }, {
        path: 'message',
        redirect: 'message/text',
        component: () => import('./components/message.vue'),
      }, {
        path: 'message/:type',
        component: () => import('./components/message.vue'),
      }, {
        path: 'message/:type/:id',
        component: () => import('./components/message.vue'),
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 全局登录判断
  const whiteList = ['/login', '/register', '/info/post', '/info/post/:id']

  const token = localStorage.getItem('token')

  if (token) {
    // 有token
    if (to.name === 'login') {
      router.push({ name: 'home' });
    } else {
      // 此处可增加权限判断
      next()
    }
  } else {
    // 无token
    if (whiteList.indexOf(to.path) === -1) { // 不在白名单，路由守卫
      router.push({ name: 'login' })
    } else { // 在白名单中，直接进入
      next()
    }
  }
})

function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

export default router
