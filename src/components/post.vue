<template>
  <div>
    <h2 class="title">文章列表</h2>
    <ul class="list" v-if="list.length">
      <li v-for="(item, index) of list">
        <div class="wrap">
          <router-link :to="{'path': `/info/post/${item._id}`}" class="link">{{item.title}}</router-link>
        </div>
        <p class="fs-12 c-9">
          <span class="mr-10">{{item.author.name}}</span>
          <span class="mr-10">{{new Date(item.created_at).toLocaleString()}}</span>
          <span class="mr-10">阅读 {{item.viewsCount}}</span>
          <span class="mr-10">评论 {{item.commentsCount}}</span>
          <span>喜欢 {{item.collectionCount}}</span>
        </p>
      </li>
    </ul>
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import {getArticle} from '../api/index.js'

export default {
  name: 'post',
  data () {
    return {
      list: [],
      total: 0,
      size: 3,
      currentPage: 1
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      getArticle(this.currentPage, this.size).then(res => {
        this.list = res.data.data
        this.total = res.data.total
      })
    },
    handleCurrentChange (val) {
      console.log('当前页', val)
      this.fetch()
    }
  }
}
</script>

<style>
</style>
