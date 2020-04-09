import Taro from "@tarojs/taro";
/**
 * @description 获取当前页url
 */
export const getCurrentPageUrl = () => {
  let pages = Taro.getCurrentPages()
  let currentPage = pages[pages.length - 1]
  let url = currentPage.route
  return url
}

export const pageToLogin = () => {
  let path = getCurrentPageUrl()
  if (!path.includes('login')) {
    Taro.navigateTo({
      url: "/pages/login/login"
    });
  }
}

export const getArguments = (arg, isInput = false) => {
  let argString = ""
  if (Object.keys(arg).length > 0) {
    Object.keys(arg).forEach(key => {
      argString = `${argString} ${key}:"${arg[key]}"`
    })
    argString = isInput ? argString : `(${argString})`
  }
  return argString
}

