<template>
  <div id="app">
    <!--在这里引用的 vant loading组件-->
    <van-loading v-show="LOADING" type="spinner" />
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>

import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['LOADING'])
  },
  name: 'App',
  mounted(){ }
}
</script>
<style lang="less" scoped>
* {
  padding: 0  !important;
  margin: 0 !important;
  height:100vh;
  background:white;
}

.van-loading {
  position: absolute;
  top: 20%;
  width:100%;
  height: 100vh;
  z-index: 20;
  background: white;
}
.van-loading__spinner {
  margin-top:40% !important;
  position:absolute;
  top:2%;
  left:45%;
}
</style>
