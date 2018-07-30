<template>
  <div class="comments">
    <textarea rows="3" class="textarea" v-model="content"></textarea>
    <div class="t-r">
      <el-button type="primary" @click="add">发表评论</el-button>
    </div>
    <h2 class="title">{{article.commentsCount}}条评论</h2>
    <comment-list></comment-list>
  </div>
</template>

<script>
import {getCommentList, addComment} from '../api/index.js'
import {mapState, mapMutations} from 'vuex'
import CommentList from './comment-list'

export default {
  name: 'comment',
  data () {
    return {
      content: '',
      token: '',
      id: '' // 文章id
    }
  },
  components: {
    'comment-list': CommentList
  },
  created () {
    this.id = this.$route.params.id
    this.token = this.$storage.get('token')
  },
  computed:{
    ...mapState({
      article: state => state.article
    }),
  },
  methods: {
    ...mapMutations({
      getComments: 'getComments',
      getArticleDetail: 'getArticleDetail'
    }),
    // 一级评论提交
    add () {
      addComment({parentId: '', targetId: this.id, content: this.content}, this.token).then(res => {
        console.log(res)
        if(res.data.status === 1){
          this.$message({
            message: '评论发表成功！',
            type: 'success',
            showClose: true
          })
          this.content = ''
          // 更新列表
          this.getComments(this.id, this.token) 
          this.getArticleDetail(this.id)
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>

