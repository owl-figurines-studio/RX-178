import Taro from '@tarojs/taro'
import * as acquisitionServices from 'src/servers/acquisition'

export default {
  namespace: "acquisition",
  state: {
    imagePath: null
  },
  effects: {
    * sendImage({ payload }, { call }) {
      const { data } = yield call(acquisitionServices.sendImage, payload)
      console.log(data)
    }
  },
  reducers: {
    saveImagePath(state, { payload: { imagePath } }) {
      return { ...state, imagePath }
    }
  },
}