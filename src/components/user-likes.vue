<template>
  <div>
    <ul class="list" v-if="likes.length">
      <li v-for="(item, index) of likes">
        <div class="wrap fs-16 c-3">
          <router-link :to="{'path': `/info/post/${item.entry.uid}`}" class="link">{{item.entry.title}}</router-link>
          <span class="fs-12 c-9">{{item.created_at | getDateTime()}}</span>
        </div>
      </li>
    </ul>
    <div v-else class="null">
      <img src="../assets/blank.png" alt="">
      <p>暂无喜欢哦</p>
    </div>
  </div>
</template>

<script>
import {getMyLike} from '../api/index.js'

export default {
  name: 'user-likes',
  data () {
    return {
      likes: [],
      token: ''
    }
  },
  created () {
    this.token = this.$storage.get('token')
    this.fetch(this.$route.params.id)
  },
  methods: {
    fetch (id) {
      getMyLike(id, this.token).then(res => {
        console.log(res)
        if(res.data.status === 1) {
          this.likes = res.data.data
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
