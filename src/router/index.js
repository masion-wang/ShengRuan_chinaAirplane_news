import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
Vue.use(VueRouter)
const routes = [{
  path: '/',
  name: 'home',
  component: Home,
  meta: {
    keepAlive: true,
    scrollTop: 0
  }
},
{
  path: '/detail',
  name: 'detail',
  component: () => import('@views/detail.vue')
},
{
  path: '/search',
  name: 'search',
  component: () => import('@views/search.vue')
},
{
  path: '/test',
  name: 'test',
  component: () => import('@c/test.vue')
}
]
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
// router.beforeEach((to, from, next) => {
//   if (from.meta.keepAlive) {
//     alert(1)
//     const $content = document.querySelector('#content')
//     const scrollTop = $content ? $content.scrollTop : 0
//     from.meta.scrollTop = scrollTop
//   }
//   next()
// })
export default router
