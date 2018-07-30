<template>
  <div class="article">
    <div v-if="Object.keys(article).length">
      <h2 class="article-tit">{{article.title}}</h2>
      <div class="article-tips">
        <a :href="`#/info/user/${article.author._id}`" target="_blank"><i class="round" v-if="article.author.avatar"><img :src="`${base}/${article.author.avatar}`" alt=""></i></a>
        <div class="ib v-m">
          <p class="fs-16 c-3 mb-5">
            {{article.author.name}}
            <el-button size="mini" type="success" icon="el-icon-plus" plain v-if="!isMyArticle && !isFollowed" @click="follow(article.author._id)">关注</el-button>
            <el-button size="mini" type="success" icon="el-icon-check" v-if="!isMyArticle && isFollowed" @click="unfollow(article.author._id)">已关注</el-button>
          </p>
          <p class="fs-12 c-9">
            <i>{{new Date(article.created_at).toLocaleString()}}</i>
            <i>阅读 {{article.viewsCount}}</i>
            <i>评论 {{article.commentsCount}}</i>
            <i>喜欢 {{article.collectionCount}}</i>
            <router-link :to="{'path': `/info/editor/${article._id}`}" class="c-blue mr-10" v-if="isMyArticle">编辑</router-link>
            <a href="javasricpt:;" v-on:click="del" v-if="isMyArticle" class="fs-12 c-blue">删除</a>
          </p>
        </div>
      </div>
      <div>
        <img v-if="article.cover" :src="base + '/' + article.cover" class="avatar">
      </div>
      <mavon-editor v-model="article.content"
        :boxShadow="false"
        :editable="false"
        :toolbarsFlag="false"
        :subfield="false"
        defaultOpen="preview"
        class="blank"
      />
      <div class="t-c">
        <a href="javascript:;" class="love-btn" :class="{'active': isLiked}"v-on:click="love" ref="love"><span>喜欢</span><span>|</span><span>{{article.collectionCount}}</span></a>
      </div>
      <comment></comment>
    </div>
    <div v-else class="null">
      <img src="../assets/blank.png" alt="">
      <p>文章不存在！</p>
    </div>
  </div>
</template>

<script>
import {base, deleteArticle, fetchSelf, likeArticle, dislikeArticle, getMyLike, followUser, unfollowUser, getFolloweeList} from '../api/index.js'
import {mapState, mapMutations} from 'vuex'
import Comment from './comment'

export default {
  name: 'post-detail',
  data () {
    return {
      isMyArticle: false,
      token: '',
      base,
      isLiked: false,  //初始加载的时候判断是否已经被喜欢
      isFollowed: false 
    }
  },
  components: {
    'comment': Comment
  },
  computed:{
    ...mapState({
      article: state => state.article
    }),
  },
  created () {
    this.getArticleDetail(this.$route.params.id)
    this.id = this.$storage.get('userId')
    this.token = this.$storage.get('token')
    if(this.token){
      // 获取用户信息
      fetchSelf(this.token).then(res => {
        // 判断是否作者本人
        if(this.article.author._id === this.id){
          this.isMyArticle = true
        }
        // 判断这篇文章是否是用户喜欢列表中的
        getMyLike(this.id, this.token).then(res => {
          console.log(res)
          let index = res.data.data.findIndex(x => x.entry.uid === this.article._id)
          if(index !== -1) {
            this.isLiked = true
          }
        })
        // 判断这篇文章的作者是否关注过
        getFolloweeList(this.id, this.token).then(res => {
          console.log(res)
          let idx = res.data.data.findIndex(x => x.followeeId === this.article.author._id)
          if(idx !== -1) {
            this.isFollowed = true
          }
        })
      })
    }
  },
  methods: {
    ...mapMutations({
      getArticleDetail: 'getArticleDetail'
    }),
    del () {
      if(confirm('删除文章后不可恢复，确定删除吗？')){
        deleteArticle(this.$route.params.id).then(res => {
          console.log(res)
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
            this.$router.go(-1)
          }
        })
      }
    },
    love () {
      const classes = this.$refs.love.classList
      if(!classes.contains('active')){
        classes.add('active')
        likeArticle(this.article._id, this.token).then(res => {
          console.log(res)
          //this.article = res.data
          this.getArticleDetail(this.article._id)
        })
      } else {
        classes.remove('active')
        dislikeArticle(this.article._id, this.token).then(res => {
          console.log(res)
          //this.article = res.data
          this.getArticleDetail(this.article._id)
        })
      }
    },
    follow (id) {
      this.isFollowed = true
      followUser(id, this.id, this.token).then(res => {
        console.log(res)
      })
    },
    unfollow (id) {
      this.isFollowed = false
      unfollowUser(id, this.id, this.token).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss">
.article{
  width:70%;
  margin:0 auto;
  text-align:left;
  .article-tit{
    font-size:20px;
    color:#333;
    font-weight:bold;
    margin:0;
    padding-top:30px;
  }
  .article-tips{
    border-bottom:1px solid #ddd;
    padding:20px 0 15px 0;
    margin-bottom:20px;
    i{
      margin-right:10px;
    }
  }
  .blank{
    .v-note-panel{
      border:0!important;
    }
    .v-show-content{
      background:#fff!important;
    }
  }
  .love-btn{
    display:inline-block;
    border:1px solid #ff5555;
    padding: 20px 30px 20px 60px;
    border-radius: 30px;
    font-size:0;
    margin:20px 0 40px 0;
    background: url('../assets/love.png') no-repeat 30px center;
    span{
      font-size:16px;
      color: #ff5555;
      margin-left:10px;
      vertical-align:middle;
      line-height:1;
    }
    &:hover{
      background-color: #FEF7F6;
    }
    &.active{
      background-image:url('../assets/love_active.png')
    }
  }
}
</style>