<template>
  <div>
    <h2 class="title">发布文章</h2>
    <div class="editor">
      <el-input
        placeholder="请输入标题"
        v-model="form.title">
      </el-input>
      <el-radio-group v-model="radio" size="small" @change="bindClassify">
        <el-radio-button :label="item.title" v-for="(item, index) of category">
          {{item.name}}
        </el-radio-button>
      </el-radio-group>
      <el-button @click="submit" type="primary" v-if="!isUpdate">发布</el-button>
      <el-button @click="update" type="primary" v-if="isUpdate">更新</el-button>
    </div>
    <mavon-editor v-model="form.content"
      :boxShadow="false"
      @save="save"
    />
    <el-form style="margin:20px 0;">
      <el-form-item label="添加封面">
        <el-upload
          class="avatar-uploader"
          action="http://192.168.4.76:4000/upload"
          :show-file-list="false"
          :on-success="handleSuccess"
          >
          <img v-if="form.cover" :src="base + '/' + form.cover" class="avatar">
          <span v-else class="el-icon-plus avatar-uploader-icon"></span>
        </el-upload>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import {base, fetchSelf, getArticleDetail, addArticle, updateArticle} from '../api/index.js'

export default {
  name: 'editor',
  data () {
    return {
      form: {
        title: '',
        content: '',
        authorId: '', // 存作者的id
        classify: {},
        cover: ''
      },
      radio: 'frontend', // 默认分类前端
      base,
      category: [{
        name: '前端',
        title: 'frontend'
      }, {
        name: 'Android',
        title: 'Android'
      }, {
        name: 'IOS',
        title: 'IOS'
      }, {
        name: '后端',
        title: 'backend'
      }],
      isUpdate: false, // 判断是新增，还是更新
      token: '',
      id: ''
    }
  },
  created () {
    this.id = this.$storage.get('userId')
    this.token = this.$storage.get('token')
    this.form.authorId = this.id
    // 存在路由参数的情况
    if(this.$route.params.id){
      this.isUpdate = true
      getArticleDetail(this.$route.params.id).then(res => {
        console.log(res)
        if (res.data.status == 0) {
          this.$message({
            message: res.data.msg,
            type: 'error',
            showClose: true
          })
        } else {
          this.form = res.data.data
        }
      })
    }
    this.bindClassify()
  },
  methods: {
    save () {
      console.log(this.form)
    },
    bindClassify () {
      this.form.classify = JSON.parse(JSON.stringify(this.category.find(x => x.title === this.radio)))
    },
    handleSuccess (res, file, fileList) {
      console.log('成功了', res, file, fileList)
      if(res.status === 1){
        this.$message({
          message: '封面上传成功！',
          type: 'success',
          showClose: true
        })
        this.form.cover = res.data.path
      }
    },
    // 新增
    submit () {
      console.log(this.form)
      addArticle(this.form, this.token).then(res => {
        console.log(res)
        if (res.data.status == 0) {
          this.$message({
            message: res.data.msg,
            type: 'error',
            showClose: true
          })
        } else {
          this.$message({
            message: `文章发布成功！`,
            type: 'success',
            showClose: true
          })
          this.$router.push(`/info/post/${res.data.data._id}`) // 这里是文章id
        }
      })
    },
    // 更新
    update () {
      console.log(this.form, 'update')
      updateArticle(this.form, this.token).then(res => {
        console.log(res)
        if (res.data.status == 0) {
          this.$message({
            message: res.data.msg,
            type: 'error',
            showClose: true
          })
          return
        }
        this.$message({
          message: `文章更新成功！`,
          type: 'success',
          showClose: true
        })
        this.$router.push(`/info/post/${res.data.data._id}`)
      })
    }
  }
}
</script>

<style lang="scss">
.el-radio-group{
  white-space:nowrap;
}
.editor{
  position: relative;
  border-bottom:0;
  height:45px;
  border:1px solid #E0E0E0;
  border-bottom:0;
  border-top:0;
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
  .el-button{
    padding:5px 10px;
    margin:0 10px;
  }
  .el-input{
    margin:0;
    .el-input__inner{
      border:0!important;
      font-size:16px;
      border-radius:0;
    }
  }
}
.avatar-uploader-icon{
  width:200px;
  height:200px;
  line-height: 200px!important;
}
</style>

