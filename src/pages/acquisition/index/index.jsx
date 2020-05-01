import Taro, { Component } from '@tarojs/taro'
import { Picker, View, ScrollView, Text, MovableArea, MovableView, Image } from '@tarojs/components'
import {
  AtButton,
  AtFloatLayout,
  AtTabs,
  AtTabsPane,
  AtList,
  AtListItem,
  AtModal,
  AtModalContent,
  AtModalAction,
  AtInput,
  AtActivityIndicator,
  AtFab,
  AtIcon,
  AtAccordion,
} from "taro-ui"
import { connect } from '@tarojs/redux'
import BasicPage from 'src/containers/BasicPage'
import { router } from 'src/utils/router'
import styles from './index.module.less'

@connect(({ user, acquisition, ocr, loading, encounter, observation }) => {
  const { isNeedOCR, uploadID, ocrResult, ocrID } = acquisition
  const { currentOCRresult, ocrRecord } = ocr
  const { encounters, currentEncounter } = encounter
  const { observations, currentObservation } = observation
  const { patientInfo } = user
  return {
    isNeedOCR,
    uploadID,
    ocrResult,
    currentOCRresult,
    ocrRecord,
    ocrID,
    patientInfo,
    encounters,
    currentEncounter,
    observations,
    currentObservation,
    encounterLoading: loading.effects['encounter/createEncounter'],
    observationLoading: loading.effects['observation/createObservation'],
    ocrLoading: loading.effects['ocr/createOCR'],
    queryOCRloading: loading.effects['ocr/queryOCR'],
  }
})
class Acquisition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabsCurrent: 0,
      isTabsOpen: false,
      isOCRmodalOpen: false,
      currentOCRdetail: null,
      isHistoryModalOpen: false,
      fabOpacity: 1,
      isFabMenuOpen: false,
      dataList: [{ key: '', value: '' }],
      isDataListOpen: false,
      switchOCRrecordID: null,
      currentRecordImage: null,
      encounterCode: null,
      period: "",
    }
  }

  componentDidMount() {
    const { isNeedOCR } = this.props
    if (isNeedOCR) {
      this.ocr()
      this.openOCRtabs
    }
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  navToImageAcquisition = () => {
    const url = router('acquisition/image')
    Taro.navigateTo({ url })

  }

  // ocr = () => {
  //   const { dispatch, ocrID } = this.props
  //   dispatch({
  //     type: 'acquisition/asyOCRresult',
  //     payload: {
  //       task_id: ocrID
  //     },
  //   })
  //   this.openOCRtabs()
  // }

  ocr = () => {
    const { dispatch, uploadID } = this.props
    dispatch({
      type: 'ocr/createOCR',
      payload: {
        arg: { path: uploadID },
        fields: ['id', 'path', 'result', 'imageurl'],
      }
    })
    this.openOCRtabs()
  }



  swichTabs = value => {
    if (value === 1) {
      this.queryOCR()
    }
    this.setState({
      tabsCurrent: value
    })
  }

  openOCRtabs = () => {
    this.setState({ isTabsOpen: true })
  }

  closeOCRtabs = () => {
    this.setState({ isTabsOpen: false })
  }

  ocrDetailOpen = detail => {
    this.setState({ isOCRmodalOpen: true, currentOCRdetail: detail })
  }

  ocrDetailClose = () => {
    this.setState({ isOCRmodalOpen: false, currentOCRdetail: null })
  }

  ocrDetalChange = value => {
    this.setState({ currentOCRdetail: value })
  }

  copyDetal = () => {
    const { currentOCRdetail } = this.state
    Taro.setClipboardData({
      data: currentOCRdetail,
      success: () => {
        this.setState({ isOCRmodalOpen: false, isTabsOpen: false })
      }
    })
  }

  historyConfirmOpen = record => {
    const { id, imageurl } = record
    console.log(imageurl)
    this.setState({ isHistoryModalOpen: true, switchOCRrecordID: id, currentRecordImage: imageurl })
  }

  historyConfirmClose = () => {
    this.setState({ isHistoryModalOpen: false })
  }

  fabTouchStart = () => {
    this.setState({ fabOpacity: 0.5 })
  }

  fabTouchEnd = () => {
    this.setState({ fabOpacity: 1 })
  }

  fabOnClick = () => {
    const { isFabMenuOpen } = this.state
    this.setState({ isFabMenuOpen: !isFabMenuOpen })
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

  clickDataList = value => {
    this.setState({
      isDataListOpen: value
    })
  }

  queryOCR = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'ocr/queryOCR',
      payload: {
        arg: {},
        fields: ['id', 'path', 'result', 'imageurl', 'updatetime'],
      },
    })
  }

  switchCurrentOCRresult = () => {
    const { dispatch } = this.props
    const { switchOCRrecordID } = this.state
    if (switchOCRrecordID) {
      dispatch({
        type: 'ocr/switchCurrentOCRresult',
        payload: {
          ocrRecordID: switchOCRrecordID,
        }
      })
    }
    this.historyConfirmClose()
    this.swichTabs(0)
  }

  createEncounter = () => {
    const { dispatch } = this.props
    const { encounterCode, period } = this.state
    if (encounterCode) {
      dispatch({
        type: 'encounter/createEncounter',
        payload: {
          arg: {
            classmodel: {
              code: encounterCode,
            },
            period,
          },
          fields: ['id', 'classmodel{code}'],
        }
      }).then(() => this.createObservations())
    }
  }

  createObservations = () => {
    const { dataList } = this.state
    const { patientInfo, currentEncounter, dispatch } = this.props
    const { id: observationSubject } = patientInfo
    const { id: observationEncounter } = currentEncounter
    if (observationEncounter && observationSubject) {
      const observationParameter = dataList.map(item => {
        return {
          arg: {
            subject: {
              reference: observationSubject
            },
            encounter: {
              reference: observationEncounter
            },
            code: {
              text: item.key
            },
            valueQuantity: {
              value: item.value
            }
          },
          fields: [
            'subject{reference}',
            'encounter{reference}',
            'code{text}',
            'valueQuantity{value}',
          ],
        }
      })
      console.log(observationParameter)
      dispatch({
        type: 'observation/createObservations',
        payload: {
          observationParameter,
        }
      })
    }
  }


  render() {
    const { currentOCRresult, ocrRecord, ocrLoading, queryOCRloading } = this.props
    const {
      isTabsOpen,
      tabsCurrent,
      isOCRmodalOpen,
      currentOCRdetail,
      isHistoryModalOpen,
      fabOpacity,
      isFabMenuOpen,
      dataList,
      isDataListOpen,
      currentRecordImage,
      encounterCode,
      period
    } = this.state
    const navBarProps = {
      title: '数据获取',
    }
    const tabList = [{ title: 'OCR结果' }, { title: '历史' }]
    return (
      <BasicPage navBarProps={navBarProps} tabBarVisible={!isTabsOpen} >
        <MovableArea className={styles.movableArea}>
          <AtModal isOpened={isOCRmodalOpen}>
            <AtModalContent>
              <AtInput
                value={currentOCRdetail}
                onChange={this.ocrDetalChange}
              />
            </AtModalContent>
            <AtModalAction>
              <AtButton onClick={this.copyDetal} >复制</AtButton><AtButton onClick={this.ocrDetailClose} >关闭</AtButton>
            </AtModalAction>
          </AtModal>

          <AtModal isOpened={isHistoryModalOpen}>
            <AtModalContent>
              <Image className={styles.modalImage} src={currentRecordImage} mode='aspectFit' />
            </AtModalContent>
            <AtModalAction>
              <AtButton onClick={this.switchCurrentOCRresult} >切换此次结果</AtButton><AtButton onClick={this.historyConfirmClose} >关闭</AtButton>
            </AtModalAction>
          </AtModal>

          <AtAccordion
            open
            title='基本信息'
          >
            <AtInput title='报告名称' onChange={value => { this.setState({ encounterCode: value }) }} value={encounterCode} />
            <Picker mode='date' onChange={event => { this.setState({ period: event.target.value }) }}>
              <View className='at-input'>
                获取时间：{period}
              </View>
            </Picker>
          </AtAccordion>
          <AtAccordion
            open={isDataListOpen}
            onClick={this.clickDataList}
            title='数据'
          >
            <View>
              <View className='at-row'>
                <View className='at-col at-col-5'  ><View style={{ 'marginLeft': '32rpx' }}>项目名称</View></View>
                <View className='at-col at-col-5'  ><View style={{ 'marginLeft': '32rpx' }}>检查结果</View></View>
                <View className='at-col at-col-2'>删除</View>
              </View>
              {
                dataList.map(
                  (item, index) => {
                    return (
                      <View className='at-row' key={`${item}_${index}`}>
                        <View className='at-col at-col-5'>
                          <AtInput value={item.key} onChange={value => this.dataChange(index, 'key', value)} />
                        </View>
                        <View className='at-col at-col-5'>
                          <AtInput type='number' value={item.value} onChange={value => this.dataChange(index, 'value', value)} />
                        </View>
                        {
                          dataList.length > 1 ? (
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
              <View className='at-row'>
                <View className='at-col'>
                  <AtButton onClick={this.addData} ><AtIcon value='add' />新增</AtButton>
                </View>
                <View className='at-col'>
                  <AtButton onClick={this.initData} ><AtIcon value='close' />清空</AtButton>
                </View>
              </View>
            </View>
          </AtAccordion>

          <View >
            <MovableView
              className={styles.movableView}
              direction='all' onTouchStart={this.fabTouchStart}
              onTouchEnd={this.fabTouchEnd}
              onClick={this.fabOnClick}
              x='100'
              y='10'
            >
              <View className={styles.fabButton} style={{ opacity: fabOpacity }} >
                <AtFab size='small' >
                  <Text className='at-fab__icon at-icon at-icon-menu'></Text>
                </AtFab>
              </View>
              {
                isFabMenuOpen ? (
                  <View className={styles.fabMenu} >
                    <AtIcon className={styles.menuLeft} value='camera' size={20} onClick={this.navToImageAcquisition} />
                    <AtIcon className={styles.menuTop} value='bullet-list' size={20} onClick={this.openOCRtabs} />
                    <AtIcon className={styles.menuRight} value='external-link' size={20} onClick={this.createEncounter} />
                  </View>
                ) : null
              }
            </MovableView>
          </View>
          <AtFloatLayout isOpened={isTabsOpen} onClose={this.closeOCRtabs} >
            <AtTabs current={tabsCurrent} tabList={tabList} onClick={this.swichTabs}>
              <AtTabsPane current={tabsCurrent} index={0} >
                {
                  ocrLoading ? (
                    <View className={styles.empty} >
                      <AtActivityIndicator isOpened={ocrLoading} size={70} content='压榨服务器中' mode='center' />
                    </View>
                  ) : (
                      currentOCRresult && currentOCRresult.length > 0 ? (
                        <ScrollView className={styles.tabsPaneContent} scrollY >
                          <AtList>
                            {
                              currentOCRresult.map(
                                (item, index) => {
                                  return <AtListItem
                                    key={`${item}_${index}`}
                                    arrow='right'
                                    title={item}
                                    extraText='详情'
                                    onClick={() => this.ocrDetailOpen(item)}
                                  />
                                }
                              )
                            }
                          </AtList>
                        </ScrollView>
                      ) : (
                          <View className={styles.empty} >
                            <View>无数据</View>
                          </View>
                        )
                    )
                }
              </AtTabsPane>
              <AtTabsPane current={tabsCurrent} index={1}>
                {
                  queryOCRloading ? (
                    <View className={styles.empty} >
                      <AtActivityIndicator className={styles.loading} isOpened={ocrLoading} size={70} content='压榨服务器中' />
                    </View>
                  ) : (
                      ocrRecord && ocrRecord.length > 0 ? (
                        <ScrollView className={styles.tabsPaneContent} scrollY >
                          <AtList>
                            {
                              ocrRecord.map(
                                (item, index) => {
                                  return <AtListItem
                                    key={`${item}_${index}`}
                                    arrow='right'
                                    title={item.updatetime}
                                    extraText='详情'
                                    onClick={() => this.historyConfirmOpen(item)}
                                  />
                                }
                              )
                            }
                          </AtList>
                        </ScrollView>
                      ) : (
                          <View className={styles.empty} >
                            <View>无历史</View>
                          </View>
                        )
                    )
                }
              </AtTabsPane>
            </AtTabs>
          </AtFloatLayout>
        </MovableArea>
      </BasicPage>
    )
  }
}

export default Acquisition