<template>
  <div>
    <ul class="list" v-if="posts.length">
      <li v-for="(item, index) of posts">
        <div class="wrap fs-16 c-3">
          <router-link :to="{'path': `/info/post/${item._id}`}" class="link">{{item.title}}</router-link>
          <span class="fs-12 c-9">{{new Date(item.created_at).toLocaleString()}}</span>
        </div>
        <p class="fs-14 c-6 lh-20">{{item.content.substr(0,200) + '...'}}</p>
      </li>
    </ul>
    <div v-else class="null">
      <img src="../assets/blank.png" alt="">
      <p>这里什么都没有</p>
      <p>
        <el-button type="primary" plain>
          <router-link :to="{'path': `/info/editor`}">创建一篇文章</router-link>
        </el-button>
      </p>
    </div>
  </div>
</template>

<script>
import {getMyArticle} from '../api/index.js'

export default {
  name: 'user-posts',
  data () {
    return {
      posts: [],
      token: ''
    }
  },
  created () {
    this.token = this.$storage.get('token')
    this.fetch(this.$route.params.id)
  },
  methods: {
    fetch (id) {
      getMyArticle(id, this.token).then(res => {
        if(res.data.status === 1) {
          this.posts = res.data.data
        }
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
</style>
