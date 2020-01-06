<template>
  <div id="secondTabs">
    <div class="list" style="padding-right:-10vw;">
      <ul>
        <li @click="secondClick(index,item.id)" v-for="(item,index) of SecondArray" :key="index">
          <div :class="{color:isactive==index}">
            <span>{{item.name}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { listById, bannerById } from "@api/Consulting";

export default {
  name: "secondTabs",
  // 接受一级栏目给的数据
  props: {
    SecondArray: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    // 监听一级栏目传过来的二级栏目的第一个栏目的id
    this.$bus.$on("passIdToSecond", secondTabId => {
      // 模拟点击二级栏目的第一个栏目
      this.secondClick(0, secondTabId);
    });
  },
  data() {
    return {
      isactive: 0
    };
  },
  methods: {
    // 二级栏目点击事件 获取文章+轮播
    secondClick(index, id) {
      // alert(1)
      // 改变样式 当前下标相等获得该样式
      this.isactive = index;
      // 开始loading
      this.$store.commit("showLoading");
      // 将二级栏目id传给内容
      this.$store.commit("getTabsId", id);
      // 关闭loading
      this.$store.commit("hideLoading");
    }
  }
};
</script>
<style lang="less" scoped>
.list {
  width: 100vw;
  overflow-x: auto;
  white-space: nowrap;
  background: white;
}
.list > ul {
  list-style-type: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 1.2rem;
  background:rgb(250, 250, 250);
  padding-left:0.1rem;
  // border-bottom: 1px solid rgba(200, 200, 200, 0.2);
}

.list > ul > li {
  font-size: 0.37rem;
  height: 0.7rem;
  line-height: 0.7rem;
  padding: 0 0.2rem;

}
.list > ul > li > div {
  padding-right: 0.3rem;
  padding-left: 0.3rem;
  text-overflow: ellipsis;
  text-align: center;
  background: #e5e5e5;
  border-radius: 0.7rem;
  color: #6f6c6c;
}
.list > ul > li > div > span {
  position: relative;
  top: 1px;
}

// .list > ul :nth-child(n + 2) {
//   font-size: 0.37rem;
//   height: 0.7rem;
//   padding-right: 0.3rem;
//   padding-left: 0.3rem;
//   text-overflow: ellipsis;
//   text-align: center;
//   line-height: 0.7rem;
//   background: #e5e5e5;
//   border-radius: 30px;
//   color: #6f6c6c;
//   margin-left: 3vw;
//   margin-top: 1.1rem;
// }
.color {
  background: linear-gradient(to right, #6aa3ff 0%, #388bff 100%) !important;
  color: white !important;
}
#lastOne {
  width: 0px;
}
</style>
