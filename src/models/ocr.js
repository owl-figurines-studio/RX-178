import Taro from '@tarojs/taro'
import * as ocrServices from 'src/servers/ocr'

export default {
  namespace: "ocr",
  state: {
    ocrRecord: [],
    currentOCRresult: [],
  },
  effects: {
    *queryOCR({ payload }, { call, put }) {
      const { data } = yield call(ocrServices.queryOCR, payload)
      const { ocr: { edges } } = data
      const ocrRecord = edges.map(item => item.node)
      yield put({ type: 'saveOCRecord', payload: { ocrRecord } })
    },
    *createOCR({ payload }, { call, put }) {
      const { data } = yield call(ocrServices.createOCR, payload)
      const { createOcr: { ocr } } = data
      const { result: currentOCRresult } = ocr
      yield put({ type: 'saveCurrentOCRresult', payload: { currentOCRresult } })
      yield put({ type: 'acquisition/saveIsNeedOCR', payload: { isNeedOCR: false } })
    },
    *switchCurrentOCRresult({ payload }, { select, put }) {
      const { ocrRecordID } = payload
      const { ocrRecord } = yield select(state => state.ocr)
      const { result: currentOCRresult } = yield ocrRecord.find(item => item.id === ocrRecordID)
      yield put({ type: 'saveCurrentOCRresult', payload: { currentOCRresult } })
    },
  },
  reducers: {
    saveOCRecord(state, { payload: { ocrRecord } }) {
      return { ...state, ocrRecord }
    },
    saveCurrentOCRresult(state, { payload: { currentOCRresult } }) {
      return { ...state, currentOCRresult }
    },
  },
}