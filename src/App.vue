<template>
  <router-view></router-view>
</template>

<script>
import axios from 'axios'

export default {
  name: 'app',
  created () {
    axios.get('http://localhost:4000').then(res => {
      console.log(res)
    })
  }
}
</script>

<style lang="sass">
@import './app.scss';
</style>
