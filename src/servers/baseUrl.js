const getBaseUrl = (url) => {
  let BASE_URL = 'http://39.107.238.66:5000/api';
  if (process.env.NODE_ENV === 'development') {
    //开发环境 - 根据请求不同返回不同的BASE_URL
    if (url.includes('/api/')) {
      BASE_URL = 'http://39.107.238.66:5000/api'
    } else if (url.includes('/iatadatabase/')) {
      BASE_URL = 'http://39.107.238.66:5000/api'
    }
  } else {
    // 生产环境
    if (url.includes('/api/')) {
      BASE_URL = 'http://39.107.238.66:5000/api'
    } else if (url.includes('/iatadatabase/')) {
      BASE_URL = 'http://39.107.238.66:5000/api'
    }
  }
  return BASE_URL
}

export default getBaseUrl;
