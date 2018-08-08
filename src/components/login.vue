<template>
  <el-form :model="user" label-width="100px" style="width:600px;margin:20px auto;">
    <el-form-item label="邮箱：">
      <el-input v-model="user.email"></el-input>
    </el-form-item>
    <el-form-item label="密码：">
      <el-input v-model="user.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">登录</el-button><br>
      <el-button type="text" @click="register">还没有账号？立即注册</el-button><br>
      <el-button type="text" @click="forgot">忘记密码？</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {login} from '../api/index.js'

export default {
  name: 'login',
  data () {
    return {
      user: {
        email: '',
        password: ''
      },
      img: '', // 验证码图片
      key: '' // 验证码key
    }
  },
  methods: {
    submit () {
      login(this.user).then(res => {
        console.log(res)
        if(res.data.status === 0){
          this.$message({
            message: res.data.msg,
            type: 'error',
            showClose: true
          })
        } else {
          this.$message({
            message: '登录成功！',
            type: 'success',
            showClose: true
          })
          console.log(this.$storage)
          // localStorage.setItem('token', res.data.token)
          // localStorage.setItem('userId', res.data.data._id)
          this.$storage.set('token', res.data.token) // 将token存入缓存
          this.$storage.set('userId', res.data.data._id) // 将userId存入缓存
          this.$router.push('/info')
        }
      })
    },
    register () {
      this.$router.push('/register')
    },
    // 忘记密码
    forgot () {
      this.$router.push('/forgot')
    }
  }
}
</script>

<style>
</style>
