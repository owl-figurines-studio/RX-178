import Taro from '@tarojs/taro'
import * as observationServices from 'src/servers/observation'

export default {
  namespace: "observation",
  state: {
    observations: [],
    currentObservation: {},
  },
  effects: {
    *queryObservation({ payload }, { call, put }) {
      const { data } = yield call(observationServices.queryObservation, payload)
      const { ocr: { edges } } = data
      const observations = edges.map(item => item.node)
      yield put({ type: 'saveObservations', payload: { observations } })
    },
    *createObservations({ payload }, { select, put }) {
      const { observationParameter } = payload
      let observations = yield select((state) => state.observation.observations)
      for (let index in observationParameter) {
        const item = observationParameter[index]
        console.log(item)
        const observation = yield put({ type: 'createObservation', payload: { ...item } })
        observations = [...observations, observation]
      }
      yield put({ type: 'saveObservations', payload: { observations: observations } })
    },
    *createObservation({ payload }, { call }) {
      console.log(payload)
      const { data } = yield call(observationServices.createObservation, payload)
      const { createObservation: { observation } } = data
      return observation
    },
    *updateObservations({ payload }, { select, put }) {
      const { observationParameter } = payload
      let observations = yield select((state) => state.observation.observations)
      for (let index in observationParameter) {
        const item = observationParameter[index]
        const observation = yield put({ type: 'updateObservations', payload: { ...item } })
        observations = [...observations, observation]
      }
      yield put({ type: 'saveObservations', payload: { observations: observations } })
    },
    *updateObservation({ payload }, { call }) {
      const { data } = yield call(observationServices.updateObservation, payload)
      const { updateObservation: { observation } } = data
      return observation
    },
  },
  reducers: {
    saveObservations(state, { payload: { observations } }) {
      return { ...state, observations }
    },
    saveCurrentObservation(state, { payload: { currentObservation } }) {
      return { ...state, currentObservation }
    },
  },
}