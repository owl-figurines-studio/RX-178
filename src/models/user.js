const initState = {
  baseURL: 'https://www.easy-mock.com/mock/5db28388d9f3aa5b4d9036e6/',
  appOnLaunch: true,
  authorize: '',
}

const user = {
  namespace: 'user',
  state: initState,
  reducers: {
    appLaunched(state) {
      return { ...state, appOnLaunch: false }
    },
    insertAuthorize(state, { payload: { authorize } }) {
      return { ...state, authorize: authorize }
    }
  }
}

export default user