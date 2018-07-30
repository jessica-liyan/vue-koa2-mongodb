<template>
  <div>
    <div class="header">
      <router-link to="/info/home">首页</router-link>
      <router-link to="/info/post">文章</router-link>
      <div class="right">
        <el-button slot="reference" type="text" v-if="!isLogin">登录/注册</el-button>
        <el-popover
          placement="bottom"
          trigger="hover"
          >
          <div class="header-list">
            <router-link :to="`/info/user/${user._id}`">个人中心</router-link>
            <router-link to="/info/editor">发布文章</router-link>
            <router-link :to="`/info/user/${user._id}/posts`">我的发布</router-link>
            <router-link :to="`/info/user/${user._id}/likes`">我的喜欢</router-link>
            <router-link to="/info/reset_password">修改密码</router-link>
            <a href="javascript:;" @click="loginout">退出登录</a>
          </div>
          <el-button slot="reference" type="text">
            <span class="round middle" v-if="user.avatar"><img :src="`${base}/${user.avatar}`" alt=""></span>
            <span>{{user.name}}</span>
          </el-button>
        </el-popover>
      </div>
    </div>
    <div class="main mid">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {fetchSelf, logout, base} from '../api/index.js'
import {mapState, mapGetters, mapMutations} from 'vuex'

export default {
  name: 'info',
  data () {
    return {
      base,
      token: '',
      isLogin: false
    }
  },
  created () {
    this.id = this.$storage.get('userId')
    this.token = this.$storage.get('token')
    if(this.token){
      this.isLogin = true
    }
    this.getUser(this.id, this.token) // header是登录用户的信息
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapMutations(['getUser']),
    // 注销登录
    loginout () {
      logout(this.token).then(res => {
        if (res.data.status === 0) {
          this.$message({
            message: res.data.msg,
            type: 'error',
            showClose: true
          })
        } else {
          this.$message({
            message: res.data.msg,
            type: 'success',
            showClose: true
          })
          this.$storage.set('token', '')
          this.$router.push('/login')
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
