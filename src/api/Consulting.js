import service from '@util/request'
// 一二级栏目数据
export function manage (data) {
  // console.log('得到positionId的数据', data)
  return service.request({
    method: 'post',
    url: '/eportal/v1/manage/part/list',
    data
  })
}

// 列表数据
export function listById (data) {
  // console.log('根据栏目id请求文章数据', data)
  return service.request({
    method: 'post',
    url: '/eportal/v1/manage/part/article-list',
    data
  })
}

// 轮播图数据
export function bannerById (data) {
  // console.log('根据id请求轮播图数据', data)
  return service.request({
    method: 'post',
    url: '/eportal/v1/manage/part/banner-list',
    data
  })
}

// 详情页数据
export function articleById (query) {
  // console.log('根据id请求文章详情', query)
  return service.request({
    method: 'get',
    url: '/eportal/v1/manage/part/article-info',
    params: {
      id: query
    }
  })
}

// 搜索页数据
export function articleByTitle (data) {
  // console.log('根据id请求文章详情', query)
  return service.request({
    method: 'post',
    url: '/eportal/v1/manage/part/article-search',
    data
  })
}

export function getNoticeList (data) {
  // console.log('得到positionId的数据', data)
  return service.request({
    method: 'post',
    url: '/eportal/v1/manage/notice/list',
    data
  })
}
