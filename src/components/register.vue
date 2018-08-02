<template>
  <el-form :model="user" :rules="rules" ref="form" label-width="100px" style="width:600px;margin:20px auto;">
    <el-form-item label="邮箱：" prop="email">
      <el-input v-model="user.email"></el-input>
    </el-form-item>
    <el-form-item label="昵称：" prop="name">
      <el-input v-model="user.name"></el-input>
    </el-form-item>
    <el-form-item label="密码：" prop="password">
      <el-input v-model="user.password"></el-input>
    </el-form-item>
    <el-form-item label="确认密码：" prop="checkpass">
      <el-input v-model="user.checkpass"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">注册</el-button><br>
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
        checkpass: ''
      },
      rules: {
        email: [{
          required: true,
          message: '邮箱不能为空！',
          trigger: 'blur'
        }, {
          type: 'email',
          message: '请输入正确的邮箱地址！',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '用户名不能为空！',
          trigger: 'blur'
        }, {
          min: 4,
          max: 10,
          message: '用户名长度在4-10个字符！',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if(!/^[\u0391-\uFFE5a-zA-Z0-9_-]*$/.test(value)){
              callback(new Error('用户名必须是中文字符、大小英文字母、数字、下划线或减号'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '密码不能为空！',
          trigger: 'blur'
        }],
        checkpass: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.user.password) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }]
      },
      checkpass: '',
      captchaImg: null, // 验证码图片
      key: '' // 验证码key
    }
  },
  created () {
    // fetchCaptcha().then(res => {
    //   this.$refs.captcha.innerHTML = res.data.data
    // })
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if(valid){
          register(this.user).then(res => {
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
        } else {
          console.log('error')
        }
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
