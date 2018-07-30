<template>
  <el-form :model="user" label-width="100px" style="width:600px;margin:20px auto;">
    <el-form-item label="邮箱：">
      <el-input v-model="user.email"></el-input>
    </el-form-item>
    <el-form-item label="昵称：">
      <el-input v-model="user.name"></el-input>
    </el-form-item>
    <el-form-item label="密码：">
      <el-input v-model="user.password"></el-input>
    </el-form-item>
    <el-form-item label="验证码：">
      <el-input v-model="user.captcha">
        <template slot="append"><div ref="captcha"></div></template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="done">注册</el-button><br>
      <el-button type="text" @click="login">已有账号？立即登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {register, fetchCaptcha} from '../api/index.js'

export default {
  name: 'register',
  data () {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        captcha: ''
      },
      captchaImg: null, // 验证码图片
      key: '' // 验证码key
    }
  },
  created () {
    fetchCaptcha().then(res => {
      this.$refs.captcha.innerHTML = res.data.data
    })
  },
  methods: {
    done () {
      register(this.user).then(res => {
        console.log(res, res.data.status)
        if(res.data.status === 0){
          this.$message({
            message: res.data.msg,
            type: 'error',
            showClose: true
          })
          return
        }
        this.$message({
          message: '注册成功！请登录！',
          type: 'success',
          showClose: true
        })
        this.$router.push('/login')
      })
    },
    login () {
      this.$router.push('/login')
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px!important;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
