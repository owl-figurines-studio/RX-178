import * as analysisServices from '../servers/analysis'

const initState = {
  diabetesResult: null
}

export default {
  namespace: "analysis",
  state: initState,
  effects: {
    * diabetesPredic({ payload }, { put, call }) {
      const { data } = yield call(analysisServices.diabetesPredic, payload)
      const { result: diabetesResult } = data
      yield put({ type: 'saveDiabetesResult', payload: { diabetesResult } })
    }
  },
  reducers: {
    saveDiabetesResult(state, { payload: { diabetesResult } }) {
      return { ...state, diabetesResult }
    },
  }
}