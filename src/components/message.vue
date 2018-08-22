<template>
  <div class="flex-v h">
    <h2 class="title">聊天</h2>
    <div class="flex-1 flex-h chat">
      <div class="flex-1 flex-v relative" style="border-right:1px solid #ddd;max-width:25%;">
        <el-tabs v-model="type" @tab-click="handleTypeChange">
          <el-tab-pane label="好友" name="text">
            <ul class="list" v-if="friends.length">
              <li v-for="(item, index) of friends" class="flex-h align-center" @click="openChat(item)" :class="{'active': to === item._id, 'leaveline': !item.online}">
                <a href="#" class="round" v-if="item.avatar"><img :src="`${base}/${item.avatar}`" alt=""></a>
                <p>
                  <span class="fs-14 c-3">{{item.name}}</span>
                  <span class="block fs-12 c-9">{{item.latestMsg}}</span>
                </p>
                <p><span class="tag" v-if="item.unread">{{item.unread}}</span></p>
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="我的群组" name="group"> 
            <ul class="list" v-if="groups.length">
              <li v-for="(item, index) of groups" v-if="!isNotIn(item)" @click="openChat(item)" :class="{'active': to === item._id}">
                <a href="#" class="round" v-if="item.avatar"><img :src="`${base}/${item.avatar}`" alt=""></a>
                <span class="fs-14 c-3">{{item.name}}</span>
                <span class="tag v-m" v-if="item.unread">{{item.unread}}</span>
              </li>
            </ul>
            <div v-else>
              <p class="fs-14 c-6 mt-10 mb-10 t-c">暂无群组，创建一个吧~</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="推荐群组" name="groupNotIn">
            <ul class="list" v-if="groups.length">
              <li v-for="(item, index) of groups" v-if="isNotIn(item)" :class="{'active': to === item._id}">
                <a href="#" class="round" v-if="item.avatar"><img :src="`${base}/${item.avatar}`" alt=""></a>
                <span class="fs-14 c-3">{{item.name}}</span>
                <span class="tag v-m" v-if="item.unread">{{item.unread}}</span>
                <el-button type="primary" plain size="mini" class="right"  @click="joinVisible = true;joinGroupId = item._id">加群</el-button>
                <el-dialog title="加群申请" :visible.sync="joinVisible">
                  <el-form :model="group" label-width="100px">
                    <el-form-item label="申请理由">
                      <el-input v-model="joinReason" auto-complete="off"></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="joinVisible = false">取 消</el-button>
                    <el-button type="primary" @click="joinVisible = false;join()">确 定</el-button>
                  </div>
                </el-dialog>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
        <div class="tab-right">
          <el-tooltip effect="dark" content="创建群" placement="bottom">
            <el-button type="text"  icon="el-icon-plus" @click="visible = true"></el-button>
          </el-tooltip>
        </div>
        <el-dialog title="创建群组" :visible.sync="visible">
          <el-form :model="group" label-width="100px">
            <el-form-item label="群组名称">
              <el-input v-model="group.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="群组描述">
              <el-input v-model="group.desc" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="群组地点">
              <el-input v-model="group.location" auto-complete="off">
              </el-input>
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
      </div>
      <div class="flex-3 flex-v" v-if="Object.keys(toInfo).length">
        <div class="chat-top fs-16 c-3 t-l">{{toInfo.name}}</div>
        <div class="flex-h flex-1" style="min-height:0;">
          <ul class="chat-list" ref="content">
            <li :class="{'chat-right': item.from._id === id}"
              v-for="(item, index) of messages">
              <p class="time">{{item.created_at | getDateTime()}}</p>
              <div class="t-l">
                <a href="#" class="round" v-if="item.from.avatar"><img :src="`${base}/${item.from.avatar}`" alt=""></a>
                <div class="chat-info">
                  <p class="fs-14 c-9">{{item.from.name}}</p>
                  <p class="content" v-html="item.content"></p>
                </div>
              </div>
            </li>
          </ul>
          <div v-if="type === 'group'" class="group-info">
            <ul class="member-list">
              <li v-for="(item, index) of toInfo.members">
                <span class="round" v-if="item.avatar" style="margin:0;" :class="{'leaveline': !item.online}"><img :src="`${base}/${item.avatar}`" alt=""></span>
                <span class="block fs-14 c-9">{{item.name}}</span>
              </li>
            </ul>
            <dl class="fs-14 c-9"><dt>群名</dt><dd class="c-3">{{toInfo.name}}</dd></dl>
            <dl class="fs-14 c-9"><dt>群描述</dt><dd class="c-3" v-if="toInfo.desc">{{toInfo.desc}}</dd><dd class="c-3" v-else>暂无描述</dd></dl>
            <dl class="fs-14 c-9" v-if="toInfo.creator"><dt>群创建者</dt><dd class="c-3">{{toInfo.creator.name}}</dd></dl>
            <div class="t-c"><el-button type="danger" @click="leave" round>退出该群</el-button></div>
          </div>
        </div> 
        <div class="chat-bottom">
          <div class="pd-10 flex-h relative">
            <el-upload :action="base + '/upload'" :on-success="handleImg" :show-file-list="false" class="mr-20">
              <el-button type="text"><img src="../assets/image.png" alt=""></el-button>
            </el-upload>
            <emoji-picker @emoji="insert" class="mr-20">
              <div slot="emoji-invoker" slot-scope="{events}" v-on="events">
                <el-button type="text" slot="reference"><img src="../assets/emoji.png" alt=""></el-button>
              </div>
              <div slot="emoji-picker" slot-scope="{ emojis, insert, display }">
                <div class="emoji-list">
                  <div v-for="(emojiGroup, category) in emojis" :key="category" >
                    <span v-for="(emoji, emojiName) in emojiGroup" :key="emojiName" @click="insert(emoji)" :title="emojiName">{{emoji}}</span>
                  </div>
                </div> 
              </div>
            </emoji-picker>
            <el-upload :action="base + '/upload'" :on-success="handleFile" :show-file-list="false" class="mr-20">
              <el-button type="text"><img src="../assets/upload.png" alt=""></el-button>
            </el-upload>
            <el-button @click="mapVisible = true" type="text"><img src="../assets/location.png" alt=""></el-button>
          </div>
          <div contenteditable="true" class="textarea new" style="height:100px;overflow:auto;" ref="textarea">
          </div>
          <div class="t-r mr-10 mb-10">
            <el-button type="primary" @click="send" round>发送</el-button>
          </div>
        </div>
      </div>
    </div>
    <AutoLocation :visible="mapVisible" @success="sendLocationSuccess" @close="close"></AutoLocation>
  </div>
