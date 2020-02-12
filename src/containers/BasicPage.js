import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import RequestMessage from 'src/components/RequestMessage'
import auth from 'src/utils/auth'
import { connect } from '@tarojs/redux'

const mapStateToProps = ({ user }) => {
  const { loginCode } = user
  return { loginCode }
}

@connect(mapStateToProps)
class BasicPage extends Component {

  constructor(props) {
    super(props);
  }

  //onLoad
  componentWillMount() {
    //初始分享信息
    this.initShareMenu(this.state);
  }

  componentDidMount() {
    this.login()
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

  login = async () => {
    // const { dispatch } = this.props
    // Taro.login({
    //   success: result => {
    //     const { code } = result
    //     console.log(result)
    //     Taro.atMessage({
    //       'message': '登录成功',
    //       'type': 'success',
    //     })
    //     dispatch({
    //       type: 'user/code2Session',
    //       payload: {
    //         code,
    //       }
    //     })
    //     console.log(`Hi => ${this.props.loginCode}`)
    //   },
    //   fail: () => {
    //     Taro.atMessage({
    //       'message': '登录失败',
    //       'type': 'error',
    //     })
    //   },

    // })
    let result = await auth.appCheckAuth();
    //授权成功
    if (result) {
      //调用父组件的函数
      super.componentDidMount && super.componentDidMount();
    } else {
      //授权失败
      Taro.showToast({
        title: '授权失败',
        icon: 'none',
        mask: true
      })
    }
  }

  render() {
    const { children } = this.props
    return (
      <View>
        <RequestMessage />
        {children}
      </View>
    )
  }
}

export default BasicPage