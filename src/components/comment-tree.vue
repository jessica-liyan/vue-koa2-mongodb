<template>
  <ul class="comment">
    <li v-for="(item, index) of data">
      <div class="comment-info">
        <span class="round"><img :src="base + '/' + item.userInfo.avatar" alt=""></span>
        <div style="flex:1;">
          <p class="tit">{{item.userInfo.name}}</p>
          <p class="content">{{item.content}}</p>
          <div>
            <a href="javascript:;" class="reply" ref="reply" v-on:click="showSubComment(index)">
              <img src="../assets/comment.png" alt="">
              <span class="v-m">
                <span v-if="item.children.length">{{item.children.length}}条</span>评论
              </span>
            </a>
            <div class="sub">
              <comment-tree :data="item.children"></comment-tree>
              <textarea rows="3" class="textarea" v-model="content"></textarea>
              <div class="t-r">
                <el-button type="primary" @click="add(item._id, item.targetId)">发表评论</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import {base, addComment, getCommentList} from '../api/index.js'
import {mapState, mapMutations} from 'vuex';

export default {
  name: 'comment-tree',
  data () {
    return {
      token: '',
      content: '',
      base
    }
  },
  computed:{
    ...mapState({
      comments: state => state.comments
    }),
  },
  created () {
    this.token = this.$storage.get('token')
  },
  props: {
    data: {
      type: Array
    }
  },
  methods: {
    ...mapMutations({
      getComments: 'getComments',
      getArticleDetail: 'getArticleDetail'
    }),
    showSubComment (index) {
      const classes = this.$refs.reply[index].classList
      if(!classes.contains('active')){
        classes.add('active')
      } else {
        classes.remove('active')
      }
    },
    // 非一级评论提交
    add (id, targetId) {
      addComment({parentId: id, targetId: targetId, content: this.content}, this.token).then(res => {
        console.log(res)
        if(res.data.status === 1){
          this.$message({
            message: '评论发表成功！',
            type: 'success',
            showClose: true
          })
          this.content = ''
          // 更新评论列表
          this.getComments(targetId, this.token)
          // 更新文章
          this.getArticleDetail(targetId)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.comment{
  li{
    padding: 15px 0;
    border-bottom:1px dashed #dcdcdc;
    .comment-info{
      display:flex;
      flex-direction:row;
      text-align:left;
      font-size: 14px;
      color:#666;
      line-height:2;
      .tit{
        color: #000;
      }
      .reply{
        span{
          font-size:14px;
          color:#999;
          margin-left:5px;
        }
        &.active + .sub{
          display:block;
        }
      }
      .sub{
        margin-top:10px;
        border-left:3px solid #D9D9D9;
        padding-left:20px;
        display:none;
      }
    }
  }
}
</style>

