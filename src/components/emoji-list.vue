<template>
  <el-popover
    placement="top-start"
    width="500"
    trigger="hover">
    <ul class="emoji-list">
      <li v-for="(emojiGroup, idx) of emojiData">
        <a href="#" v-for="(emoji, index) in emojiGroup"  @click="selectEmoji(emoji)">
          <span :class="'sprite-' + getPureName(emoji)"></span>
        </a>
      </li>
    </ul>
    <el-button type="text" slot="reference"><img src="../assets/emoji.png" alt=""></el-button>
  </el-popover>
</template>

<script>
import data from '../data/emoji-data.js'

export default {
  name: 'emoji',
  data () {
    return {
      pannels: ['表情', '自然', '物品', '地点', '符号'],
      emoji: data,
      emojiData: []
    }
  },
  created () {
    this.emojiData = this.pannels.map(item => {
      return Object.keys(this.emoji[item])
    })
  },
  methods: {
    getPureName (name) {
      return name.replace(/:/g, '')
    },
    selectEmoji (emoji) {
      this.$emit('select', emoji)
    }
  }
} 
</script>

<style lang="scss">
@import '../assets/css/emoji-sprite.scss';
.emoji-list{
  height: 140px;
  overflow:auto;
}
</style>