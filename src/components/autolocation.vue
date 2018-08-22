<template>
  <el-dialog
    width="50%"
    title="发送定位"
    :visible="mapVisible"
    append-to-body
    @close="close"
    >
    <baidu-map class="map" center="北京" style="width:100%;height:300px;">
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true" @locationSuccess="locationSuccess"></bm-geolocation>
    </baidu-map>
    <div class="t-r">
      <el-button type="primary" @click="send">发送</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'auto-location',
  data () {
    return {
      mapVisible: null,
      data: null
    }
  },
  props: {
    visible: Boolean
  },
  mounted () {
    this.mapVisible = this.visible
  },
  methods: {
    close(){
      this.$emit('close')
    },
    locationSuccess (data) {
      this.data = data
    },
    send () {
      this.$emit('close')
      this.$emit('success', this.data)
    }
  },
  watch: {
    'visible': function(val) {
      this.mapVisible = val
    }
  }
}
</script>

<style>
</style>
