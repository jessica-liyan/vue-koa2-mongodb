<template>
  <div class="user">
    <div class="user-header">
      <div><span class="round middle" v-if="user.avatar"><img :src="`${base}/${user.avatar}`" alt=""></span></div>
      <div style="flex:1">
        <h2>{{user.name}}</h2>
        <p class="fs-14 c-9">
          <img src="../assets/job.png" alt="">
          <span class="v-m ml-10 mr-20" v-if="user.job">{{user.job}}</span>
          <span class="v-m ml-10 mr-20" v-else>暂无职位</span>
          <img src="../assets/desc.png" alt="">
          <span class="v-m ml-10" v-if="user.selfDesc">{{user.selfDesc}}</span>
          <span class="v-m ml-10" v-else>暂无简介</span>
        </p>
      </div>
      <dl class="t-c" style="margin:0 30px;cursor:pointer" v-on:click="showFollowees">
        <dt class="fs-18 c-3">{{user.followeesCount}}</dt>
        <dd class="fs-14 c-9">关注</dd>
      </dl>
      <dl class="t-c" style="margin:0 30px;cursor:pointer" v-on:click="showFollowers">
        <dt class="fs-18 c-3">{{user.followersCount}}</dt>
        <dd class="fs-14 c-9">粉丝</dd>
      </dl>
      <el-button type="primary" plain v-if="isMine" @click="edit">编辑个人资料</el-button>
      <div v-else>
        <el-button type="success" icon="el-icon-plus" plain v-if="!isFollowed" @click="follow(user._id)">关注</el-button>
        <el-button type="success" icon="el-icon-check" v-if="isFollowed" @click="unfollow(user._id)">已关注</el-button>
      </div>
    </div>
    <div class="tabs">
      <router-link to="activities">动态</router-link>
      <router-link to="posts">专栏</router-link>
      <router-link to="likes">喜欢</router-link>
      <router-link to="followees">关注</router-link>
      <router-link to="followers">粉丝</router-link>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {fetchUser, base, fetchSelf, isFollowedUser, followUser, unfollowUser} from '../api/index.js'

export default {
  name: 'user',
  data () {
    return {
      user: {},
      base,
      isMine: false,
      isFollowed: false,
      token: ''
    }
  },
  created () { 
    this.id = this.$storage.get('userId')
    this.token = this.$storage.get('token')
    // 判断是否登录本人
    if (this.$route.params.id === this.id) { 
      this.isMine = true
    } else {
      this.isMine = false
    }
    // 如果作者非本人，判断这篇文章的作者是否关注过
    if(!this.isMine){
      isFollowedUser(this.$route.params.id, this.id, this.token).then(res => {
        this.isFollowed = res.data.data.isFollowed
      })
    }
    this.fetch(this.$route.params.id)
  },
  methods: {
    showFollowees () {
      this.$router.push('followees')
    },
    showFollowers () {
      this.$router.push('followers')
    },
    edit () {
      this.$router.push('/info/user/setting/profile')
    },
    fetch (id) {
      fetchUser(id, this.token).then(res => {
        console.log('执行了', res)
        this.user = res.data.data
      })
    },
    follow (id) {
      this.isFollowed = true
      followUser(id, this.id, this.token).then(res => {
        console.log(res)
        this.fetch(id)
      })
    },
    unfollow (id) {
      this.isFollowed = false
      unfollowUser(id, this.id, this.token).then(res => {
        console.log(res)
        this.fetch(id)
      })
    }
  },
  watch: {
    $route (to, from) {
      this.fetch(to.params.id)
    }
  }
}
</script>

<style lang="scss">
.user-header{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding:20px 0;
  .round{
    display:inline-block;
    vertical-align:middle;
    width:100px;
    height:100px;
    border-radius: 50%;
    overflow: hidden;
    border:1px solid #dcdcdc;
    text-align:center;
    img{
      width:100%;
    }
  }
  h2{
    display:inline-block;
    vertical-align:middle;
    font-size: 20px;
    font-weight: normal;
    color: #333;
  }
}

</style>
