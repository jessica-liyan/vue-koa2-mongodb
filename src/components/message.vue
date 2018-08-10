<template>
  <div>
    <h2 class="title">聊天</h2>
    <el-row class="chat">
      <el-col :span="6">
        <el-tabs v-model="type" @tab-click="handleTypeChange">
          <el-tab-pane label="好友" name="text">
            <ul class="list" v-if="friends.length">
              <li v-for="(item, index) of friends" @click="openChat(item)" :class="{'active': to === item._id}">
                <a href="#" class="round" v-if="item.avatar"><img :src="`${base}/${item.avatar}`" alt=""></a>
                <span class="fs-14 c-3">{{item.name}}</span>
                <span class="tag" v-if="item.unread">{{item.unread}}</span>
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="群组" name="group">
            <ul class="list" v-if="groups.length">
              <li v-for="(item, index) of groups" @click="openChat(item)" :class="{'active': to === item._id}">
                <a href="#" class="round" v-if="item.avatar"><img :src="`${base}/${item.avatar}`" alt=""></a>
                <span class="fs-14 c-3">{{item.name}}</span>
                <span class="tag" v-if="item.unread">{{item.unread}}</span>
              </li>
            </ul>
            <div v-else class="t-c">
              <p class="fs-14 c-6 mb-10">暂无群组，创建一个吧~</p>
              <el-button type="primary" @click="visible = true">创建群</el-button>
              <el-dialog title="创建群组" :visible.sync="visible">
                <el-form :model="group" label-width="100px">
                  <el-form-item label="群组名称">
                    <el-input v-model="group.name" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="群组头像">
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="visible = false">取 消</el-button>
                  <el-button type="primary" @click="visible = true;createGroup()">确 定</el-button>
                </div>
              </el-dialog>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="18">
        <div class="chat-top fs-16 c-3 t-l">{{toname}}</div>
        <ul class="chat-list" ref="content">
          <li :class="{'chat-right': item.from._id === id}"
            v-for="(item, index) of messages">
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
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
import {base, sendMessage, fetchUser, getMessageList, getMessageFriends, fetchUserList, getGroupList} from '../api/index.js'
import {mapState} from 'vuex'

export default {
  name: 'message',
  data () {
    return {
      base,
      friends: [],
      groups: [],
      messages: [],
      group: {
        name: '',
      },
      content: '',
      to: '',
      toname: '',
      id: '',
      type: 'text',  // 聊天类型  text/group
      visible: false
    }
  },
  sockets:{
    connect: function(){
      console.log('socket', this.$socket)
      this.$socket.emit('join', this.user)
    },
    // 服务端推送对方数据
    getNewMessage: function (item) {
      console.log('新的聊天数据', item) 
      // 判断是不是当前聊天的好友
      if(item.from._id === this.to){
        this.messages.push(item)
      } else {
        let fromUser = this.friends.find(x => x._id === item.from._id)
        if(fromUser){
          fromUser.unread = fromUser.unread + 1
        }
      }
    }
  },
  created () { 
    this.id = this.$storage.get('userId')
    this.token = this.$storage.get('token')

    this.to = this.$route.params.id // 刷新页面，获取路由id

    // 路由
    if(this.to){
      fetchUser(this.to, this.token).then(res => {
        this.toname = res.data.data.name
      })
      this.updateList()
    }

    // 获取好友/群组列表
    this.getList()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 好友/群组列表
    getList () {
      if(this.type === 'text'){
        fetchUserList().then(res => {
          let friends = res.data.data
          friends.splice(friends.findIndex(x => x._id === this.id), 1)
          friends.map((fri) => {
            fri.unread = 0
          })
          this.friends = friends
        })
      } else {
        getGroupList(this.token).then(res => {
          this.groups = res.data.data
          console.log('群组', this.groups)
        })
      }
    },
    // 聊天记录
    updateList () {
      getMessageList({
        to: this.to,
        from: this.id
      }, this.token).then(res => {
        console.log(res)
        this.messages = res.data.data
      })
    },
    // 打开聊天窗口
    openChat (item) {
      this.to = item._id
      this.toname = item.name
      this.$router.push(`/info/message/${item._id}`)
      this.updateList()
    },
    // 标签页改变
    handleTypeChange () {
      this.getList()
    },
    // 创建群
    createGroup () {

    },
    // 服务器获取消息推送
    send () {
      const messageData = {
        to: this.to,
        from: this.id,
        content: this.content,
        type: 'text'
      }
      this.$socket.emit('chat', messageData)
      this.messages.push({
        from: this.user,
        content: this.content
      })
      this.content = ''
    },
    scrollToBottom () {
      this.$nextTick(() => {
        var content = this.$refs.content
        content.scrollTop = content.scrollHeight
      })
    }
  },
  watch: {
    'messages': 'scrollToBottom'
  }
}
</script>

<style lang="scss">
.chat{
  border:1px solid #ccc;
  border-top: 0;
  .el-tabs__nav-wrap{
    padding-left: 20px!important;
  }
  .list{
    li{
      padding:10px 20px;
      &.active{
        background: #F4F6F8;
      }
    }
  }
  .el-col:nth-child(2){
    position:relative;
    border-left:1px solid #ddd;
  }
}
.chat-top{
  font-weight:bold;
  padding:0 20px;
  height:40px;
  line-height:40px;
  font-weight:normal;
  border-bottom:1px solid #ddd;
}
.chat-list{
  padding: 15px 20px;
  margin-bottom:160px;
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