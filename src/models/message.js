const initState = {
  message: null,
  disabled: false,
  isChange: false,
}

export default {
  namespace: "message",
  state: initState,
  effects: {
    * newMessage({ payload }, { put, select }) {
      const { message } = payload
      const { message: oldMessage } = yield select(state => state.message)
      const isChange = message === oldMessage
      yield put({ type: 'saveMessage', payload: { message } })
      yield put({ type: 'saveIsChange', payload: { isChange } })
    }
  },
  reducers: {
    saveMessage(state, { payload: { message } }) {
      return { ...state, message }
    },
    saveDisable(state, { payload: { disabled } }) {
      return { ...state, disabled }
    },
    saveIsChange(state, { payload: { isChange } }) {
      return { ...state, isChange }
    },
    resetState() {
      return initState
    }
  }
}