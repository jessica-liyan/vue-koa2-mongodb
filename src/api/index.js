import axios from 'axios'

export const base = 'http://192.168.4.76:4000'

function getData (url) {
  return axios({
    method: 'get',
    url: url
  })
}

function postData (url, data) {
  return axios({
    method: 'post',
    url: url,
    data: data
  })
}

function getDataWithToken (url, token) {
  return axios({
    method: 'get',
    url: url,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

function postDataWithToken (url, data, token) {
  return axios({
    method: 'post',
    url: url,
    data: data,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function register(data){
  return postData(`${base}/register`, data)
}

export function login(data){
  return postData(`${base}/login`, data)
}

export function logout(token){
  return getDataWithToken(`${base}/logout`, token)
}

export function fetchCaptcha(){
  return getData(`${base}/captcha`)
}

export function sendMail(email){
  return getData(`${base}/mailer?email=${email}`)
}

// 用户信息
export function fetchSelf(token){
  return getDataWithToken(`${base}/user`, token)
}

// 用户信息
export function fetchUser(id, token){
  return getDataWithToken(`${base}/user/${id}`, token)
}

// 更新用户资料
export function updateUser(data, token){
  return postDataWithToken(`${base}/user/update`, data, token)
}

// 我的发布
export function getMyArticle(id, token){
  return getDataWithToken(`${base}/user/${id}/post`, token)
}

// 我的动态
export function getMyLog(id, token){
  return getDataWithToken(`${base}/user/${id}/log`, token)
}

// 我喜欢的文章
export function getMyLike(id, token){
  return getDataWithToken(`${base}/user/${id}/like`, token)
}

// 添加文章
export function addArticle(data, token){
  return postDataWithToken(`${base}/article/add`, data, token)
}

// 更新文章 
export function updateArticle(data, token){
  return postDataWithToken(`${base}/article/update`, data, token)
}

// 删除文章 
export function deleteArticle(id, token){
  return getDataWithToken(`${base}/article/delete/${id}`, token)
}

// 喜欢文章
export function likeArticle(id, token){
  return axios({
    method: 'put',
    url: `${base}/article/like/${id}`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

// 取消喜欢文章
export function dislikeArticle(id, token){
  return axios({
    method: 'delete',
    url: `${base}/article/like/${id}`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

// 评论文章 data= {content, targetId, parentId}
export function addComment(data, token){
  return postDataWithToken(`${base}/comment`, data, token)
}

// 评论列表 文章id
export function getCommentList(id, token){
  return getDataWithToken(`${base}/comment/${id}`, token)
}

// 文章列表
export function getArticle(page, limit){
  return getData(`${base}/article?page=${page}&limit=${limit}`)
}

// 文章分类列表
export function getSubArticle(type, page, limit){
  return getData(`${base}/article/${type}?page=${page}&limit=${limit}`)
}

// 文章详情
export function getArticleDetail(id){
  return getData(`${base}/article/detail/${id}`)
}

// 用户添加关注
export function followUser(followeeId, followerId, token){
  return getDataWithToken(`${base}/follow?followeeId=${followeeId}&followerId=${followerId}`, token)
}

// 用户取消关注
export function unfollowUser(followeeId, followerId, token){
  return getDataWithToken(`${base}/unfollow?followeeId=${followeeId}&followerId=${followerId}`, token)
}

// 是否关注
export function isFollowedUser(followeeId, followerId, token){
  return getDataWithToken(`${base}/isfollowed?followeeId=${followeeId}&followerId=${followerId}`, token)
}

// 用户关注列表
export function getFolloweeList(id, token){
  return getDataWithToken(`${base}/followeeList/${id}`, token)
}

// 用户粉丝列表
export function getFollowerList(id, token){
  return getDataWithToken(`${base}/followerList/${id}`, token)
}

// 用户消息列表
export function getNotification(id, token){
  return getDataWithToken(`${base}/notification/${id}`, token)
}

// 未读消息个数
export function getNotificationNum(id, token){
  return getDataWithToken(`${base}/getNotificationNum/${id}`, token)
}

// 发送消息
export function sendMessage(data, token){
  return postDataWithToken(`${base}/message`, data, token)
}

// 历史消息
export function getMessageList(data, token){
  return postDataWithToken(`${base}/message/list`, data, token)
}

// 当前用户的聊天好友列表
export function getMessageFriends(id, token){
  return getDataWithToken(`${base}/message/${id}`, token)
}