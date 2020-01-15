import Taro from '@tarojs/taro'
import * as userServices from '../servers/user'

export default {
  namespace: "user",
  state: {
    userName: null,
    userPhone: null,
    verifyStateCode: null,
    userStateCode: null,
  },
  effects: {
    * sendVerift({ payload }, { call, put }) {
      const { userphone: userPhone } = payload
      Taro.atMessage({
        'message': '消息通知',
        'type': 'success',
      })
      yield put({ type: 'saveUserPhone', payload: { userPhone } })
      const { data } = yield call(userServices.sendVerift, payload)
      const { verifyStateCode } = data
      yield put({ type: 'saveVerifyState', payload: { verifyStateCode } })
    },
    * phoneLogin({ payload }, { call, put }) {
      const { data } = yield call(userServices.phoneLogin, payload)
      const { userStateCode } = data
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
    saveVerifyState(state, { payload: { verifyStateCode } }) {
      return { ...state, verifyStateCode }
    },
    saveUserState(state, { payload: { userStateCode } }) {
      return { ...state, userStateCode }
    }
  }
}