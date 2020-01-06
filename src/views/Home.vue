<template>
  <div id="home">
    <!--一二级栏目-->
    <van-sticky>
      <tabs></tabs>
      <!-- <div class="tabsTip" @click="openTabsTip">tips</div> -->
    </van-sticky>
    <!--文章列表+轮播图-->
    <slipContent></slipContent>
    <!--弹窗-->
    <!-- <van-popup v-model="show">
      <div style="width:100vw;height:100vh;">
        <div @click="close" class="title">
          <div class="X">X</div>
        </div>
        <tip></tip>
      </div>
    </van-popup>-->
  </div>
</template>
<script>
import tabs from "./Home/tabs.vue";
import slipContent from "./Home/slipContent.vue";
export default {
  // 注册子组件
  components: {
    tabs,
    slipContent
  },
  name: "home",
  mounted() {
    // 点击原生壳子的图标触发搜索事件
    acInterface.onClickWebContainerUI(data => {
      this.goSearch();
    });
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    // // 关闭popup
    // close() {
    //   this.show = false;
    // },
    // 打开tips
    // openTabsTip() {
    //   this.show = true;
    // },
    // 跳转搜索页
    goSearch() {
      let url = window.location.href;
      acNative.navigateTo({
        url: `${url}search`,
        config: {
          navigationBarTitleText: "搜索"
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.title {
  height: 7%;
  font-size: 0.5rem;
  padding-left: 0.3rem;
  background: rgba(243, 218, 218, 0.2);
  display: flex;
  align-items: center;
}
// .X {
//   font-size: 0.7rem;
// }
// .tabsTip {
//   border-bottom: 0.8px solid rgba(0, 0, 0, 0.05);
//   position: absolute;
//   width: 1.1rem;
//   right: 0.1rem;
//   height: 1rem;
//   top: 0.2rem;
//   text-align: center;
//   line-height: 0.8rem;
// }
</style>
