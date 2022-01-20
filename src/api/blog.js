import request from '@/utils/request.js'


export function addNewBlog(data) {
  return request({
    url: '/api/blog',
    method: 'post',
    data,
  })
}

export function deleteBlog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: 'delete',

  })
}

export function editBlog(id, data) {
  return request({
    url: `/api/blog/${id}`,
    method: 'put',
    data,
  })
}

export function getBlogByPage(data) {

  return request({
    url: "/api/blog",
    method: 'get',
    params: {
      ...data
    },
  })
}

export function findBlogById(id) {
  return request({
    url: `/api/blog/${id}`,
    method: 'get',
  })
}