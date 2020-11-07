import Taro from '@tarojs/taro'
import * as acquisitionServices from 'src/servers/acquisition'

export default {
  namespace: "acquisition",
  state: {
    imagePath: null,
    isNeedOCR: false,
    uploadID: null,
    ocrResult: null,
    ocrID: null,
  },
  effects: {
    * uploadImage({ payload }, { call, put }) {
      const { data } = yield call(acquisitionServices.uploadImage, payload)
      const { path } = data
      yield put({ type: 'saveUploadID', payload: { uploadID: path } })
      yield put({ type: 'saveIsNeedOCR', payload: { isNeedOCR: true } })
    },
    * ocr({ payload }, { call, put }) {
      const { data } = yield call(acquisitionServices.ocr, payload)
      const { result } = data
      yield put({ type: 'saveOCRresult', payload: { ocrResult: result } })
      yield put({ type: 'saveIsNeedOCR', payload: { isNeedOCR: false } })
    },
    * asyOCR({ payload }, { call, put }) {
      const { data } = yield call(acquisitionServices.asyOCR, payload)
      const { task_id } = data
      yield put({ type: 'saveOCRID', payload: { ocrID: task_id } })
      yield put({ type: 'saveIsNeedOCR', payload: { isNeedOCR: true } })
    },
    *asyOCRresult({ payload }, { call, put }) {
      const { data } = yield call(acquisitionServices.asyOCRresult, payload)
      const { result } = data
      yield put({ type: 'saveOCRresult', payload: { ocrResult: result } })
      yield put({ type: 'saveIsNeedOCR', payload: { isNeedOCR: false } })
    },
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
    saveOCRID(state, { payload: { ocrID } }) {
      return { ...state, ocrID }
    },
  },
}
