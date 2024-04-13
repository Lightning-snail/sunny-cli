// 1.对外抛出一个方法用来接收用户要创建的文件项目名以及参数
const fs = require('fs-extra');  // 对文件的操作
const inquirer  = require('inquirer');
const path = require('path') // 做路劲处理的
const Generator = require('./generator')
module.exports = async function(name, options) {
  // 判断项目是否存在
  const cwd = process.cwd();  //当前命令行的路径
  const targetAir = path.join(cwd, name);
  // 判断目录是否存在
  if(fs.existsSync(targetAir)){
    if(options.force){  //如果用户输入了 -f 或者--force,说明用户想强制创建
      await fs.remove(targetAir); // 这里就删除掉老的文件
    }else { // 如果没有输入 -f 或者--force,说明用户不希望强制创建
      // 向用户提示,询问已有项目是否覆盖
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: '该项目已存在',
          choices: [
            {
              name: '覆盖',
              value: 'overwrite'
            },
            {
              name: '取消',
              value: false
            }
          ]
        }
      ])
      // 如果用户拒绝覆盖则停止操作
      if(!action){
        return;
      }else if (action === 'overwrite'){
        await fs.remove(targetAir); // 这里就删除掉老的文件
      }
    }
  }

  // 新建模板
  const generator = new Generator(name , targetAir);
  generator.create();

}