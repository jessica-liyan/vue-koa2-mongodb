<template>
  <div>
    <h2 class="title">聊天</h2>
    <div class="chat-top fs-16 c-3 t-c">与{{toname}}的对话</div>
    <ul class="chat-list">
      <li :class="{'chat-right': item.from._id === id}"
        v-for="(item, index) of list">
        <a href="#" class="round" v-if="item.from.avatar"><img :src="`${base}/${item.from.avatar}`" alt=""></a>
        <div class="chat-info">
          <span>{{item.content}}</span>
        </div>
      </li>
    </ul>
    <div class="chat-bottom">
      <textarea rows="2" class="textarea" v-model="content"></textarea>
      <div class="t-r">
        <el-button type="primary" @click="send" round>发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {base, sendMessage, fetchUser, getMessageList, getMessageFriends} from '../api/index.js'

export default {
  name: 'message',
  data () {
    return {
      base,
      list: [],
      content: '',
      to: '',
      toname: '',
      id: '',
      newid: ''
    }
  },
  sockets:{
    connect: function(){
      console.log('socket', this.$socket)
      this.newid = this.$socket.id
    },
    // 服务端推送对方数据
    getNewMessage: function (val) {
      console.log('新的聊天数据', val)
      this.list.push({
        to: {_id: this.id},
        from: {_id: this.to},
        content: val
      })
    }
  },
  mounted(){
  },
  created () { 
    this.id = this.$storage.get('userId')
    this.token = this.$storage.get('token')

    this.to = this.$route.query.to // 接收id
    
    if(this.to){
      fetchUser(this.to, this.token).then(res => {
        this.toname = res.data.data.name
      })
      this.updateList()
    }

    // 获取当前用户的聊天好友列表
    getMessageFriends(this.id, this.token).then(res => {
      console.log('res')
    })
  },
  methods: {
    updateList () {
      // 历史聊天记录
      getMessageList({
        to: this.to,
        from: this.id
      }, this.token).then(res => {
        console.log(res)
        this.list = res.data.data
      })
    },
    send () {
      // 测试服务器事件触发
      this.$socket.emit('chat', this.content)
      sendMessage({
        to: this.to,
        from: this.id,
        content: this.content,
        type: 'text'
      }, this.token).then(res => {
        console.log(res)
        // 消息添加到列表中
        this.list.push({
          to: {_id: this.to},
          from: {_id: this.id},
          content: this.content
        })
        console.log(this.list)
      })
    }
  }
}
</script>

<style lang="scss">
.chat-top{
  font-weight:bold;
  padding:20px 0;
  border-bottom:1px solid #ddd;
}
.chat-list{
  padding: 15px 0;
  margin-bottom:120px;
  height: 600px;
  overflow: auto;
  li{
    padding:15px 0;
  }
  .round{
    float: left;
    margin:0;
  }
  .chat-info{
    margin: 0 60px;
    span{
      display:inline-block;
      background: #F4F5F7;
      padding:9px 20px;
      border-radius: 10px;
      font-size:14px;
      color: #333;
      line-height: 1.6;
      position:relative;
      &:before{
        content:"";
        display:inline-block;
        width:0;
        height:0;
        border:10px solid transparent;
        border-top:10px solid #F4F5F7;
        position:absolute;
        left:-10px;
        top:5px;
      }
    }
  }
  .chat-right{
    .round{
      float: right;
      margin:0;
    }
    .chat-info{
      text-align:right;
      span{
        background: #20A0FF;
        color:#fff;
        &:before{
          border-top-color: #20A0FF;
          left: auto;
          right:-10px;
        }
      }
    }
  }
  
}
.chat-bottom{
  position:absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
}
</style>