<template>
  <div>
    <ul class="list" v-if="data.length">
      <li v-for="(item, index) of data">
        <div>
          <span class="round middle"><img :src="`${base}/${item.follower.avatar}`" alt=""></span>
          <div class="ib v-m">
            <p class="fs-16 c-3 mb-5">{{item.follower.name}}</p>
            <p class="fs-12 c-9">{{item.follower.selfDesc}}</p>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class="null">
      <img src="../assets/blank.png" alt="">
      <p>暂无粉丝哦</p>
    </div>
  </div>
</template>

<script>
import {base, getFollowerList} from '../api/index.js'

export default {
  name: 'user-followers',
  data () {
    return {
      data: [],
      base,
      token: ''
    }
  },
  created () {
    this.token = this.$storage.get('token')
    this.fetch(this.$route.params.id)
  },
  methods: {
    fetch (id) {
      getFollowerList(id, this.token).then(res => {
        console.log(res)
        if(res.data.status === 1) {
          this.data = res.data.data
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
