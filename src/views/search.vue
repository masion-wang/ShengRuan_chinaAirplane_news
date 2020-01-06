<template>
  <div class="search">
    <!--搜索头-->
    <van-search
      placeholder="请输入搜索关键词"
      v-model="title"
      show-action
      @search="onSearch"
      background="#efeff4"
      shape="round"
      ref="search"
    >
      <div slot="action" @click="Search">搜索</div>
    </van-search>
    <div style="background:white;text-align:center;">
      <img class="nonePic" v-if="myList.length == 0" src="../assets/img/default1x.png" />
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        :offset="num"
        :immediate-check="true"
        :finished-text="myList.length>0?'-已经到底了-':''"
      >
        <!--文章列表 1-无图，2-单图左，3-单图右，4单图大图，5-三图-->
        <div v-show="myList.length>0" style="padding-left:3%;padding-right:3%;background:white;">
          <div v-for="(item,index) of myList" :key="index">
            <!--style==1-->
            <div class="typeTwo" v-if="item.type==1&&item.style==1" @click="goDetail(item.infoId)">
              <div class="two">{{item.title}}</div>
              <div class="footerTitle2">
                <span class="source">{{item.sourceName}}</span>
                <!--:style="item.sourceName?'padding-left:15px;':''"-->
                <span>{{item.publishTimeStr}}</span>
              </div>
            </div>
            <!--style==2-->
            <div
              :class="[item.coverPicUrlStr[0] && item.coverPicUrlStr[0]!=''?'typeOne':'typeTwo']"
              v-if="item.type==1&&item.style==2"
              @click="goDetail(item.infoId)"
            >
              <van-image
                v-if="item.coverPicUrlStr[0] && item.coverPicUrlStr[0]!=''"
                :style="{width:35+'%',height:96+'%'}"
                :src="item.coverPicUrlStr[0]"
                fit="cover"
              ></van-image>
              <div class="typeOneContent">
                <div class="two">{{item.title}}</div>
                <div class="footerTitle">
                  <span class="source">{{item.sourceName}}</span>
                  <div :style="item.sourceName?'padding-left:15px;':''">{{item.publishTimeStr}}</div>
                </div>
              </div>
            </div>
            <!--style==3-->
            <div
              :class="[item.coverPicUrlStr[0] && item.coverPicUrlStr[0]!=''?'typeOne':'typeTwo']"
              v-if="item.type==1&&item.style==3"
              @click="goDetail(item.infoId)"
            >
              <div class="typeOneContent">
                <!--标题-->
                <div class="two">{{item.title}}</div>
                <!--来源+时间-->
                <div class="footerTitle">
                  <span class="source">{{item.sourceName}}</span>
                  <!--:style="item.sourceName?'padding-left:15px;':''"-->
                  <span :style="item.sourceName?'padding-left:15px;':''">{{item.publishTimeStr}}</span>
                </div>
              </div>
              <van-image
                v-if="item.coverPicUrlStr[0] && item.coverPicUrlStr[0]!=''"
                :src="item.coverPicUrlStr[0]"
                :style="{width:31+'vw',height:21.7+'vw'}"
                fit="cover"
              ></van-image>
            </div>
            <!--style==4-->
            <div
              :class="[item.coverPicUrlStr[0] && item.coverPicUrlStr[0]!=''?'typeThree':'typeTwo']"
              v-if="item.type==1&&item.style==4"
              @click="goDetail(item.infoId)"
            >
              <div class="two">{{item.title}}</div>
              <van-image
                v-if="item.coverPicUrlStr[0] && item.coverPicUrlStr[0]!=''"
                :src="item.coverPicUrlStr[0]"
                fit="cover"
                class="typeThreeImg"
                height="52.975vw"
              ></van-image>
              <div class="footerTitle2">
                <span class="source">{{item.sourceName}}</span>
                <!--:style="item.sourceName?'padding-left:15px;':''"-->
                <span>{{item.publishTimeStr}}</span>
              </div>
            </div>
            <!--style==5-->
            <div
              :class="[item.coverPicUrlStr[0] && item.coverPicUrlStr[0]!=''?'typeFive':'typeTwo']"
              v-if="item.type==1&&item.style==5"
              @click="goDetail(item.infoId)"
            >
              <div class="two" style="margin-bottom:3%;">{{item.title}}</div>
              <div class="typeFiveContent">
                <van-image
                  v-if="item.coverPicUrlStr[0] && item.coverPicUrlStr[0]!=''"
                  v-for="(imgPic,index) of item.coverPicUrlStr"
                  :key="index"
                  :src="imgPic"
                  width="31vw"
                  height="21.7vw"
                  fit="cover"
                ></van-image>
              </div>
              <div class="footerTitle2">
                <span class="source">{{item.sourceName}}</span>
                <!--:style="item.sourceName?'padding-left:15px;':''"-->
                <span>{{item.publishTimeStr}}</span>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import {
  manage,
  listById,
  bannerById,
  articleByTitle,
  getNoticeList
} from "@api/Consulting.js";

