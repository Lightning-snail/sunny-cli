// 新建模板功能
const downloadGitRepo = require('download-git-repo')  // 用来下载git上的模板
const util = require('util')
const ora = require('ora')  // 用来显示下载进度条
const inquirer  = require('inquirer');
const path = require('path')
const chalk = require('chalk')

const { getRepoList, getTagList, downloadTemplapte } = require('./http')

module.exports = class Generator {
  constructor(name, targetDir) {
    this.name = name
    this.targetDir = targetDir
    this.downloadGitRepo = util.promisify(downloadGitRepo)  // 这个库提供的是回调函数的方式调用,这里使用util.ipromisif将回调函数转换为promise
  }

  // 配置下载进度条方法
  async wrapLoading(fn ,message, ...args){
    const spinneer = ora(message);
    // 开始加载动画
    spinneer.start();

    try {
      // 执行完成
      const result = await fn(...args)
      // 停止加载动画
      spinneer.succeed();
      return result
    }catch {
      spinneer.fail('网络失败,重新请求');
    }
  }
  // 获取模板列表
  async getRepo() {
    const repoList = await this.wrapLoading(getRepoList, '正在下载,请稍等...')
    if(!repoList) return;

    const repos  = repoList.map(item => {
      return {
        name: item.name,
        value: item.name
      }
    });
    // 用户去选择已有的下载模板的名称
    let { repo } = await inquirer.prompt([
      {
        name: 'repo',
        type: 'list',
        message: '请选择模板',
        choices: repos
      }
    ])

    return repo;
  }

  // 获取版本号tag
  // 1. 基于repo的结果,远程拉版本列表
  // 2. 自动选择最新的tag
  async getTag(repo) {
    const tags = await this.wrapLoading(getTagList, '正在下载,请稍等...', repo)
    // 这里模拟数据有问题,看逻辑就行
    // 获取版本列表
    const tagList = tags.map(item => {
      return {
        name: item.name,
        value: item.name
      }
    });
    // 让用户选择版本号
    let { tag } = await inquirer.prompt([
      {
        name: 'tag',
        type: 'list',
        message: '请选择模板',
        choices: tagList
      }
    ])
    return tag
  }

  // 下载远程模板
  // 1. 拼接下载地址
  // 2. 调用下载方法
  async download(repo, tag){
    const requestUrl = `Lightning-snail/${repo}${tag ? `#${tag}` : ''}`
    // 下载
    await this.wrapLoading(
      this.downloadGitRepo,
      '正在下载模板,请稍等...',
      requestUrl,
      this.targetDir
      )
  }

  // 1. 从远端拉模板数据
  // 2. 用户去选择已有的下载模板的名称
  // 3. 返回用户选择的模板
  async create() {

    // 获取模板名称
    const repo = await this.getRepo()

    // 根据模板名称获取tag(版本号)
    const tag = await this.getTag(repo)

    // 根据模板名称和tag下载模板
    await this.download(repo, tag);

    console.log(`\r\n成功创建了项目 ${chalk.bgGreen(this.name)}`)
  }
}