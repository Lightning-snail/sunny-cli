#! /usr/bin/env node

// 引入命令行模块,用来创建命令行
const  program = require('commander');

// 定义命令和参数

// create 命令
program
.command('create <app-name>')
.description('创建一个新的项目')  // 对这个命令的描述
.option('-f --force', 'overwrit target directory if it exist') // 命令附加的配置
.action((name, cmd) => {  // 执行这个命令的回调函数 name--> <app-name> cmd--> -f --force
    require('../lib/create')(name, cmd) // 这里将创建命令作为单独的模块维护,这个入口文件用于整个脚手架的入口整合
})
program.parse();  // 开始执行