import VueRouter from 'vue-router'
import Login from './components/login.vue'
import Register from './components/register.vue'
import Forgot from './components/forgot.vue'
import Info from './components/info.vue'
import Home from './components/home.vue'
import Post from './components/post.vue'
import User from './components/user.vue'
import Editor from './components/editor.vue'
import PostDetail from './components/post-detail.vue'
import UserActs from './components/user-activities.vue'
import UserPosts from './components/user-posts.vue'
import UserLikes from './components/user-likes.vue'
import UserFollowees from './components/user-followees.vue'
import UserFollowers from './components/user-followers.vue'
import Profile from './components/profile.vue'
import Notification from './components/notification.vue'
import Message from './components/message.vue'

import store from './store'

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
      component: Login
    },
    { 
      path: '/register',
      name: 'register',
      component: Register
    },
    { 
      path: '/forgot',
      component: Forgot
    },
    { 
      path: '/info',
      component: Info,
      redirect: '/info/home',
      children: [{
        path: 'home',
        name: 'home',
        component: Home,
      }, {
        path: 'post',
        component: Post,
      }, {
        path: 'post/:id',
        component: PostDetail,
      }, {
        path: 'user/:id',
        redirect: 'user/:id/activities',
        component: User,
        children: [{
          path: 'activities',
          component: UserActs,
        }, {
          path: 'posts',
          component: UserPosts,
        }, {
          path: 'likes',
          component: UserLikes,
        }, {
          path: 'followees',
          component: UserFollowees,
        }, {
          path: 'followers',
          component: UserFollowers,
        }]
      }, {
        path: 'user/setting/profile',
        component: Profile,
      }, {
        path: 'editor',
        component: Editor,
      }, {
        path: 'editor/:id',
        component: Editor,
      }, {
        path: 'notification',
        component: Notification,
      }, {
        path: 'message',
        component: Message,
      }, {
        path: 'message/:id',
        component: Message,
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
