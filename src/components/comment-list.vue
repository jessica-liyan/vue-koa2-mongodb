<template>
  <div>
    <ul class="comment" v-if="comments.length">
      <li v-for="(item, index) of comments">
        <div class="comment-info">
          <a :href="`#/info/user/${item.user._id}`" target="_blank"><span class="round"><img :src="base + '/' + item.user.avatar" alt=""></span></a>
          <div style="flex:1;">
            <a :href="`#/info/user/${item.user._id}`"  class="fs-16 c-3" target="_blank">{{item.user.name}}</a>
            <p class="fs-14 c-6">{{item.content}}</p>
            <div>
              <span class="v-m mr-10 fs-12">{{item.created_at | getDateTime()}}</span>
              <a href="javascript:;" class="reply" ref="reply" v-on:click="showComment(index)">
                <img src="../assets/comment.png" alt="">
                <span class="v-m">
                  <span v-if="item.children.length">{{item.children.length}}条</span>回复
                </span>
              </a>
              <div class="sub">
                <ul v-if="item.children.length">
                  <li v-for="(child, idx) of item.children">
                    <div class="comment-info">
                      <a :href="`#/info/user/${child.user._id}`" target="_blank"><span class="round"><img :src="base + '/' + child.user.avatar" alt=""></span></a>
                      <div style="flex:1;">
                        <a :href="`#/info/user/${child.user._id}`" target="_blank"><span class="c-blue">{{child.user.name}}:</span></a>
                        <span class="ml-10" v-html="child.content"></span></p>
                        <p>
                          <span class="v-m mr-10 fs-12">{{child.created_at | getDateTime()}}</span>
                          <a href="javascript:;" class="reply" v-on:click="showSubComment(index, child.user)"><img src="../assets/comment.png" alt=""><span class="v-m">回复</span></a>
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
                <textarea rows="3" class="textarea" ref="textarea" placeholder="写一下评论吧" v-model="content"></textarea>
                <div class="t-r">
                  <el-button type="primary" @click="add(item._id)">发表评论</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class="null">
      <img src="../assets/blank.png" alt="">
      <p>暂无评论哦</p>
    </div>
  </div>
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
      base,
      replyUser: {},
      id: '' // 文章id
    }
  },
  computed:{
    ...mapState({
      comments: state => state.comments
    }),
  },
  created () {
    this.id = this.$route.params.id
    this.token = this.$storage.get('token')
    this.getComments(this.id, this.token)
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
    showComment (index) {
      const classes = this.$refs.reply[index].classList
      if(!classes.contains('active')){
        classes.add('active')
      } else {
        classes.remove('active')
      }
    },
    showSubComment (index, user) {
      this.replyUser = user
      this.$refs.textarea[index].placeholder = `回复 ${user.name}`
    },
    // 非一级评论提交
    add (id) { // 此处的id都是一级评论的id
      if (this.replyUser._id) {
        this.content = `<a class="c-blue mr-10" href="#/info/user/${this.replyUser._id}" target="_blank">@${this.replyUser.name}</a>${this.content}`
      }
      addComment({parentId: id, targetId: this.id, content: this.content}, this.token).then(res => {
        console.log(res)
        if(res.data.status === 1){
          this.$message({
            message: '评论发表成功！',
            type: 'success',
            showClose: true
          })
          this.content = ''
          // 更新评论列表
          this.getComments(this.id, this.token)
          // 更新文章
          this.getArticleDetail(this.id)
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

