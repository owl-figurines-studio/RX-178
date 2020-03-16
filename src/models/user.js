import Taro from '@tarojs/taro'
import * as userServices from '../servers/user'

const statusMessages = {
  '1000': { message: '请求成功', type: 'success' },
  '1001': { message: '验证通过', type: 'success' },
  '1002': { message: '上传成功', type: 'success' },
  '1003': { message: '添加成功', type: 'success' },
  '1004': { message: '删除成功', type: 'success' },
  '1005': { message: '查询成功', type: 'success' },
  '1006': { message: '修改成功', type: 'success' },

  '2000': { message: '请求错误', type: 'error' },
  '2001': { message: '手机号为空', type: 'error' },
  '2002': { message: '手机号格式错误', type: 'error' },
  '2003': { message: '验证码错误', type: 'error' },
  '2004': { message: '没有登录', type: 'error' },
  '2005': { message: '授权失效', type: 'error' },
  '2006': { message: '上传失败', type: 'error' },
  '2007': { message: '上传字段错误', type: 'error' },
  '2008': { message: '已有数据,无法添加', type: 'error' },
  '2009': { message: '修改错误,数据库中的条目不为1', type: 'error' },
  '2010': { message: '删除错误,没有数据', type: 'error' },
  '2011': { message: '查询错误,没有数据', type: 'error' },
  '2012': { message: '获取微信认证openid错误', type: 'error' },
}

const sendMessages = (userStateCode = 1000, disable = false) => {
  console.log(userStateCode)
  if (!disable && userStateCode) {
    const statusMessage = statusMessages[userStateCode]
    Taro.atMessage({ ...statusMessage })
  }
}

export default {
  namespace: "user",
  state: {
    userName: null,
    userPhone: null,
    userStateCode: null,
    loginCode: null,
  },
  effects: {
    * sendPhoneNum({ payload }, { call, put }) {
      const { userphone } = payload
      yield put({ type: 'saveUserPhone', payload: { userphone } })
      console.log('Hi')
      const { data } = yield call(userServices.sendPhoneNum, payload)
      const { userStateCode } = data
      sendMessages(userStateCode)
      yield put({ type: 'saveUserState', payload: { userStateCode } })
    },
    * code2Session({ payload: { code } }, { call, put }) {
      yield put({ type: 'saveLoginCode', payload: { loginCode: code } })
      const { data } = yield call(userServices.code2Session, { code })
      console.log(data)
    },
    * verifyok({ payload }, { call, put }) {
      const { data } = yield call(userServices.verifyok, payload)
      const { userStateCode } = data
      sendMessages(userStateCode)
      yield put({ type: 'saveUserState', payload: { userStateCode } })
    }
  },
  reducers: {
    saveUserName(state, { payload: { userName } }) {
      return { ...state, userName }
    },
    saveUserPhone(state, { payload: { userPhone } }) {
      return { ...state, userPhone }
    },
    saveUserState(state, { payload: { userStateCode } }) {
      return { ...state, userStateCode }
    },
    saveLoginCode(state, { payload: { loginCode } }) {
      return { ...state, loginCode }
    },
  }
}