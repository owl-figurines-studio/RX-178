import Taro from '@tarojs/taro'
import request from './http'


export async function sendData(params) {
  return request.post('/user/test', { data: params })
}

export async function sendImage(params) {
  return request.post('/acquisition/image', { data: params })
}