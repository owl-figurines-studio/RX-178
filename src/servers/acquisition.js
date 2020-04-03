import Taro from '@tarojs/taro'
import request from './http'


export async function ocr(params) {
  return request.post('/acquisition/ocr', { data: params })
}

export async function uploadImage(params) {
  const { imagePath } = params
  let response = null
  await Taro.uploadFile({
    url: "http://39.107.238.66:5000/api/acquisition/uploadimage",
    filePath: imagePath,
    name: "UploadImage",
    header: {
      'content-type': 'multipart/form-data',
      'Authorization': `Bearer ${Taro.getStorageSync('RX-178')}`,
    },
    formData: {},
    complete: res => {
      const { data } = res
      response = JSON.parse(data)
    },
  })
  return response
}

