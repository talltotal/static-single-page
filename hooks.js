const fs = require('fs')
const path = require('path')

// 将.hooks文件夹内的文件都拷贝到./git/hooks文件夹内
// 根据git config不同

function getGitHookDir () {
  const gitPath = path.join(__dirname, './.git')
  const configPath = path.join(gitPath, './config')
  const defaultHooksPath = path.join(gitPath, './hooks')

  const config = fs.readFileSync(configPath).toString()
  const hooksPathConfig = config.match(/\[core\][^\[]*hooksPath *= *(\S+)/)
  if (hooksPathConfig) {
    return hooksPathConfig[1]
  } else {
    return defaultHooksPath
  }
}

const localHookDir = path.join(__dirname, './.hooks')
fs.readdir(localHookDir, (err, files) => {
  if (err) throw err

  const gitHookDir = getGitHookDir()
  files.forEach(file => {
    if (file[0] !== '.') {
      fs.copyFile(path.join(localHookDir, file), path.join(gitHookDir, file), () => {})
    }
  })
})