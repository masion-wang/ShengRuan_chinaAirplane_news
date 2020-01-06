<template>
  <div id="tip">
    <div @click="close" class="title">
      <div>X</div>
    </div>
    <!--我的频道-->
    <div class="list1">
      <div class="channel">我的频道</div>
      <div @click="done(btnChange)" class="done">{{btnChange}}</div>
    </div>
    <draggable
      class="list-group"
      v-model="list1"
      group="people"
      v-bind="option1"
      tag="span"
      draggable=".singlePerson"
    >
      <transition-group>
        <div
          :class="[index>1?'singlePerson':'list-group-item']"
          v-for="(item, index) of list1"
          :key="item.id"
          @touchstart="gtouchstart(item,index)"
          @touchmove="gtouchmove(item,index)"
          @touchend="gtouchend(item,index)"
        >
          {{ item.name }}
          <span
            class="close"
            v-show="show&&index>1"
            @touchstart="deleteChannel(item,index)"
          >x</span>
        </div>
      </transition-group>
    </draggable>
    <!--推进频道-->
    <div class="list1">
      <div class="channel">推荐频道</div>
    </div>
    <draggable class="list-group" v-model="list2" group="people" v-bind="option2" tag="span">
      <transition-group>
        <div
          class="list-group-item2"
          v-for="(item, index) of list2"
          :key="item.id"
          @touchstart="addChannel(item,index)"
        >
          {{ item.name }}
          <span class="add">+</span>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>
<script>
import draggable from "vuedraggable";

export default {
  name: "two-lists",
  display: "Two Lists",
  order: 1,
  components: {
    draggable
  },
  props: {
    tabsData: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
    document.body.ondrop = function(event) {
      event.preventDefault();
      event.stopPropagation();
    };
  },
  computed: {
    btnChange() {
      return this.show === true ? "完成" : "编辑";
    }
  },
  data() {
    return {
      show: false,
      timeOutEvent: 0, // 长按事件定时器
      list1: this.tabsData,
      list2: [],
      option1: { animation: 500, sort: false },
      option2: { animation: 500, sort: false },
      clickTrue: true // 判断点击还是长按
    };
  },
  methods: {
    // 关闭popup
    close() {
      this.$emit("xxxx", this.list1);
    },
    // 编辑完成
    done(btnChange) {
      if (btnChange == "编辑") {
        this.show = true;
        this.clickTrue = false;
      } else if (btnChange == "完成") {
        this.show = false;
        this.option1.sort = false;
        this.clickTrue = true;
      }
    },
    // 模拟长按事件
    gtouchstart(item, index) {
      this.timeOutEvent = setTimeout(() => {
        this.show = true; // 展现栏目的红色叉子
        this.option1.sort = true; // 可以拖拽
        this.clickTrue = false; // 不可以点击
      }, 600);
    },
    // 拖动中
    gtouchmove() {
      if (this.show) {
        this.option1.sort = true; // 可以拖拽
        this.clickTrue = false; // 不可以点击
      }
    },
    // 点击事件
    gtouchend(item, index) {
      clearInterval(this.timeOutEvent);
      // 如果可以点击 跳转tab对应栏目
      if (this.clickTrue) {
        // 传递给父组件 tabs数据 当前tab的id 名字 自己 index 下标
        this.$emit("xxxx", this.list1, item.id, item.name, item, index);
      }
      // 如果出现红X 则可以点击删除频道栏目
      if (this.show) {
        this.list1.splice(index, 1);
        this.list2.unshift(item);
      }
    },
    // 删除频道
    // deleteChannel(item, index) {
    //   this.list1.splice(index, 1);
    //   this.list2.unshift(item);
    // },
    // 下面的drag增加频道
    addChannel(item, index) {
      this.list2.splice(index, 1);
      this.list1.push(item);
    }
  }
};
</script>
<style scoped>
.title {
  height: 8vh;
  font-size: 0.5rem;
  padding-left: 0.3rem;
  background: rgba(243, 218, 218, 0.2);
  display: flex;
  align-items: center;
}
.list1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.25rem;
  padding-top: 0.15rem;
}
.channel {
  color: black;
  font-size: 0.5rem;
}
.done {
  color: red;
  font-size: 0.4rem;
  height: 0.3rem;
  line-height: 0.3rem;
  border: 1px solid red;
  padding: 0.1rem;
  border-radius: 30px;
}
.list-group > span {
  display: inline-flex;
  flex-wrap: wrap;
  width: 100%;
  padding-top: 0.2rem;
}
.list-group-item-big {
  font-size: 0.4rem;
  border-radius: 5px;
  width: 23%;
  height: 1.1rem;
  line-height: 1.1rem;
  margin: auto;
  position: relative;
  background: #ccc;
  margin: 0.1rem;
  white-space: nowrap;
  text-align: center;
}
.list-group-item {
  white-space: nowrap;
  font-size: 0.35rem;
  border-radius: 5px;
  width: 22%;
  height: 1rem;
  line-height: 1rem;
  margin: auto;
  position: relative;
  background: rgb(241, 237, 237);
  margin: 0.1rem;
  text-align: center;
}
.singlePerson {
  white-space: nowrap;
  font-size: 0.35rem;
  border-radius: 5px;
  width: 22%;
  height: 1rem;
  line-height: 1rem;
  margin: auto;
  position: relative;
  background: rgb(241, 237, 237);
  margin: 0.1rem;
  text-align: center;
}
.list-group-item2 {
  white-space: nowrap;
  font-size: 0.35rem;
  border-radius: 5px;
  width: 22%;
  height: 1rem;
  line-height: 1rem;
  margin: auto;
  position: relative;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin: 0.1rem;
  text-align: center;
}
.add {
  position: absolute;
  top: -0.1rem;
  right: -0.1rem;
  width: 0.5rem;
  height: 0.5rem;
  line-height: 0.5rem;
  border-radius: 30px;
  background: whitesmoke;
  z-index: 999;
}
.close {
  position: absolute;
  top: -0.1rem;
  right: -0.1rem;
  width: 0.5rem;
  height: 0.5rem;
  line-height: 0.5rem;
  border-radius: 30px;
  background: red;
  z-index: 999;
}
</style>
