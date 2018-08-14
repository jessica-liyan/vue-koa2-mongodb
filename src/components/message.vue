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
            <div class="ml-10 mb-10">
              <el-button type="primary" size="mini" @click="visible = true">创建群</el-button>
            </div> 
            <el-dialog title="创建群组" :visible.sync="visible">
              <el-form :model="group" label-width="100px">
                <el-form-item label="群组名称">
                  <el-input v-model="group.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="群组描述">
                  <el-input v-model="group.desc" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="群组成员">
                  <el-transfer
                    filterable
                    filter-placeholder="请输入成员名称"
                    :titles="['成员列表', '已选成员']"
                    v-model="group.members"
                    :data="friendsArr">
                  </el-transfer>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="visible = false;create()">确 定</el-button>
              </div>
            </el-dialog>
            <ul class="list" v-if="groups.length">
              <li v-for="(item, index) of groups" @click="openChat(item)" :class="{'active': to === item._id}">
                <a href="#" class="round" v-if="item.avatar"><img :src="`${base}/${item.avatar}`" alt=""></a>
                <span class="fs-14 c-3">{{item.name}}</span>
                <span class="tag v-m" v-if="item.unread">{{item.unread}}</span>
                <el-button type="primary" plain size="mini" style="float:right;" v-if="isIn(item)">加入该群</el-button>
              </li>
            </ul>
            <div v-else>
              <p class="fs-14 c-6 mt-10 mb-10 t-c">暂无群组，创建一个吧~</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="18" class="flex-v">
        <div class="chat-top fs-16 c-3 t-l">{{toInfo.name}}</div>
        <div class="flex-h flex-1">
          <ul class="chat-list" ref="content">
            <li :class="{'chat-right': item.from._id === id}"
              v-for="(item, index) of messages">
              <a href="#" class="round" v-if="item.from.avatar"><img :src="`${base}/${item.from.avatar}`" alt=""></a>
              <div class="chat-info">
                <p class="fs-14 c-9">{{item.from.name}}</p>
                <p class="content">{{item.content}}</p>
              </div>
            </li>
          </ul>
          <div v-if="type === 'group'" class="group-info">
            <ul class="member-list">
              <li v-for="(item, index) of toInfo.members">
                <span class="round" v-if="item.avatar" style="margin:0;"><img :src="`${base}/${item.avatar}`" alt=""></span>
                <span class="block fs-14 c-9">{{item.name}}</span>
              </li>
            </ul>
            <dl class="fs-14 c-9"><dt>群名</dt><dd class="c-3">{{toInfo.name}}</dd></dl>
            <dl class="fs-14 c-9"><dt>群描述</dt><dd class="c-3" v-if="toInfo.desc">{{toInfo.desc}}</dd><dd class="c-3" v-else>暂无描述</dd></dl>
            <dl class="fs-14 c-9"><dt>群创建者</dt><dd class="c-3">{{toInfo.creator}}</dd></dl>
          </div>
        </div> 
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
import {base, sendMessage, fetchUser, getMessageList, getMessageFriends, fetchUserList, getGroupList, createGroup, getGroupInfo} from '../api/index.js'
import {mapState} from 'vuex'

