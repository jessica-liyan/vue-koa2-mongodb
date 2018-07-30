<template>
  <el-form :model="user" label-width="100px" style="width:600px;margin:20px auto;">
    <el-form-item label="邮箱：">
      <el-input v-model="user.email"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="sendCode">发送邮箱验证码</el-button>
    </el-form-item>
    <el-form-item label="邮箱验证码：">
      <el-input v-model="user.password"></el-input>
    </el-form-item>
    <el-form-item label="新密码：">
      <el-input v-model="user.newPassword"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">确认修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {sendMail} from '../api/index.js'

export default {
  name: 'forgot',
  data () {
    return {
      user: {
        email: '',
        newPassword: ''
      },
      img: '', // 验证码图片
      key: '' // 验证码key
    }
  },
  created () {
  },
  methods: {
    submit () {
      login(this.user).then(res => {
        console.log(res)
        // if(res.data.status === 0){
        //   this.$message({
        //     message: res.data.msg,
        //     type: 'error',
        //     showClose: true
        //   })
        // } else {
        //   this.$message({
        //     message: '登录成功！',
        //     type: 'success',
        //     showClose: true
        //   })
        // }
      })
    },
    sendCode () {
      sendMail(this.user.email).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style>
</style>
