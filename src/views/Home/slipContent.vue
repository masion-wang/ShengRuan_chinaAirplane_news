<template>
  <div class="slipContent" style="background:white;height:100%;">
    <!--没有请求到文章数据+轮播图数据-->
    <noData v-if="noArticleData && noBannerData"></noData>
    <!--下滑-->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      style="background:white;min-height=70vh;"
    >
      <!--上拉-->
      <van-list
        style="background:white;"
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        :offset="10"
        :immediate-check="false"
        :finished-text="myList.length>0?'-已经到底了-':''"
      >
        <div v-if="banner && banner.length>0" style="height:2vh;background:white;"></div>
        <!--轮播图-->
        <swiper v-if="banner && banner.length>0" :options="swiperOption" ref="swiper">
          <swiper-slide
            v-for="(item,index) of banner"
            :key="index"
            @click="goDetail(item.infoId)"
            :class="{'swiper-no-swiping':banner.length<=1}"
          >
            <!--遮罩层-->
            <div class="titleBackground">
              <div class="titleDot">
                <div class="title">{{item.title}}</div>
                <span class="dot">{{index+1}}/{{banner.length}}</span>
              </div>
            </div>
            <img
              :src="item.picUrl"
              :style="{width:90+'vw',height:50.625+'vw',marginLeft: leftIndex+'%'}"
              @click="goDetail(item.infoId)"
              class="border"
            />
            <!-- </van-image> -->
          </swiper-slide>
          <!-- <div
            v-show="banner.length>1"
            class="swiper-pagination"
            style="padding-top:.3rem"
            slot="pagination"
          ></div>-->
        </swiper>
        <!--文章列表 1-无图，2-单图左，3-单图右，4单图大图，5-三图-->
        <div
          v-if="myList && myList.length>0"
          style="padding-left:3%;padding-right:3%;background:white;"
        >
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
                :style="{width:31+'vw',height:21.7+'vw'}"
                :src="item.coverPicUrlStr[0]"
                fit="cover"
              ></van-image>
              <div class="typeOneContent">
                <div class="two">{{item.title}}</div>
                <div class="footerTitle">
                  <span class="source">{{item.sourceName}}</span>
                  <!--:style="item.sourceName?'padding-left:15px;':''"-->
                  <div>{{item.publishTimeStr}}</div>
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
                  <span>{{item.publishTimeStr}}</span>
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
import { manage, listById, bannerById } from "@api/Consulting.js";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import noData from "./noData.vue";

