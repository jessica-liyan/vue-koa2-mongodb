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

const routes = [
  { 
    path: '/',
    redirect: '/login'
  },
  { 
    path: '/login',
    component: Login
  },
  { 
    path: '/register',
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
    }]
  },
]
export default new VueRouter({
  linkActiveClass: 'active',
  routes
})
