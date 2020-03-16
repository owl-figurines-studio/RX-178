import Taro, { Component } from '@tarojs/taro'
import { AtTabBar, AtNavBar } from 'taro-ui'
import { View } from '@tarojs/components'
import RequestMessage from 'src/components/RequestMessage'
import { connect } from '@tarojs/redux'
import { getCurrentPageIndex, getCurrentPageUrl } from 'src/utils/common'
import { router } from 'src/utils/router'

import styles from './BasicPage.module.less'

const reLoginCode = [
  '2004',
  '2005',
]

const tabBarRoute = [
  'acquisition',
  'analysis',
  'management',
]

const mapStateToProps = ({ user }) => {
  const { userStateCode } = user
  return { userStateCode }
}

@connect(mapStateToProps)
class BasicPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTabBar: null,
    }
  }

  //onLoad
  componentWillMount() {
    //初始分享信息
    this.initShareMenu(this.state);
  }

  componentDidMount() {
    this.initCurrentTabBar()
    if (reLoginCode.findIndex(code => code === this.props.userStateCode) || !Taro.getStorageSync('RX-178')) {
      this.login()
    }
  }


  login = async () => {
    const { dispatch } = this.props
    Taro.login({
      success: result => {
        const { code } = result
        Taro.atMessage({
          'message': '登录成功',
          'type': 'success',
        })
        dispatch({
          type: 'user/code2Session',
          payload: {
            code,
          }
        })
      },
      fail: () => {
        Taro.atMessage({
          'message': '登录失败',
          'type': 'error',
        })
      },
    })
  }

  //重写分享
  onShareAppMessage() {
    let shareOptions = super.onShareAppMessage();
    //如果当前页面配置分享使用配置的
    if (shareOptions) return shareOptions;
    //默认分享
    return {
      title: '默认分享内容'
    }
  }

  //重新下拉刷新
  onPullDownRefresh() {
    if (super.onPullDownRefresh) {
      super.onPullDownRefresh();
      setTimeout(() => {
        Taro.stopPullDownRefresh();
      }, 1500)
    }
  }

  /**
   * 初始化分享信息
   */
  initShareMenu = state => {
    // 初始化页面分享信息
    if (state && state.canShare) {
      Taro.showShareMenu({
        withShareTicket: false
      })
    } else {
      Taro.hideShareMenu();
    }
  }

  initNavBarProps = () => {
    let navBarProps = {
      color: '#000',
    }
    //当前页是否位于栈底，能否返回上一页
    if (getCurrentPageIndex() > 0) {
      navBarProps = {
        ...navBarProps,
        leftIconType: 'chevron-left',
        leftText: '返回',
        onClickLeftIcon: () => { Taro.navigateBack({ delta: 1 }) },
      }
    }
    return navBarProps
  }

  initCurrentTabBar = () => {
    const url = getCurrentPageUrl()
    const current = tabBarRoute.findIndex(route => router(route) === url)
    this.setState({
      currentTabBar: current >= 0 ? current : 0
    })
  }

  tabBarOnClick = index => {
    const { currentTabBar } = this.state
    console.log(`cu ${currentTabBar} va ${index}`)
    if (index !== currentTabBar) {
      Taro.redirectTo({
        url: router(tabBarRoute[index])
      })
    }

  }


  render() {
    const { children, navBarProps, tabBarProps } = this.props
    const { currentTabBar } = this.state
    return (
      <View>
        <AtNavBar
          {...this.initNavBarProps()}
          {...navBarProps}
        />
        <RequestMessage />
        {children}
        <View className={styles.navTabBar}>
          <AtTabBar
            tabList={[
              { title: '数据获取' },
              { title: '数据分析' },
              { title: '管理' },
            ]}
            onClick={this.tabBarOnClick}
            current={currentTabBar}
            {...tabBarProps}
          />
        </View>

      </View>
    )
  }
}

export default BasicPage