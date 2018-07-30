<template>
  <div>
    <h2 class="title">个人资料</h2>
    <ul class="setting-list">
      <li>
        <span class="setting-title fs-16 c-9">头像</span>
        <div class="setting-info">
          <div class="mr-10">
            <img v-if="user.avatar" :src="`${base}/${user.avatar}`">
          </div>
          <el-upload
            action="http://192.168.4.76:4000/upload"
            :show-file-list="false"
            :on-success="handleSuccess"
            >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </div>
      </li>
      <li>
        <span class="setting-title fs-16 c-9">用户名</span>
        <div class="setting-info">
          <input type="text" v-model="user.name" v-on:focus="isEditName = true" class="input">
          <el-button type="text" v-if="!isEditName" @click="isEditName = true">修改</el-button>
          <div v-if="isEditName" class="save">
            <el-button type="text" @click="isEditName = false;submit()">保存</el-button>
            <el-button type="text" @click="isEditName = false">取消</el-button>
          </div>
        </div>
      </li>
      <li>
        <span class="setting-title fs-16 c-9">职位</span>
        <div class="setting-info">
          <input type="text" v-model="user.job" v-on:focus="isEditJob = true" class="input">
          <el-button type="text" v-if="!isEditJob" @click="isEditJob = true">修改</el-button>
          <div v-if="isEditJob" class="save">
            <el-button type="text" @click="isEditJob = false;submit()">保存</el-button>
            <el-button type="text" @click="isEditJob = false">取消</el-button>
          </div>
        </div>
      </li>
      <li>
        <span class="setting-title fs-16 c-9">公司</span>
        <div class="setting-info">
          <input type="text" v-model="user.company" v-on:focus="isEditComp = true" class="input">
          <el-button type="text" v-if="!isEditComp" @click="isEditComp = true">修改</el-button>
          <div v-if="isEditComp" class="save">
            <el-button type="text" @click="isEditComp = false;submit()">保存</el-button>
            <el-button type="text" @click="isEditComp = false">取消</el-button>
          </div>
        </div>
      </li>
      <li>
        <span class="setting-title fs-16 c-9">个人介绍</span>
        <div class="setting-info">
          <input type="text" v-model="user.selfDesc" v-on:focus="isEditDesc = true" class="input">
          <el-button type="text" v-if="!isEditDesc" @click="isEditDesc = true">修改</el-button>
          <div v-if="isEditDesc" class="save">
            <el-button type="text" @click="isEditDesc = false;submit()">保存</el-button>
            <el-button type="text" @click="isEditDesc = false">取消</el-button>
          </div>
        </div>
      </li>
      <li>
        <span class="setting-title fs-16 c-9">个人主页</span>
        <div class="setting-info">
          <input type="text" v-model="user.selfPage" v-on:focus="isEditPage = true" class="input">
          <el-button type="text" v-if="!isEditPage" @click="isEditPage = true">修改</el-button>
          <div v-if="isEditPage" class="save">
            <el-button type="text" @click="isEditPage = false;submit()">保存</el-button>
            <el-button type="text" @click="isEditPage = false">取消</el-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {base, fetchSelf, fetchUser, updateUser} from '../api/index.js'
import {mapState, mapGetters, mapMutations} from 'vuex'

export default {
  name: 'profile',
  data () {
    return {
      token: '',
      base,
      isEditName: false,
      isEditJob: false,
      isEditComp: false,
      isEditDesc: false,
      isEditPage: false
    }
  },
  created () {
    this.id = this.$storage.get('userId')
    this.token = this.$storage.get('token')
    this.getUser(this.id, this.token) // 登录用户的信息
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapMutations(['getUser']),
    handleSuccess (res) {
      if(res.status === 1){
        this.$message({
          type: 'success',
          message: '头像上传成功'
        })
        this.user.avatar = res.data.path
        this.submit()
      }
    },
    submit () {
      updateUser(this.user, this.token)
    }
  }
}
</script>

<style lang="scss">
.setting-list{
  width: 600px;
  li{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    border-bottom: 1px solid #f1f1f1;
    .setting-title{
      width: 100px;
    }
    .setting-info{
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      .save{
        white-space:nowrap;
      }
      .input{
        display: inline-block;
        width: 100%;
        border: 0;
        font-size: 16px;
        color: #333;
        padding:5px 0;
      }
    }
  }
}
</style>