export default {
  name: 'message',
  data () {
    return {
      base,
      friendsArr: [], // {label, key} 显示的是label，搜索的是lable，最后选中数组是key
      friends: [], // 好友列表
      groups: [], // 群组列表
      messages: [],
      group: { // 添加群
        name: '',
        desc: '',
        members: []
      }, 
      content: '',
      to: '',  // 好友id/群id
      toInfo: {}, // 当前好友/群信息 
      type: 'text',  // 聊天类型  text/group
      visible: false,
      id: '',
      token: ''
    }
  },
  sockets:{
    connect: function(){
      console.log('socket', this.$socket)
      this.$socket.emit('join', this.id)
    },
    // 服务端推送对方数据
    getNewMessage: function (item) {
      console.log('新的聊天数据', item) 
      if(this.type === 'text'){
        // 判断是不是当前聊天的好友
        if(item.from._id === this.to){
          this.messages.push(item)
        } else {
          let fromUser = this.friends.find(x => x._id === item.from._id)
          if(fromUser){
            fromUser.unread = fromUser.unread + 1
          }
          this.$notify({
            title: item.from.name,
            message: item.content,
            duration: 2000
          });
        }
      } else {
        this.messages.push(item)
      }
    },
    groupSys(parmas) {
      // this.$notify({
      //   title: '消息',
      //   message: parmas
      // })
    }
  },
  created () { 
    this.id = this.$storage.get('userId')
    this.token = this.$storage.get('token')

    this.type = this.$route.params.type 
    this.to = this.$route.params.id // 刷新页面，获取路由id

    // 路由
    if(this.to && this.type){
      this.init()
    }
    console.log('created')
    // 获取好友/群组列表
    this.getList()

    // 群组好友默认添加本人
    this.group.members.push(this.id)
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    isIn (group) {
      return group.members.findIndex(m => m._id === this.id) === -1
    },
    // 初始化聊天对象和聊天列表
    init () {
      if(this.type === 'text'){
        fetchUser(this.to, this.token).then(res => {
          this.toInfo = res.data.data
        })
      }else{
        getGroupInfo(this.to, this.token).then(res => {
          console.log('这个群信息', res)
          this.toInfo = res.data.data
        })
      }
      this.updateMessages()
    },
    // 好友/群组列表
    getList () {
      fetchUserList().then(res => {
        let friends = res.data.data
        this.friendsArr = []
        //friends.splice(friends.findIndex(x => x._id === this.id), 1)
        friends.map((fri) => {
          fri.unread = 0
        })
        this.friends = friends

        this.friends.forEach((item) => {
          this.friendsArr.push({
            label: item.name,
            key: item._id
          })
        })
      })
      if(this.type === 'group'){
        getGroupList(this.token).then(res => {
          this.groups = res.data.data
          console.log('群列表', this.groups)
        })
      }
    },
    // 聊天记录
    updateMessages () {
      getMessageList({
        to: this.to,
        from: this.id,
        type: this.type
      }, this.token).then(res => {
        console.log('消息列表', res)
        this.messages = res.data.data
      })
    },
    // 打开聊天窗口
    openChat (item) {
      this.to = item._id
      this.toInfo = item
      this.$router.push(`/info/message/${this.type}/${item._id}`)
      this.updateMessages()
      this.getList()
      // 服务端进入房间
      //this.$socket.emit('join', item._id)
    },
    // 标签页改变
    handleTypeChange () {
      this.$router.push(`/info/message/${this.type}`)
      this.getList()
    },
    // 创建群
    create () {
      this.group.creator = this.id
      createGroup(this.group, this.token).then(res => {
        if(res.data.status === 1){
          this.$message({
            type: 'success',
            message: res.data.msg
          })
        }
        this.$router.push(`/info/message/group/${res.data.data._id}`)
        this.getList()
        this.init()
        // 服务端进入房间
         //this.$socket.emit('join', res.data.data._id)
      })
    },
    // 服务器获取消息推送
    send () {
      const messageData = {
        to: this.to,
        from: this.id,
        content: this.content,
        type: this.type
      }
      this.$socket.emit('chat', messageData)
      if(this.type === 'text'){
        this.messages.push({
          from: this.user,
          content: this.content
        })
      }
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
  height:800px;
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
  .el-col{
    height:100%;
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
.group-info{
  border-left:1px solid #ddd;
  width: 250px;
  dl{
    margin:15px;
    line-height:2;
    dt{
      width: 4em;
    }
  }
}
.chat-list{
  flex:1;
  padding: 15px 20px;
  box-sizing:border-box;
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
    .content{
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
  border-top:1px solid #ddd;
}
</style>