<template>
  <div>
    <div class="header">
      <router-link to="/info/home">首页</router-link>
      <router-link to="/info/post">文章</router-link>
      <div class="right">
        <router-link :to="`/info/notification`"><img src="../assets/notice.png" alt=""><span class="fs-16 c-f v-m ml-10">消息</span><em class="tag">9</em></router-link>
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
    <div class="main mid">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {fetchSelf, logout, base} from '../api/index.js'
import {mapState, mapGetters, mapMutations} from 'vuex'
import axios from 'axios'

export default {
  name: 'info',
  data () {
    return {
      base,
      token: ''
    }
  },
  created () {
    this.id = this.$storage.get('userId')
    this.token = this.$storage.get('token')
    if(!this.token){ // 表示未登录
      this.$router.push('/login')
    }
    this.getUser({id: this.id,token: this.token}) // header是登录用户的信息
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
.tag{
  display: inline-block;
  padding:3px 6px;
  font-size: 12px;
  color: #fff;
  background: red;
  border-radius: 10px;
  line-height:1;
  font-style:normal;
  position: relative;
  left: 5px;
  top: -5px;
}
</style>
