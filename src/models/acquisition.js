import Taro from '@tarojs/taro'
import * as acquisitionServices from 'src/servers/acquisition'

export default {
  namespace: "acquisition",
  state: {
    imagePath: null,
    isNeedOCR: false,
    uploadID: null,
    ocrResult: null,
  },
  effects: {
    * uploadImage({ payload }, { call, put }) {
      const { data } = yield call(acquisitionServices.uploadImage, payload)
      const { id } = data
      yield put({ type: 'saveUploadID', payload: { uploadID: id } })
      yield put({ type: 'saveIsNeedOCR', payload: { isNeedOCR: true } })
    },
    * ocr({ payload }, { call, put }) {
      const { data } = yield call(acquisitionServices.ocr, payload)
      const { result } = data
      yield put({ type: 'saveOCRresult', payload: { ocrResult: result } })
      yield put({ type: 'saveIsNeedOCR', payload: { isNeedOCR: false } })
    }
  },
  reducers: {
    saveImagePath(state, { payload: { imagePath } }) {
      return { ...state, imagePath }
    },
    saveIsNeedOCR(state, { payload: { isNeedOCR } }) {
      return { ...state, isNeedOCR }
    },
    saveUploadID(state, { payload: { uploadID } }) {
      return { ...state, uploadID }
    },
    saveOCRresult(state, { payload: { ocrResult } }) {
      return { ...state, ocrResult }
    },
  },
}
