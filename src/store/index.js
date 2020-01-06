import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tabsDataFirstId: '', // 第一级栏目的第一个栏目id
    contentData: [], // 文章内容数据
    bannerData: [], // 轮播图数据
    tabId: '', // 二级栏目的id
    FirstWatchTabId: '', // watch第一次的tabid
    LOADING: false,
    LOADING2: false
  },
  mutations: {
    // 保存第一级栏目的第一个栏目id
    getTabsFirstId(state, tabsDataFirstId) {
      state.tabsDataFirstId = tabsDataFirstId
    },
    // 获得栏目id(包含一二级栏目id)
    getTabsId(state, data) {
      state.tabId = data
    },
    // 获取文章内容数据
    ContentData(state, data) {
      state.contentData = data
      return state.ContentData
    },
    // 获取轮播图内容数据
    BannerData(state, data) {
      state.bannerData = data
      return state.bannerData
    },
    // 获取第一次watch到的tabId
    getFirstWatchTabId(state, data) {
      state.FirstWatchTabId = data
    },

    showLoading(state) {
      state.LOADING = true
    },
    hideLoading(state) {
      state.LOADING = false
    },
    showLoading2(state) {
      state.LOADING2 = true
    },
    hideLoading2(state) {
      state.LOADING2 = false
    }
  },
  plugins: [createPersistedState()]
})
