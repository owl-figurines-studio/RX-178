import Taro from '@tarojs/taro'
import * as encounterServices from 'src/servers/encounter'

export default {
  namespace: "encounter",
  state: {
    encounters: [],
    currentEncounter: {},
  },
  effects: {
    *queryEncounter({ payload }, { call, put }) {
      yield call(delay, 1000);
      const { data } = yield call(encounterServices.queryEncounter, payload)
      const { encounter: { edges } } = data
      const encounters = edges.map(item => item.node)
      yield put({ type: 'saveEncounters', payload: { encounters } })
    },
    *createEncounter({ payload }, { call, put }) {
      const { data } = yield call(encounterServices.createEncounter, payload)
      const { createEncounter: { encounter } } = data
      yield put({ type: 'saveCurrentEncounter', payload: { currentEncounter: encounter } })
    },
    *updateEncounter({ payload }, { call, put }) {
      const { data } = yield call(encounterServices.updateEncounter, payload)
      const { updateEncounter: { encounter } } = data
      yield put({ type: 'saveCurrentEncounter', payload: { currentEncounter: encounter } })
    },
  },
  reducers: {
    saveEncounters(state, { payload: { encounters } }) {
      return { ...state, encounters }
    },
    saveCurrentEncounter(state, { payload: { currentEncounter } }) {
      return { ...state, currentEncounter }
    },
  },
}

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}