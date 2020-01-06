<template>
  <div id="detail">
    <van-loading v-show="LOADING2" type="spinner" />
    <div class="detail">
      <!--标题-->
      <div class="detailTitle">
        <div style="width:90%;line-height:1.2;" class="two">{{articleContent.title}}</div>
        <div class="titlebottom">
          <!--white-space:nowrap;overflow:hidden;text-overflow:ellipsis;-->
          <span
            v-if="articleContent.sourceName!=''"
            style="color: #ccc;font-size:0.37rem;padding-left:6%;padding-right:5%;text-align:center"
          >{{articleContent.sourceName}}</span>
          <div v-if="articleContent.sourceName" style="height:0.5vh;"></div>
          <span
            :class="[articleContent.sourceName!=''?'source2':'source']"
          >{{articleContent.publishTimeStr}}</span>
        </div>
      </div>
      <!--内容-->
      <div class="detailContent" v-html="articleContent.content"></div>
      <!--作者-->
      <div v-if="articleContent.authorName!=''" class="author">作者 : {{articleContent.authorName}}</div>
      <!--附件-->
      <div v-if="articleContent.fileJson" class="detailFile" @click="download">
        <div class="detailFileIcon"></div>
        <div class="detailFileContent">
          <div class="three">{{name}}</div>
          <div class="fileSize">{{size}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { articleById } from "@api/Consulting.js";
export default {
  data() {
    return {
      url: "",
      articleContent: [],
      file: [],
      size: "",
      name: ""
    };
  },
  computed: {
    ...mapState(["LOADING2"])
  },
  mounted() {
    this.$store.commit("showLoading2");
    this.id = window.location.href.split("?")[1].split("=")[1];
    articleById(this.id).then(res => {
      if (res.data.code === "000000") {
        // 获取文章内容弄
        this.articleContent = res.data.content;
        if (res.data.content.fileJson !== "") {
          // 获取文件
          this.file = JSON.parse(res.data.content.fileJson);
        }
        // 获取文件大小数据
        if (res.data.content.fileJson) {
          let arr = res.data.content.fileJson;
          let arr2 = JSON.parse(arr);
          this.name = arr2[0].name;
          this.url = arr2[0].fileUrl;
          this.byteConvert(arr2[0].size);
        }
        this.$store.commit("hideLoading2");
        // 获取文章详情的img图片
        this.$nextTick(() => {
          let box = document.getElementById("contentBox");
          let imgs = box.getElementsByTagName("img");
          for (let i = 0; i < imgs.length; i++) {
            let url = imgs[i].src;
            imgs[i].src = this.prImgSrc;
            this.Imagess(url, imgs[i], () => {
              imgs[i].src = url;
            });
          }
        });
      }
    });
  },
  methods: {
    // 计算文件大小
    byteConvert(bytes) {
      if (isNaN(bytes)) {
        return "";
      }
      var symbols = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      var exp = Math.floor(Math.log(bytes) / Math.log(2));
      if (exp < 1) {
        exp = 0;
      }
      var i = Math.floor(exp / 10);
      bytes = bytes / Math.pow(2, 10 * i);

      if (bytes.toString().length > bytes.toFixed(2).toString().length) {
        bytes = bytes.toFixed(2);
      }

      this.size = bytes + " " + symbols[i];
    },
    // 打开文件
    download() {
      var params = {
        filePath: this.url,
        fileType: ""
      };
      //alert(JSON.stringify(params));
      acFile.openDocument(params, function(error, data) {
        if (error) {
          this.$toast("下载失败");
        }
      });
    },
    //判断是否加载完成
    Imagess(url, imgid, callback) {
      let that = this;
      let img = new Image();
      //如果因为网络或图片的原因发生异常，则显示该图片
      img.onerror = function() {
        img.src = this.prImgSrc;
      };
      img.src = url;
      if (img.complete) {
        callback(img, imgid);
      } else {
        img.onload = function() {
          callback(img, imgid);
          img.onload = null;
        };
      }
    }
  }
};
</script>
<style lang="less" >
.detailFile {
  border-top: 1px solid rgba(238, 231, 231, 0.05);
  padding-top: 4%;
  padding-bottom: 4%;
  display: flex;
  justify-content: space-between;
  .detailFileIcon {
    width: 13%;
    border-radius: 7px;
    padding: 13% 0 0;
    background: #1486ec url("../assets/img/file.png") no-repeat;
    background-position: center center;
    background-size: 80% 80%;
  }
  .detailFileContent {
    width: 85%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .three {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.4rem;
      font-weight: 500;
    }
    .fileSize {
      color: #ccc;
    }
  }
}
.van-loading {
  position: absolute;
  top: 0%;
  width: 100%;
  height: 100vh;
  background: white;
  z-index: 999;
}
.van-loading__spinner {
  margin-top: 40% !important;
  position: absolute;
  top: 15%;
  left: 45%;
}
.source {
  color: #ccc;
  font-size: 0.37rem;
}
.source2 {
  color: #ccc;
  font-size: 0.37rem;
  // padding-left: 15px;
  white-space: nowrap;
}
.titlebottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  color: #ccc;
  font-size: 0.35rem;
  width: 100%;
}

.two {
  letter-spacing: 1.5px;
  // text-overflow: -o-ellipsis-lastline;
  // overflow: hidden;
  text-align: center;
  // text-overflow: ellipsis;
  display: -webkit-box;
  // -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
  white-space: normal;
  word-wrap: break-word;
  font-weight: 500;
  font-size: 0.55rem;
  margin-bottom: 1.5%;
}
.detail {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 4%;
}
.detailTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  border-bottom: 1px solid rgba(200, 200, 200, 0.2);
  padding-bottom: 4%;
}
.detailContent {
  hyphens: auto;
  margin-top: -1vh;
  padding-bottom: 4%;
  padding-left:2%;
  padding-right:2%;
  text-align: justify;
  video {
    width: 100% !important;
    height: auto !important;
  }
  img {
    width: 100% !important;
    height: auto !important;
  }
  span {
    font-size: 0.45rem;
    line-height: 1.5;
    letter-spacing: 1px;
    img {
      width: 100% !important;
      height: auto !important;
    }
  }
  strong {
    font-size: 0.45rem;
    line-height: 1.5;
    letter-spacing: 1px;
  }
  p {
    font-size: 0.45rem;
    line-height: 1.5;
    letter-spacing: 1px !important;
    img {
      width: 100% !important;
      height: auto !important;
    }
  }
}
.author {
  color: #ccc;
  font-size: 0.4rem;
  padding-bottom: 2%;
  border-bottom: 1px solid rgba(1, 1, 1, 0.1);
}
</style>
