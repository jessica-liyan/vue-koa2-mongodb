<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'app',
  created () {
    axios.get('http://localhost:4000').then(res => {
      console.log(res)
    })
    this.token = this.$storage.get('token')
    
  },
  components: {
  }
}
</script>

<style lang="sass">
@import './app.scss';
</style>