export default {
  name: "search",
  data() {
    return {
      title: "",
      // 文章内容
      myList: [],
      // 分页数据
      page: 0,
      pageDown: 0,
      img: require("../assets/img/1.png"),
      loading: false, // 当loading为true时，转圈圈
      finished: true, //
      noData: false, // 如果没有数据，显示暂无数据
      isLoading: false, // 下拉的加载图案
      num: 130
    };
  },
  mounted() {
    // 唤起手机键盘
    let dom = this.$refs.search;
    let input = dom.getElementsByClassName("van-field__control");
     localStorage.clear()
  },
  methods: {
    // 搜索事件
    onSearch(value) {
      this.myList = [];
      this.loading = false;
      this.finished = false;
      this.page = 0;
      this.pageDown = 0;
      // 获取title
      this.title = value;
      this.onLoad(1);
    },
    // 点击搜索按钮
    Search() {
      let value = document.getElementsByTagName("input")[0].value;
      this.onSearch(value);
    },
    // 列表上拉加载
    onLoad(flag) {
      // 关闭loading 同时开启 “加载中...” 样式
      this.loading = true;
      this.getInfo("UP", flag);
    },
    // 上拉分页事件
    getInfo(type, flag) {
      let content = {
        title: this.title,
        upDown: type,
        rowNum: this.page,
        pageSize: 5
      };
      articleByTitle(content).then(res => {
        if (res.data.code == "110400") {
          this.$toast("请输入关键词");
          this.loading = false;
          this.finished = true;
          return;
        }
        // 防止栏目切换出现请求数据错乱
        if (!!flag) {
          this.myList = [];
        }
        if (res.data.code === "000000") {
          this.loading = false; // 请求成功关闭 “加载中...” 样式
          this.myList = this.myList.concat(res.data.content);
          this.page += 5;
        }
        // 如果没有数据，显示暂无数据
        if (this.myList.length === 0 && this.page === 5) {
          this.noData = true;
          this.$toast("暂无相关数据");
        }
        // 如果没有数据
        if (res.data.content.length == 0) {
          this.loading = false;
          this.finished = true;
        }
      });
    },
    // 下拉加载
    onRefresh() {
      // 重新初始化这些属性
      this.isLoading = false;
      this.loading = false;
      this.finished = false;
      this.noData = false;
      // 请求信息
      this.getInfoDOWN();
    },
    // 下拉的分页事件
    getInfoDOWN() {
      // 请求列表数据
      let content = {
        title: this.title,
        upDown: "DOWN",
        rowNum: this.pageDown,
        pageSize: 5
      };
      articleByTitle(content).then(res => {
        if (res.data.code === "000000") {
          // 请求成功
          this.loading = false;
          // 如果有新数据来
          if (res.data.content.length > 0) {
            this.myList = res.data.content.concat(this.myList);
            this.pageDown += 5;
          }
        }
        // 如果没有数据，显示暂无数据this.pageDown === 0)
        // if (this.myList.length === 0) {
        //   this.noData = true;
        // }
        // 如果加载完毕，显示没有更多了
        if (res.data.content.length === 0) {
          // this.finished = true;
        }
      });
    },
    // 跳转详情页
    goDetail(id) {
      let url = window.location.href;
      let url2 = url.replace("search", "");
      acNative.navigateTo({
        url: `${url2}detail?id=${id}`,
        config: {
          navigationBarTitleText: "详情"
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../assets/css/listConten.less";
.van-image__error,
.van-image__img,
.van-image__loading {
  border-radius: 30px !important;
}
/*搜索框样式*/
.van-search__content,
.van-search__content--round {
  background-color: white;
}
</style>