</template>

<script>
import {base, sendMessage, fetchUser, getMessageList, getMessageFriends, fetchUserList, getGroupList, createGroup, getGroupInfo, joinGroup, leaveGroup, downloadFile} from '../api/index.js'
import {mapState} from 'vuex'
import EmojiPicker from 'vue-emoji-picker'
import AutoLocation from './autolocation'

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
        members: [],
        location: ''
      }, 
      content: '',
      to: '',  // 好友id/群id
      toInfo: {}, // 当前好友/群信息 
      type: 'text',  // 聊天类型  text/group
      mapVisible: false,
      visible: false,
      joinVisible: false,
      joinReason: '',
      joinGroupId: '',
      id: '',
      token: ''
    }
  },
  components: {
    EmojiPicker,
    AutoLocation
  },
  sockets:{
    connect: function(){
      console.log('socket', this.$socket)
      this.$socket.emit('join', this.id)
    },
    // 服务端推送对方数据
    getNewMessage: function (item) {
      console.log('新的聊天数据', item) 
      let fromUser = this.friends.find(x => x._id === item.from._id)

      if(this.type === 'text' && item.type === 'text'){
        // 更新好友列表最新消息
        if(fromUser){
          fromUser.latestMsg = item.content
        }

        // 判断是不是当前聊天的好友
        if(item.from._id === this.to){
          this.messages.push(item)
        } else {
          if(fromUser){
            fromUser.unread = fromUser.unread + 1
          }
          this.$notify({
            title: item.from.name,
            message: item.content,
            duration: 2000
          });
        }
      }
      if(this.type === 'group' && item.type === 'group' && item.to === this.to){
        this.messages.push(item)
      }
    },
    sys (parmas) {
      console.log('触发了', parmas)
      this.$notify({
        title: '消息',
        message: parmas
      })
      this.getList() // 更新好友在线情况
      this.init() // 更新群组好友在线情况
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

    // 获取好友/群组列表
    this.getList()

    // 群组好友默认添加本人
    this.group.members.push(this.id)
    console.log('members', this.group.members)
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 发送emoji
    insert (emoji) {
      this.$refs.textarea.innerHTML += emoji
    },
    // 发送图片
    handleImg (res, file) {
      let src = `${base}/${res.data.path}`
      this.$refs.textarea.innerHTML += '<img src='+src+'>'
    },
    // 发送文件
    handleFile (res, file) {
      console.log('上传了', res, file)
      let href = `${base}/${res.data.path}`
      let filename = file.name
      let type
      switch (res.data.ext) {
        case 'docx': type = 'word';break;
        case 'txt': type = 'txt';break;
        case 'pdf': type = 'pdf';break;
        case 'pptx': type = 'ppt';break;
        case 'xlsx': type = 'excel';break;
        case 'png': case 'jpg': case 'jpeg': case 'webp': type = 'img';break;
        default: type = 'file';break;
      }

      this.$refs.textarea.innerHTML += `<a href='${href}' download class="download"><img src=${require(`../assets/${type}.png`)}><span class="v-m ml-10 fs-14 c-3">${filename}</span></a>`
    },
    // 发送定位成功
    sendLocationSuccess (data) {
      console.log('发送定位', data)
      let href = `http://api.map.baidu.com/marker?location=${data.point.lat},${data.point.lng}&title=我的位置&content=奎科大厦&output=html`
      this.$refs.textarea.innerHTML += `<a href='${href}' target="_blank" class="download"><span class="fs-14 c-3">${data.addressComponent.province} ${data.addressComponent.city}</span></a>`
    },
    // 发送定位弹窗关闭
    close () {
      this.mapVisible = false
    },
    isNotIn (group) {
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
          this.toInfo = res.data.data
        })
      }
      this.updateMessages()
    },
    // 好友/群组列表
    getList () {
      fetchUserList(this.token).then(res => {
        let friends = res.data.data
        this.friendsArr = []

        friends.map((fri) => {
          fri.unread = 0
        })
        this.friends = friends

        console.log('好友列表', this.friends)
        this.friends.forEach((item) => {
          this.friendsArr.push({
            label: item.name,
            key: item._id
          })
        })
      })
      getGroupList(this.token).then(res => {
        this.groups = res.data.data
        console.log('群列表', this.groups)
      })
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
      if(this.type === 'group' && this.isNotIn(item)){
        return
      }
      this.toInfo = item
      this.$router.push(`/info/message/${this.type}/${item._id}`)
      this.updateMessages()
      this.getList()
    },
    // 标签页改变
    handleTypeChange () {
      this.$router.push(`/info/message/${this.type}`)
      this.getList()
      // 重置
      this.toInfo = {}
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
        // 重置
        this.group = { name: '', desc: '', members: [this.id]}
      })
    },
    // 申请加群
    join () {
      joinGroup(this.joinGroupId, this.token).then(res => {
        if (res.data.status === 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.$message({
            type: 'success',
            message: '申请加群成功'
          })
          this.init()
          this.getList()
        }
      })
    },
    // 退群
    leave () {
      leaveGroup(this.toInfo._id, this.token).then(res => {
        if (res.data.status === 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.$message({
            type: 'success',
            message: '退群成功'
          })
          this.init()
          this.getList()
        }
      })
    },
    // 发送消息
    send () {
      this.content = this.$refs.textarea.innerHTML
      console.log(this.content)
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
          content: this.content,
          created_at: Date.now()
        })
      }
      // 更新好友列表最新消息
      let toUser = this.friends.find(x => x._id === this.to)
      toUser.latestMsg = this.content

      // 清空
      this.content = this.$refs.textarea.innerHTML = ''
    },
    scrollToBottom () {
      this.$nextTick(() => {
        var info = this.$refs.content
        if(this.messages.length){
          info.scrollTop = info.scrollHeight
        }
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
  .el-tabs{
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .el-tabs__content{
    flex:1;
    overflow:auto;
  }
  .list{
    li{
      padding:10px 20px;
      position: relative;
      &.active{
        background: #F4F6F8;
      }
    }
  }
  .leaveline{
    img{
      filter: gray;
      -webkit-filter: grayscale(100%);
      -moz-filter: grayscale(100%);
      -ms-filter: grayscale(100%);
      -o-filter: grayscale(100%);
      filter: grayscale(100%);
    }
  }
}
.loadImg{
  position:relative;
  overflow:hidden;
  input{
    position:absolute;
    top:0;
    right:0;
    opacity:0;
    font-size:1000px;
  }
}
.tab-right{
  position:absolute;
  right:10px;
  top:10px;
  i{font-size:18px;}
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
  overflow: auto;
  dl{
    margin:15px;
    line-height:2;
    dt{
      width: 4em;
    }
  }
}
.right{
  position:absolute;
  right:10px;
  top:50%;
  transform: translateY(-50%);
}
.chat-list{
  flex:1;
  padding: 15px 20px;
  box-sizing:border-box;
  overflow: auto;
  li{
    padding:15px 0;
    text-align:center;
  }
  .round{
    float: left;
    margin:0;
  }
  .time{
    display:inline-block;
    font-size:12px;
    color:#fff;
    background:#999;
    padding:5px 10px;
    border-radius:15px;
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
      vertical-align:bottom;
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
      img{
        max-width:50%;
        vertical-align:bottom;
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
      .content{
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

.download{
  display:inline-block;
  background: #fff;
  border: 1px solid #ddd;
  padding:10px;
  font-size:0;
}

.emoji-list{
  position:absolute;
  left: 0;
  bottom: 100%;
  width: 500px;
  height: 150px;
  overflow: auto;
  box-shadow: 0 0 10px #ddd;
  padding:10px;
  background:#fff;
  span{
    display:inline-block;
    width:30px;
    margin:2px 0;
    text-align: center;
    cursor: pointer;
  }
}
.textarea.new{
  img{
    max-width: 200px;
  }
}
</style>