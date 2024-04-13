// 网络请求
const axios = require('axios');

axios.interceptors.response.use(res=>{
  return res.data;
})
// 获取模板列表
const getRepoList = async function(){
  return axios.get('https://api.github.com/users/Lightning-snail/repos')
} 

// 获取指定模板的tag列表
const getTagList = async function(repo){
  return axios.get(`https://api.github.com/repos/Lightning-snail/${repo}/tags`)  // 获取指定模板的tag列表
}


module.exports = {
  getRepoList,
  getTagList
}