export default {
  name: "slipContent",
  components: {
    swiper,
    swiperSlide,
    noData
  },
  created() {},
  mounted() {
    this.myList = [];
    this.$nextTick(() => {
      // 如果存在banner数据
      if (JSON.parse(localStorage.getItem("banners")) != null) {
        this.$store.commit(
          "BannerData",
          JSON.parse(localStorage.getItem("banners"))
        );
        if (this.FirstWatchTabId && this.FirstWatchTabId == this.tabsFirstId) {
          let banner = {
            categoryId: this.tabsFirstId
          };
          bannerById(banner)
            .then(res => {
              if (res.data.code === "000000") {
                this.noBannerData = false;
                this.swiperOption.loop = true;
                // 将轮播图数据交给vuex
                this.$store.commit("BannerData", res.data.content);
                // 将BannerData数据保存到localstorage里面 仅仅保存第一级栏目第一栏目的id珊瑚橘
                if (this.tabsFirstId === this.id) {
                   localStorage.setItem("banners", JSON.stringify(res.data.content))
                }
                // 如果只有一张图 轮播图不动
                if (res.data.content.length == 1) {
                  this.swiperOption.loop = false;
                }
                // 如果一张都没有
                if (res.data.content.length < 1) {
                  this.noBannerData = true;
                }
              }
            })
            .catch(err => {
              alert(err.message)
              this.$toast("轮播图数据请求异常");
            });
        }
      }
      // 如果存在文章数据
      if (JSON.parse(localStorage.getItem("articles")) != null) {
        this.myList = JSON.parse(localStorage.getItem("articles"));
        this.page = 0;
        this.loading = false;
        this.finished = false;
        this.id = this.tabsFirstId;
        if (this.FirstWatchTabId && this.FirstWatchTabId == this.tabsFirstId) {
          this.onLoad(1);
        }
      }
    });
  },
  computed: {
    FirstWatchTabId: {
      get() {
        return this.$store.state.FirstWatchTabId
          ? this.$store.state.FirstWatchTabId
          : "";
      },
      set(val) {
        // this.$store.commit("BannerData", val);
      }
    },
    banner: {
      get() {
        return this.$store.state.bannerData ? this.$store.state.bannerData : [];
      },
      set(val) {
        // this.$store.commit("BannerData", val);
      }
    },
    tabsFirstId() {
      return this.$store.state.tabsDataFirstId;
    }
  },
  watch: {
    "$store.state.tabId": function(newFlag, oldFlag) {
      // 重置scrolltop位置
      document.body.scrollTop = 0;
      this.$store.commit("getFirstWatchTabId", newFlag);
      // 获取一级或二级栏目id
      this.id = newFlag;
      // 清空文章数据+轮播图数据
      this.myList = [];
      this.$store.commit("BannerData", []);
      //  如果是第一级栏目的第一个栏目或者二级栏目第一个 缓存数据
      if (this.id == this.tabsFirstId) {
        // 如果存在banner数据
        if (JSON.parse(localStorage.getItem("banners")) != null) {
          this.$store.commit(
            "BannerData",
            JSON.parse(localStorage.getItem("banners"))
          );
        }
        // 如果存在文章数据
        if (JSON.parse(localStorage.getItem("articles")) != null) {
          this.myList = JSON.parse(localStorage.getItem("articles"));
          this.page = 0;
          this.loading = false;
          this.finished = false;
        }
      }
      // 获取轮播图数据
      let banner = {
        categoryId: this.id
      };
      bannerById(banner)
        .then(res => {
          if (res.data.code === "000000") {
            this.noBannerData = false;
            this.swiperOption.loop = true;
            // 将轮播图数据交给vuex
            this.$store.commit("BannerData", res.data.content);
            // 将BannerData数据保存到localstorage里面 仅仅保存第一级栏目第一栏目的id珊瑚橘
            if (this.tabsFirstId === newFlag) {
              localStorage.setItem("banners", JSON.stringify(res.data.content));
            }
            // 如果只有一张图 轮播图不动
            if (res.data.content.length == 1) {
              this.swiperOption.loop = false;
            }
            // 如果一张都没有
            if (res.data.content.length < 1) {
              this.noBannerData = true;
            }
          }
        })
        .catch(err => {
          this.$toast("轮播图数据请求异常");
        });
      // 每次栏目id发生变化 初始化以下数据
      this.page = 0;
      this.loading = false;
      this.finished = false;
      this.onLoad(1);
    },
    immediate: true
  },
  data() {
    return {
      leftIndex: 5, // 轮播图左边距
      swiperOption: {
        spaceBetween: -8 + "%",
        pagination: {
          el: ".swiper-pagination"
        },
        slidesPerView: 1,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        }
      }, // 轮播图数据
      myList: [], // 文章数据
      id: "", // 栏目id
      page: 0, // 下拉页码
      pageDown: 0, // 上拉页码
      img1: require("../../assets/img/1.png"),
      img2: require("../../assets/img/2.png"),
      img3: require("../../assets/img/3.png"),
      img4: require("../../assets/img/4.png"),
      loading: false, // 当loading为true时，转圈圈
      finished: false, // 当finished为true 结束上拉事件
      noArticleData: false, // 判断是否有文章数据
      noBannerData: false, // 判断是否有轮播图数据
      isLoading: false // 下拉的加载图案
    };
  },
  methods: {
    // 列表上拉加载
    onLoad(flag) {
      // 开启 “加载中...” 样式 进行上拉的分页请求
      this.loading = true;
      this.getInfo("UP", flag);
    },
    // 上拉分页事件
    getInfo(type, flag) {
      let content = {
        categoryId: this.id,
        upDown: type,
        rowNum: this.page,
        pageSize: 5
      };
      this.noArticleData = false;
      listById(content)
        .then(res => {
          if (flag) {
            // 如果第一次请求清空文章列表
            this.myList = [];
          }
          if (res.data.code === "000000") {
            this.loading = false; // 请求成功关闭 “加载中...” 样式
            this.myList = this.myList.concat(res.data.content);
            this.page += 5;
          }
          // 第一次请求的数据并且是一级栏目的第一个栏目
          if (
            res.data.code === "000000" &&
            this.page === 5 &&
            this.tabsFirstId === this.id
          ) {
            // 将BannerData数据保存到localstorage里面
            localStorage.setItem("articles", JSON.stringify(res.data.content));
          }
          // 如果请求没有数据，显示暂无数据
          if (this.myList.length === 0 && this.page === 5) {
            this.noArticleData = true;
          }
          // 如果加载完毕，显示没有更多了
          if (res.data.content.length === 0) {
            this.finished = true;
          }
        })
        .catch(err => {
          this.loading = false; // 不转'加载中。。。' 了
          this.$toast("文章数据请求异常");
        });
    },
    // 下拉加载  ？
    onRefresh() {
      // 重新初始化这些属性
      this.isLoading = false;
      this.loading = false;
      this.finished = false;
      this.noArticleData = false;
      // 如果没有一二级栏目的数据 返回到 tab.vue 组件重新请求一二级栏目数据数据  this.getTabsData();
      if (this.id == "") {
        this.$bus.$emit("retry","badInternet");
      } else {
        // alert(1)
        // 请求下拉分页
        this.$bus.$emit("retry",this.id);
        this.getInfoDOWN();
      }
    },
    // 下拉的分页事件
    getInfoDOWN() {
      // 刷新轮播图数据
      let banner = {
        categoryId: this.id
      };
      bannerById(banner).then(res => {
        if (res.data.code === "000000") {
          this.$store.commit("BannerData", res.data.content);
          // 将BannerData数据保存到localstorage里面
          if (this.tabsFirstId === newFlag) {
            localStorage.setItem("banners", JSON.stringify(res.data.content));
          }
        }
      });

      // 请求列表数据
      let content = {
        categoryId: this.id,
        upDown: "DOWN",
        rowNum: this.pageDown,
        pageSize: 5
      };
      listById(content).then(res => {
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
        //   this.noArticleData = true;
        // }
        // 如果加载完毕，显示没有更多了
        if (res.data.content.length === 0) {
          // this.$toast("暂无更多数据");
        }
      });
    },
    // 跳转详情页
    goDetail(id) {
      let url = window.location.href;
      acNative.navigateTo({
        url: `${url}detail?id=${id}`,
        config: {
          navigationBarTitleText: "详情"
        }
      });
    }
  }
};
</script >
<style lang="less" scoped>
@import "../../assets/css/listConten.less";
.slipContent {
  height: 100vh;
}
/*轮播图图片样式*/
.border {
  border-radius: 12px !important;
  object-fit: fill !important;
}
.van-image__error,
.van-image__img,
.van-image__loading {
  border-radius: 30px !important;
}
/*轮播图相关样式*/
.van-swipe {
  background: white;
  padding-bottom: 20px;
}
.van-swipe__indicators {
  top: 95% !important;
  bottom: 0.1rem !important;
}
</style>
