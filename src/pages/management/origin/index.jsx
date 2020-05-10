import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtTag, AtModal, AtAccordion, AtIcon, AtList, AtListItem, AtActivityIndicator, AtCheckbox } from 'taro-ui'
import { connect } from '@tarojs/redux'
import classNames from 'classnames'
import BasicPage from 'src/containers/BasicPage'
import EditField from 'src/components/editField'
import EditDate from 'src/components/editDate'
import { changedFieldKeys } from 'src/utils/common'
// import { router } from 'src/utils/router'
import styles from './index.module.less'


@connect(({ encounter, observation, user, loading }) => {
  const { encounters, currentEncounter } = encounter
  const { observations } = observation
  const { patientInfo } = user
  return {
    encounters,
    currentEncounter,
    observations,
    patientInfo,
    queryObservationLoading: loading.effects['observation/queryObservation'],
    createObservationLoading: loading.effects['observation/createObservation'],
    updateObservationLoading: loading.effects['observation/updateObservation'],
    queryEncounterLoading: loading.effects['encounter/queryEncounter'],
    updateEncounterLoading: loading.effects['encounter/updateEncounter']
  }
})
class Origin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      isEdit: false,
      isOpenUpdateModal: false,
      currentEncounterPeriod: "",
      currentEncounterCode: "",
      isEncounterOpen: false,
      isObservationOpen: false,
      dataList: [
        {
          key: '血细胞',
          value: '12',
        },
      ],
      deleteList: [],
      updateList: [],
      createList: [],
      changedEncounter: {},
      isEncounterEdit: false,
      encountersEditList: [],
    }
  }

  componentDidMount() {
    this.queryEncounter()
  }

  componentWillReceiveProps() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onEdit = () => {
    const {
      isEdit,
      isOpenUpdateModal,
    } = this.state
    if (isEdit) {
      const changedEncounter = this.changedEncounter()
      const { deleteList, updateList, createList } = this.changedObservations()
      const isChange = deleteList.length > 0 || updateList.length > 0 || createList.length > 0 || Object.keys(changedEncounter).length > 0
      if (!isOpenUpdateModal && isChange) {
        this.openUpdateModal()
      }
    }
    this.setState({
      isEdit: !isEdit
    })
  }

  onEncounterEdit = () => {
    const { isEncounterEdit } = this.state
    this.setState({
      isEncounterEdit: !isEncounterEdit
    })
  }

  changedEncounter = () => {
    const {
      currentEncounterCode,
      currentEncounterPeriod,
    } = this.state
    const nextEncounter = { code: currentEncounterCode, period: currentEncounterPeriod }
    const { currentEncounter: { classmodel: { code }, period } } = this.props
    const changedEncounterKey = changedFieldKeys(
      { code, period }, { ...nextEncounter }
    )
    let changedEncounter = {}
    changedEncounterKey.forEach(key => { changedEncounter[key] = nextEncounter[key] })
    this.setState({ changedEncounter })
    return changedEncounter
  }

  changedObservations = () => {
    const { dataList } = this.state
    const { observations } = this.props
    const prevObservations = observations.map(item => {
      const { code: { text }, valueQuantity: { value, unit } } = item
      return { key: text, value, unit }
    })
    const deleteList = []
    const updateList = []
    const createList = []
    prevObservations.forEach(item => {
      const index = dataList.findIndex(nextItem => nextItem.key === item.key)
      if (index > -1) {
        const changedKeys = changedFieldKeys(item, dataList[index])
        if (changedKeys && changedKeys.length > 0) {
          updateList.push(dataList[index])
        }
      } else {
        deleteList.push(item)
      }
    })
    dataList.forEach(item => {
      const index = prevObservations.findIndex(prevItem => prevItem.key === item.key)
      if (index < 0) {
        createList.push(item)
      }
    })
    this.setState({ deleteList, updateList, createList })
    return { deleteList, updateList, createList }
  }

  openUpdateModal = () => {
    this.setState({
      isOpenUpdateModal: true
    })
  }

  closeUpdateModal = () => {
    this.setState({
      isOpenUpdateModal: false
    })
  }

  onCurrentEncounterCodeChange = value => {
    this.setState({
      currentEncounterCode: value
    })
  }

  onCurrentEncounterPeriodChange = event => {
    this.setState({
      currentEncounterPeriod: event.target.value
    })
  }

  encounterSwitch = value => {
    this.setState({
      isEncounterOpen: value
    })
  }

  observationSwitch = value => {
    this.setState({
      isObservationOpen: value
    })
  }

  addData = () => {
    const { dataList } = this.state
    const newList = [...dataList, { key: '', value: '' }]
    this.setState({ dataList: newList })
  }

  subtractData = key => {
    const { dataList } = this.state
    const newList = dataList.filter((item, index) => index !== key)
    this.setState({ dataList: newList })
  }

  initData = () => {
    this.setState({ dataList: [{ key: '', value: '' }] })
  }

  dataChange = (indexKey, itemKey, value) => {
    const { dataList } = this.state
    let newItem = { ...dataList[indexKey] }
    newItem[itemKey] = value
    dataList.splice(indexKey, 1, newItem)
    this.setState({ dataList })
  }

  currentSwitch = value => {
    this.setState({
      current: value
    })
  }

  queryEncounter = () => {
    const { dispatch } = this.props
    dispatch({
      type: "encounter/queryEncounter",
      payload: {
        arg: { active: true },
        fields: ['id', 'period', 'classmodel{code}'],
      }
    })
  }

  queryObservation = (arg = {}) => {
    const { dispatch } = this.props
    dispatch({
      type: "observation/queryObservation",
      payload: {
        arg,
        fields: [
          'id',
          'code{text}',
          'encounter{reference}',
          'subject{reference}',
          'valueQuantity{value,unit}'
        ],
      }
    })
  }

  detail = encounter => {
    this.currentSwitch(1)
    this.saveCurrentEncounter(encounter)
    this.queryObservationByEncounter(encounter)
  }

  saveCurrentEncounter = encounter => {
    const { dispatch } = this.props
    dispatch({
      type: "encounter/saveCurrentEncounter",
      payload: {
        currentEncounter: encounter
      }
    })
    this.initEncounter()
  }

  queryObservationByEncounter = encounter => {
    const { dispatch } = this.props
    const { id } = encounter
    dispatch({
      type: "observation/queryObservation",
      payload: {
        arg: {
          active: true
        },
        fields: [
          'id',
          'code{text}',
          'encounter{reference}',
          'subject{reference}',
          'valueQuantity{value,unit}',
          'active',
        ],
      }
    }).then(() => {
      const { observations } = this.props
      const nextObservations = observations.filter(item => {
        const { encounter: { reference } } = item
        return reference === id
      })
      const dataList = nextObservations.map(item => {
        const { code: { text }, valueQuantity: { value, unit } } = item
        return { key: text, value, unit }
      })
      this.setState({ dataList })
      dispatch({
        type: 'observation/saveObservations',
        payload: { observations: nextObservations }
      })
    })
  }

  initEncounter = () => {
    const { currentEncounter } = this.props
    if (Object.keys(currentEncounter).length > 0) {
      const { classmodel: { code: currentEncounterCode }, period: currentEncounterPeriod } = currentEncounter
      this.setState({ currentEncounterCode, currentEncounterPeriod })
    }
  }

  update = () => {
    const { deleteList, updateList, createList, changedEncounter } = this.state
    console.log(deleteList)
    if (deleteList.length > 0) { this.deleteObservations(deleteList) }
    if (updateList.length > 0) { this.updateObservations(updateList) }
    if (createList.length > 0) { this.createObservations(createList) }
    if (Object.keys(changedEncounter).length > 0) { this.updateEncounter() }
    this.setState({ isOpenUpdateModal: false })
  }

  deleteObservations = deleteList => {
    const { observations, dispatch } = this.props
    console.log(deleteList)
    deleteList.forEach(item => {
      const { key } = item
      const { id } = observations.find(observation => {
        const { code: { text } } = observation
        return text == key
      })
      dispatch({
        type: "observation/updateObservation",
        payload: {
          arg: {
            id,
            active: false
          },
          fields: [
            'id',
            'subject{reference}',
            'encounter{reference}',
            'code{text}',
            'valueQuantity{value}',
          ]
        }
      })
    })
  }

  updateObservations = updateList => {
    const { observations, dispatch } = this.props
    updateList.forEach(item => {
      const { key, value, unit } = item
      const { id } = observations.find(observation => {
        const { code: { text } } = observation
        return text == key
      })
      dispatch({
        type: "observation/updateObservation",
        payload: {
          arg: {
            id,
            valueQuantity: {
              value: parseFloat(value),
              unit,
            }
          },
          fields: [
            'id',
            'subject{reference}',
            'encounter{reference}',
            'code{text}',
            'valueQuantity{value}',
          ]
        }
      })
    })
  }

  createObservations = createList => {
    const { patientInfo, currentEncounter, dispatch } = this.props
    const { id: observationSubject } = patientInfo
    const { id: observationEncounter } = currentEncounter
    createList.forEach(item => {
      const { key, value, unit } = item
      dispatch({
        type: "observation/createObservation",
        payload: {
          arg: {
            subject: {
              reference: observationSubject,
            },
            encounter: {
              reference: observationEncounter,
            },
            code: {
              text: key,
            },
            valueQuantity: {
              value: parseFloat(value),
              unit,
            }
          },
          fields: [
            'id',
            'subject{reference}',
            'encounter{reference}',
            'code{text}',
            'valueQuantity{value}',
          ]
        }
      })
    })
  }

  updateEncounter = () => {
    const { dispatch, currentEncounter } = this.props
    const { currentEncounterCode, currentEncounterPeriod } = this.state
    const { id } = currentEncounter

    dispatch({
      type: "encounter/updateEncounter",
      payload: {
        arg: {
          id,
          classmodel: {
            code: currentEncounterCode
          },
          period: currentEncounterPeriod
        },
        fields: [
          'id',
          'period',
          'classmodel{code}'
        ]
      }
    })
  }

  onEncountersEditListChange = nextList => {
    this.setState({
      encountersEditList: nextList,
    })
  }

  deleteEncounters = () => {
    const { encountersEditList } = this.state
    const { encounters, dispatch } = this.props
    encountersEditList.forEach(item => {
      const { id } = encounters[item]
      dispatch({
        type: 'encounter/updateEncounter',
        payload: {
          arg: {
            id,
            active: false,
          },
          fields: ['id', 'period', 'classmodel{code}'],
        }
      }).then(() => {
        this.setState({ isEncounterEdit: false })
        this.queryEncounter()
      })
    })
  }

  render() {
    const {
      current,
      isEdit,
      isOpenUpdateModal,
      currentEncounterPeriod,
      currentEncounterCode,
      isEncounterOpen,
      isObservationOpen,
      dataList,
      isEncounterEdit,
      encountersEditList,
    } = this.state
    const navBarProps = {
      title: '元数据',
    }

    const {
      encounters,
      queryObservationLoading,
      createObservationLoading,
      updateObservationLoading,
      queryEncounterLoading,
      updateEncounterLoading,
    } = this.props

    return (
      <BasicPage navBarProps={navBarProps} >

        {/* <AtSegmentedControl
          values={['概览', '详情']}
          onClick={this.currentSwitch}
          current={this.state.current}
        /> */}
        {
          current === 0 ? (
            <View>
              {queryEncounterLoading || updateEncounterLoading ? (
                <AtActivityIndicator mode='center' content='加载中' size='50px' />
              ) : (
                  <View>
                    <View className={styles.header} >
                      <View className={classNames('at-row')} >
                        <View className={classNames('at-col', 'at-col-1')} onClick={() => { Taro.navigateBack({ delta: 1 }) }} >
                          <AtIcon value='chevron-left' color='#7093EA' />
                        </View>
                        <View className={classNames('at-col', 'at-col-1', styles.return)} onClick={() => { Taro.navigateBack({ delta: 1 }) }} >
                          返回
                        </View>
                        <View className={classNames('at-col', 'at-col-3', 'at-col__offset-4')} >
                          {
                            isEncounterEdit ? (
                              <AtTag
                                size='normal'
                                circle
                                onClick={this.deleteEncounters}
                                active
                              >
                                删除
                              </AtTag>
                            ) : null
                          }
                        </View>
                        <View className={classNames('at-col', 'at-col-3')} >
                          <AtTag
                            size='normal'
                            circle
                            onClick={this.onEncounterEdit}
                            active
                          >
                            {isEncounterEdit ? ('完成') : ('编辑')}
                          </AtTag>
                        </View>
                      </View>
                    </View>
                    <View className={styles.content} >
                      {
                        encounters.length > 0 ? (
                          <View>
                            {
                              isEncounterEdit ? (
                                <View>
                                  <AtCheckbox
                                    options={
                                      encounters.map((item, index) => {
                                        const { classmodel: { code }, period } = item
                                        return { label: code, value: index, desc: period }
                                      })
                                    }
                                    selectedList={encountersEditList}
                                    onChange={this.onEncountersEditListChange}
                                  />
                                </View>
                              ) : (
                                  <View>
                                    {
                                      encounters.map(item => {
                                        const { classmodel: { code }, period } = item
                                        return (
                                          <AtList key={`${code}${period}`} >
                                            <AtListItem
                                              title={code}
                                              note={period}
                                              extraText='详细信息'
                                              arrow='right'
                                              onClick={() => this.detail(item)}
                                            />
                                          </AtList>
                                        )
                                      })
                                    }
                                  </View>
                                )
                            }

                          </View>
                        ) : (
                            <View className={styles.empty} >
                              <View>无数据</View>
                            </View>
                          )
                      }
                    </View>
                  </View>)}
            </View>
          ) : (
              <View>
                <AtModal
                  isOpened={isOpenUpdateModal}
                  title='确认更改'
                  cancelText='取消'
                  confirmText='确认'
                  onClose={this.closeUpdateModal}
                  onCancel={this.closeUpdateModal}
                  onConfirm={this.update}
                  content='是否保存修改'
                />
                {updateEncounterLoading || queryObservationLoading || updateObservationLoading || createObservationLoading ? (
                  <AtActivityIndicator mode='center' content='加载中' size='50px' />
                ) : (<View>
                  <View className={styles.header} >
                    <View className={classNames('at-row')} >
                      <View className={classNames('at-col', 'at-col-1')} onClick={() => this.currentSwitch(0)} >
                        <AtIcon value='chevron-left' color='#7093EA' />
                      </View>
                      <View className={classNames('at-col', 'at-col-1', styles.return)} onClick={() => this.currentSwitch(0)} >
                        返回
                </View>
                      <View className={classNames('at-col', 'at-col-3', 'at-col__offset-7')} >
                        <AtTag
                          size='normal'
                          circle
                          onClick={this.onEdit}
                          active
                        >
                          {isEdit ? ('完成') : ('编辑')}
                        </AtTag>
                      </View>
                    </View>
                  </View>
                  <View className={styles.content}>
                    <AtAccordion
                      open={isEncounterOpen}
                      onClick={this.encounterSwitch}
                      title='基本信息'
                    >
                      <View className='at-row'>
                        <View className={classNames('at-col', 'at-col-3', styles.title)} >检查名称：</View>
                        <View className={classNames('at-col', 'at-col-8', styles.editItem)} >
                          <EditField isEdit={isEdit} value={currentEncounterCode} onChange={this.onCurrentEncounterCodeChange} />
                        </View>
                      </View>
                      <View className='at-row'>
                        <View className={classNames('at-col', 'at-col-3', styles.title)} >检查时间：</View>
                        <View className={classNames('at-col', 'at-col-8', styles.editItem)} >
                          <EditDate isEdit={isEdit} value={currentEncounterPeriod} onChange={this.onCurrentEncounterPeriodChange} />
                        </View>
                      </View>
                      <View className='at-row'>
                        <View className={classNames('at-col', 'at-col-3', styles.title)} >来源：</View>
                        <View className={classNames('at-col', 'at-col-8', styles.editItem)} >
                          <EditField value='自我报告' />
                        </View>
                      </View>
                    </AtAccordion>
                    <AtAccordion
                      open={isObservationOpen}
                      onClick={this.observationSwitch}
                      title='数据'
                    >
                      <View>
                        <View className='at-row'>
                          <View className='at-col at-col-4'  ><View style={{ 'marginLeft': '32rpx' }}>项目名称</View></View>
                          <View className='at-col at-col-3'  ><View style={{ 'marginLeft': '32rpx' }}>检查结果</View></View>
                          <View className='at-col at-col-3'  ><View style={{ 'marginLeft': '32rpx' }}>单位</View></View>
                          {
                            isEdit ? (<View className='at-col at-col-2'>删除</View>) : null
                          }
                        </View>
                        {
                          dataList.map(
                            (item, index) => {
                              return (
                                <View className='at-row' key={`${item}_${index}`}>
                                  <View className='at-col at-col-4'>
                                    <EditField isEdit={isEdit} value={item.key} onChange={value => this.dataChange(index, 'key', value)} />
                                  </View>
                                  <View className='at-col at-col-3'>
                                    <EditField isEdit={isEdit} value={item.value} onChange={value => this.dataChange(index, 'value', value)} />
                                  </View>
                                  <View className='at-col at-col-3'>
                                    <EditField isEdit={isEdit} value={item.unit} onChange={value => this.dataChange(index, 'unit', value)} />
                                  </View>
                                  {
                                    dataList.length > 1 && isEdit ? (
                                      <View className='at-col at-col-2'>
                                        <AtIcon onClick={() => this.subtractData(index)} value='subtract-circle' color='red' />
                                      </View>
                                    ) : null
                                  }
                                </View>
                              )
                            }
                          )
                        }
                        {
                          isEdit ? (
                            <View className='at-row'>
                              <View className='at-col'>
                                <Button onClick={this.addData} ><AtIcon value='add' />新增</Button>
                              </View>
                              <View className='at-col'>
                                <Button onClick={this.initData} ><AtIcon value='close' />清空</Button>
                              </View>
                            </View>
                          ) : null
                        }

                      </View>
                    </AtAccordion>
                  </View>
                </View>)
                }
              </View>
            )
        }


      </BasicPage>
    )
  }
}

export default Origin