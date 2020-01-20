import request from './http'

export async function sendVerift(params) {
  return request.post('/user/verify', { data: params, contentType: 'application/x-www-form-urlencoded;' })
}

export async function code2Session(params) {
  return request.post('/user/code2session', { data: params, contentType: 'application/x-www-form-urlencoded;' })
}

export async function phoneLogin(params) {
  return request.post('/user/login', { data: params, contentType: 'form' })
}
