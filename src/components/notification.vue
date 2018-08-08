<template>
  <div>
    <h2 class="title">用户消息</h2>
    <ul class="list line" v-if="list.length">
      <li v-for="(item, index) of list">
        <div v-if="item.type === 'follow'">
          <p class="fs-14 c-3 mt-10 mb-10">新的关注者</p>
        </div>
        <div class="wrap" v-if="item.user">
          <div><span class="round middle">
            <img :src="`${base}/${item.user.avatar}`" alt="">
          </span></div>
          <div>
            <p class="fs-16 c-3 mb-5">{{item.user.name}}</p>
            <p class="fs-12 c-9">{{item.user.job}}  {{new Date(item.created_at).toLocaleString()}}</p>
          </div>
        </div>
        <p v-if="item.comment" class="fs-14 c-3">{{item.comment.content}}</p>
        <div class="info fs-14 c-9 mt-10 mb-10" v-if="item.entry">
          <span v-if="item.type === 'comment'">评论了</span>
          <span v-if="item.type === 'collection'">喜欢了</span>
          <router-link :to="{'path': `/info/post/${item.entry.uid}`}" class="link fs-14 c-3 ml-10">{{item.entry.title}}</router-link>
        </div>
      </li>
    </ul>
    <div v-else class="null">
      <img src="../assets/blank.png" alt="">
      <p>暂无消息哦</p>
    </div>
  </div>
</template>

<script>
import {base, getNotification} from '../api/index.js'

export default {
  name: 'notification',
  data () {
    return {
      list: [],
      base
    }
  },
  created () { 
    this.id = this.$storage.get('userId')
    this.token = this.$storage.get('token')
    getNotification(this.id, this.token).then(res => {
      console.log(res)
      this.list = res.data.data
    })
  },
  methods: {
    
  }
}
</script>