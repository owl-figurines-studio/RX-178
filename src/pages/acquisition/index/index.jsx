import Taro, { Component } from '@tarojs/taro'
import { View, Navigator, Button, ScrollView } from '@tarojs/components'
import { AtFloatLayout, AtTabs, AtTabsPane, AtList, AtListItem, AtModal, AtModalContent, AtModalAction, AtInput } from "taro-ui"
import { connect } from '@tarojs/redux'
import BasicPage from 'src/containers/BasicPage'
import { router } from 'src/utils/router'
import styles from './index.module.less'

@connect(({ acquisition }) => {
  const { isNeedOCR, uploadID, ocrResult } = acquisition
  return { isNeedOCR, uploadID, ocrResult }
})
class Acquisition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabsCurrent: 0,
      isTabsOpen: false,
      isOCRmodalOpen: false,
      currentOCRdetail: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  ocr = () => {
    const { dispatch, isNeedOCR, uploadID } = this.props
    if (isNeedOCR) {
      dispatch({
        type: 'acquisition/ocr',
        payload: {
          id: uploadID,
        }
      })
    }
  }

  swichTabsTabs = value => {
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
    console.log(detail)
    this.setState({ isOCRmodalOpen: true, currentOCRdetail: detail })
  }

  ocrDetailClose = () => {
    this.setState({ isOCRmodalOpen: false, currentOCRdetail: null })
  }

  ocrDetalChange = value => {
    this.setState({ currentOCRdetail: value }, console.log(this.state.currentOCRdetail))
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

  render() {
    const { ocrResult } = this.props
    const { isTabsOpen, tabsCurrent, isOCRmodalOpen, currentOCRdetail } = this.state
    const navBarProps = {
      title: '数据获取',
    }
    const tabList = [{ title: '文字识别' }, { title: '历史' }]
    return (
      <BasicPage navBarProps={navBarProps} tabBarVisible={!isTabsOpen} >
        <AtModal isOpened={isOCRmodalOpen}>
          <AtModalContent>
            <AtInput
              value={currentOCRdetail}
              onChange={this.ocrDetalChange}
            />
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.copyDetal} >复制</Button><Button onClick={this.ocrDetailClose} >关闭</Button>
          </AtModalAction>
        </AtModal>
        <View >
          <Navigator url={router('acquisition/image')} >图像</Navigator>
          <Button onClick={this.ocr} >OCR</Button>
          <Button onClick={this.openOCRtabs} >召唤</Button>
        </View>
        <AtFloatLayout isOpened={isTabsOpen} onClose={this.closeOCRtabs} >
          <AtTabs current={tabsCurrent} tabList={tabList} onClick={this.swichTabsTabs}>
            <AtTabsPane current={tabsCurrent} index={0} >
              {
                ocrResult && ocrResult.length > 0 ? (
                  <ScrollView className={styles.tabsPaneContent} scrollY >
                    <AtList>
                      {
                        ocrResult.map(
                          (item, index) => {
                            return <AtListItem
                              key={index}
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
                    <View className={styles.empty} >无数据</View>
                  )
              }
            </AtTabsPane>
            <AtTabsPane current={tabsCurrent} index={1}>
              <View className={styles.tabsPaneContent}>标签页二的内容</View>
            </AtTabsPane>
          </AtTabs>
        </AtFloatLayout>
      </BasicPage>
    )
  }
}

export default Acquisition