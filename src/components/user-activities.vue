<template>
  <div>
    <ul class="list" v-if="activities.length">
      <li v-for="(item, index) of activities">
        <div class="wrap fs-14 c-9">
          <div v-if="item.type === 'add'">添加了文章</div>
          <div v-if="item.type === 'update'">更新了文章</div>
          <div v-if="item.type === 'delete'">删除了文章</div>
          <div v-if="item.type === 'collection'">喜欢了文章</div>
          <div v-if="item.type === 'comment'">评论了文章</div>
          <div v-if="item.type === 'follow'">关注了用户</div>
          <span class="fs-12">{{new Date(item.created_at).toLocaleString()}}</span>
        </div>
        <div v-if="item.comment">
          <p class="fs-14 c-3 mb-10">{{item.comment.content}}</p>
        </div>
        <div v-if="item.followee">
          <span class="round middle"><img :src="`${base}/${item.followee.avatar}`" alt=""></span>
          <div class="ib v-m">
            <p class="fs-16 c-3 mb-5">{{item.followee.name}}</p>
            <p class="fs-12 c-9">{{item.followee.selfDesc}}</p>
          </div>
        </div>
        <div class="info" v-if="item.entry">
          <router-link :to="{'path': `/info/post/${item.entry.uid}`}" class="link fs-14 c-3">{{item.entry.title}}</router-link>
        </div>
      </li>
    </ul>
    <div v-else class="null">
      <img src="../assets/blank.png" alt="">
      <p>暂无动态哦</p>
    </div>
  </div>
</template>

<script>
import {base, getMyLog} from '../api/index.js'

export default {
  name: 'user-activities',
  data () {
    return {
      activities: [],
      token: '',
      base
    }
  },
  created () {
    this.token = this.$storage.get('token')
    this.fetch(this.$route.params.id)
  },
  methods: {
    fetch (id) {
      getMyLog(id, this.token).then(res => {
        console.log(res)
        this.activities = res.data.data
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
