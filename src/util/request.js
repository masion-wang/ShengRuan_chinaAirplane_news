import axios from 'axios'
const baseURL = process.env.NODE_ENV === 'production' ? '' : ''
const service = axios.create({
  baseURL: baseURL,
  retry: 1,
  retryDelay: 6000
})
// 获取token
function getCurrentUserInfo (config) {
  let data = acNative.getUserInfo()
  let result = JSON.parse(data)
  config.headers.common['Authorization'] = `Bearer ${result.token}`
}

// service.defaults.headers.common['Authorization'] =
//   'Bearer NTJhZTNjNGMtZWY0Ni00M2M3LThhMTktN2U1MzBiMGNmYzQz'

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    getCurrentUserInfo(config)
    // 在发送请求之前做些什么
    // let token = JSON.parse(localStorage.getItem('token'))
    // alert(1)
    // if (token) {
    //   config.headers.common['Authorization'] = `Bearer ${token}`
    // }
    return config
  },
  function (err) {
    var config = err.config
    // 如果config不存在或者retry这个选项没有 返回错误
    if (!config || !config.retry) return Promise.reject(err)

    // 设置一个变量用来追踪重新请求次数 这个不会被释放
    config.__retryCount = config.__retryCount || 0

    // 检查是否超过最多请求次数 如果超过返回错误
    if (config.__retryCount >= config.retry) {
      // Reject with the error
      // 网络异常
      this.$toast('网络环境异常')
      return Promise.reject(err)
    }

    // 每次增加这个变量
    config.__retryCount += 1

    // 创建一个定时器函数 用来重新请求
    var backoff = new Promise(function (resolve) {
      setTimeout(function () {
        resolve()
      }, config.retryDelay || 1)
    })

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function () {
      return axios(config)
    })
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default service
