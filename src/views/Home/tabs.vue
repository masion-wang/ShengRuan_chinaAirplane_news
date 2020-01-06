<template>
  <div id="tab">
    <!--vant的tab组件-->
    <van-tabs
      @click="onClick"
      :background="bg"
      color="#1b78fb"
      title-active-color="#1b78fb"
      title-inactive-color="#949292"
      :swipe-threshold="number"
      class="tabs"
      v-model="activeName"
    >
      <!--遍历出一级栏目-->
      <van-tab v-for="(item,index) of tabsData" :name="item.id" :title="item.name" :key="index">
        <!--判断是否有二级栏目-->
        <!--二级栏目相关数据传入二级栏目-->
        <secondTabs v-if="item.showChild==1 && item.childs.length>0" :SecondArray="item.childs"></secondTabs>
      </van-tab>
    </van-tabs>
    <!--栏目编辑-->
    <div class="tabsTip" @click="openTabsTip">tips</div>
    <!--弹窗-->
    <van-popup v-model="showPopup">
      <div style="width:100vw;height:100vh;">
        <tip @xxxx="realClose" :tabsData="tabsData"></tip>
      </div>
    </van-popup>
  </div>
</template>
<script>
import secondTabs from "./secondTabs.vue";
import { manage, listById, bannerById } from "@api/Consulting.js";
import EStorage from "../../util/EStorage";
export default {
  components: { secondTabs, tip: require("../tip.vue").default },
  data() {
    return {
      tabsData: [], // 一二级栏目的数据
      number: 3,
      bg: "white",
      color: "#151ae0",
      activeName: "",
      showPopup: false
    };
  },
  created() {
    // 如果存在tabs
    if (JSON.parse(localStorage.getItem("tabs")) != null) {
      this.tabsData = JSON.parse(localStorage.getItem("tabs"));
    }
  },
  computed: {
    tabsFirstId() {
      return this.$store.state.tabsDataFirstId;
    }
  },
  mounted() {
    // 触发获取栏目数据
    this.getTabsData();
    // 监听retry事件 用户在未请求到栏目数据时候 可以通过下拉自己手动重新请求
    this.$bus.$on("retry", val => {
      if (val == "badInternet") {
        this.getTabsData();
        this.$toast("正在重新请求");
      } else {
        this.getTabsData(val);
        this.activeName = val;
      }
    });
  },
  methods: {
    // 子组件tip向父组件传递的数据
    realClose(val, id, title, item, index) {
      // 修改tan栏目数据
      this.tabsData = val;
      // 关闭popup
      this.showPopup = false;
      if (id != "" && item != null) {
        // 请求轮播+类表数据
        this.onClick(id, title, item);
        this.activeName = item.id;
      }
    },
    // 打开tips
    openTabsTip() {
      this.showPopup = true;
    },
    // 获取一二级栏目数据
    getTabsData(val) {
      // 通过原生方法 获取到positionId
      let containerInfo = acNative.getCurrentWebContainer();
      let result = JSON.parse(containerInfo);
      console.log("positionId" + result.options.positionId);
      let data = {
        positionId: result.options.positionId
      };
      // 调用第一二栏目数据
      manage(data)
        .then(res => {
          if (res.data.code == "000000") {
            // 如果请求成功但是没有数据
            if (res.data.content.length == 0) {
              this.$toast("暂无数据");
              return;
            }
            // 如果有数据 保存一二级栏目数据到vuex
            this.tabsData = res.data.content;
            // 将tabsData数据保存到localstorage里面
            localStorage.setItem("tabs", JSON.stringify(res.data.content));
            // 如果有一级栏目下的二级栏目的第一个栏目id 保存此id 缓存
            if (this.tabsData[0].childs.length > 0) {
              this.$store.commit(
                "getTabsFirstId",
                this.tabsData[0].childs[0].id
              );
            } else {
              // 没有的话 那就保存第一级栏目的第一个栏目id  缓存
              this.$store.commit("getTabsFirstId", this.tabsData[0].id);
            }
            // 并且模拟点击一级栏目的第一个栏目
            if (val) {
              this.onClick(val);
            } else {
              this.onClick(this.tabsData[0].id, this.tabsData[0].name);
            }
          }
        })
        .catch(err => {
          this.$toast("网络环境异常");
        });
    },
    // 用户点击一级栏目触发事件
    onClick(name, title, item) {
      // this.activeName = name;
      this.$store.commit("showLoading");
      this.$store.commit("ContentData", []);
      // this.$store.commit("BannerData", []);
      // 判断三种情况
      for (var item of this.tabsData) {
        // 第一种情况:一级栏目主导
        if (name === item.id && item.showChild === 0) {
          // 将一级或二级栏目id传到vuex
          this.$store.commit("getTabsId", name);
          this.$store.commit("hideLoading");
          break;
        } else if (
          // 第二种情况:矛盾二级栏目开关已经打开但是无内容
          name === item.id &&
          item.showChild === 1 &&
          item.childs.length === 0
        ) {
          this.$store.commit("hideLoading");
          break;
        } else if (
          // 第三种情况:二级级栏目主导
          name === item.id &&
          item.showChild > 0 &&
          item.childs.length > 0
        ) {
          // 获取二级栏目的第一个id
          let secondTabId = item.childs[0].id;
          // 将二级栏目的id给secondTabs
          this.$nextTick(() => {
            this.$bus.$emit("passIdToSecond", secondTabId);
            this.$store.commit("hideLoading");
          });
          break;
        } else if (name !== item.id) {
          this.$nextTick(() => {
            this.$bus.$emit("passIdToSecond", name);
            this.$store.commit("hideLoading");
          });
        }
      }
    }
  }
};
</script>
<style lang="less" >
#tab {
  background: rgb(253, 251, 251);
  text-align: center;
}
.tabs {
  padding-right: 1.2rem;
  box-sizing: border-box !important;
}
.tabsTip {
  // border-bottom: 0.8px solid rgba(0, 0, 0, 0.05);
  position: absolute;
  width: 1.1rem;
  right: 0.1rem;
  height: 1rem;
  top: 0.4rem;
}
.flex-basis {
  flex-basis: 25.5%;
}
.van-tab {
  flex-basis: 28.5% !important;
}
.van-ellipsis {
  font-size: 0.42rem !important;
}
.nonePic {
  margin: 0 auto;
}
</style>
