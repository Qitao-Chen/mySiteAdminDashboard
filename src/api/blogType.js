import request from "@/utils/request.js"

// add blog type
export function addBlogType(data) {
  return request({
    url: '/api/blogtype',
    method: 'post',
    data,
  })
}
//delete blogtype
export function deleteBlogType(id) {
  console.log(id)
  return request({
    url: `/api/blogtype/${id}`,
    method: 'delete',
  })
}
// Modify blog type
export function changeBlogType(editInfo) {
  console.log(editInfo)
  return request({
    url: `/api/blogtype/${editInfo.id}`,
    method: 'put',
    data: editInfo.data,
  })
}
//check blog type api
export function getBlogType() {
  return request.get('/api/blogtype');
}