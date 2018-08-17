<template>
  <div class="flex-v h">
    <div class="header">
      <router-link to="/info/home">首页</router-link>
      <router-link to="/info/post">文章</router-link>
      <div class="right">
        <el-button type="text" v-if="!isLogin">注册/登录</el-button>
        <div v-else>
          <router-link :to="`/info/message`"><img src="../assets/chat.png" alt=""><span class="fs-16 c-f v-m ml-10">聊天</span></router-link>
          <router-link :to="`/info/notification`"><img src="../assets/notice.png" alt=""><span class="fs-16 c-f v-m ml-10">消息</span><em class="tag" v-if="unread">{{unread}}</em></router-link>
          <el-popover
            placement="bottom"
            trigger="hover"
            v-if="user"
            >
            <div class="header-list">
              <router-link :to="`/info/user/${user._id}`">个人中心</router-link>
              <router-link to="/info/editor">发布文章</router-link>
              <router-link :to="`/info/user/${user._id}/posts`">我的发布</router-link>
              <router-link :to="`/info/user/${user._id}/likes`">我的喜欢</router-link>
              <router-link to="/info/reset_password">修改密码</router-link>
              <a href="javascript:;" @click="loginout">退出登录</a>
            </div>
            <el-button slot="reference" type="text" v-if="user">
              <span class="round middle" v-if="user.avatar"><img :src="`${base}/${user.avatar}`" alt=""></span>
              <span>{{user.name}}</span>
            </el-button>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {fetchSelf, logout, base, getNotificationNum} from '../api/index.js'
import {mapState, mapGetters, mapMutations} from 'vuex'
import axios from 'axios'

export default {
  name: 'info',
  data () {
    return {
      base,
      token: '',
      unread: 0,
      isLogin: false
    }
  },
  created () {
    this.id = this.$storage.get('userId')
    this.token = this.$storage.get('token')
    // header是登录用户的信息
    this.getUser({id: this.id,token: this.token})
    
    getNotificationNum(this.id, this.token).then(res => {
      console.log(res)
      this.unread = res.data.count
    })
    if(this.token && this.user){
      this.isLogin = true
    }

    this.$socket.emit('updateUserSocket', this.id)
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
          this.$storage.set('userId', '')
          this.$router.push('/login')
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
