<template>
  <div>
    <el-tabs v-model="type" @tab-click="handleTypeChange">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane label="前端" name="frontend"></el-tab-pane>
      <el-tab-pane label="android" name="android"></el-tab-pane>
      <el-tab-pane label="ios" name="ios"></el-tab-pane>
      <el-tab-pane label="后端" name="backend"></el-tab-pane>
    </el-tabs>
    <ul class="list" v-if="list.length">
      <li v-for="(item, index) of list">
        <div class="wrap">
          <div class="square" v-if="item.cover"><img :src="`${base}/${item.cover}`" alt="" class="w"></div>
          <div>
            <router-link :to="{'path': `/info/post/${item._id}`}" class="link">{{item.title}}</router-link>
            <p class="fs-12 c-9 mt-10">
              <span class="round small"><img :src="`${base}/${item.author.avatar}`" alt=""></span>
              <span class="mr-10">{{item.author.name}}</span>
              <span class="mr-10">{{item.created_at | getDateTime()}}</span>
              <span class="mr-10">阅读 {{item.viewsCount}}</span>
              <span class="mr-10">评论 {{item.commentsCount}}</span>
              <span>喜欢 {{item.collectionCount}}</span>
            </p>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class="null">
      <img src="../assets/blank.png" alt="">
      <p>暂无文章哦</p>
    </div>
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
import {base, getArticle, getSubArticle} from '../api/index.js'

export default {
  name: 'post',
  data () {
    return {
      list: [],
      type: 'all',
      total: 0,
      size: 2,
      base,
      currentPage: 1
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      if(this.type === 'all') {
        getArticle(this.currentPage, this.size).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        })
      } else {
        getSubArticle(this.type, this.currentPage, this.size).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        })
      }
    },
    handleCurrentChange (val) {
      console.log('当前页', val)
      this.fetch()
    },
    handleTypeChange (tab, event) {
      console.log('当前类别', tab, event, this.type)
      this.fetch()
    }
  }
}
</script>

<style>
.square{
  width:120px;
  height:80px;
  overflow: hidden;
  margin-right:20px;
}
</style>
