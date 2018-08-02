import {getCommentList, getArticleDetail, fetchSelf, fetchUser} from './api/index'
import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

export default new vuex.Store({
  state:{
    comments: [],
    article: null,
    user: {
      _id: ''
    }, // 登录用户的个人信息
  },
  mutations: {
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
  }
})

