import Vue from 'vue'
import {
  Button,
  Loading,
  Sticky,
  Tab,
  Tabs,
  Row,
  Col,
  Search,
  List,
  Cell,
  Image,
  Lazyload,
  Swipe,
  SwipeItem,
  PullRefresh,
  Toast,
  Popup
} from 'vant'
Vue.use(Popup)
Vue.use(Button)
Vue.use(Loading)
Vue.use(Sticky)
Vue.use(Tabs)
Vue.use(Tab)
Vue.use(List)
Vue.use(Cell)
Vue.use(Image)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Lazyload, {
  preLoad: 1.3,
  attempt: 1,
  error: require('../assets/img/3.png'),
  loading: require('../assets/img/2.png')
})
// Vue.use(Lazyload)
Vue.use(PullRefresh)
Vue.use(Search)
Vue.use(Row)
Vue.use(Col)
Vue.use(Toast)
