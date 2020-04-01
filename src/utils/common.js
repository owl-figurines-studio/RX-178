import Taro from "@tarojs/taro";
/**
 * @description 获取当前页url
 */

export const getCurrentPageIndex = () => {
  let pages = Taro.getCurrentPages()
  let currentPageIndex = pages.length - 1
  return currentPageIndex
}

export const getCurrentPageUrl = () => {
  let pages = Taro.getCurrentPages()
  let currentPage = pages[getCurrentPageIndex()]
  let url = `/${currentPage.route}`
  return url
}



