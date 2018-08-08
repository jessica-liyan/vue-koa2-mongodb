import {getCommentList, getArticleDetail, fetchSelf, fetchUser, login} from './api/index'
import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

export default new vuex.Store({
  state:{
    comments: [],
    article: null,
    user: {}, // 登录用户的个人信息
    // isLogin: false
  },
  getters: {

  },
  mutations: {
    // setLogin (state, params) {
    //   state.isLogin = params
    // },
    getUser (state, params) {
      fetchUser(params.id, params.token).then(res => {
        state.user = res.data.data
      })
    },
    getComments (state, id, token) {
      getCommentList (id, token).then(res => {
        state.comments = res.data.data
      })
    },
    getArticleDetail (state, id) {
      getArticleDetail(id).then(res => {
        state.article = res.data.data
      })
    }
  },
  actions: {
    // loginAction ({commit}) {
    //   commit('setLogin', true)
    // }
  }
})

