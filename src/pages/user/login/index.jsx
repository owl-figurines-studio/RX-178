import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import pageInit from '../../utils/pageInit'


@connect(({ user }) => {
  const { verifyStateCode } = user
  return { verifyStateCode }
})
@pageInit()
class Login extends Component {

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  config = {
    navigationBarTitleText: '登录'
  };

  componentDidShow() { }

  componentDidHide() { }

  sendVerift = () => {
    this.props.dispatch({
      type: 'user/sendVerift',
      payload: {
        username: '18258232093'
      }
    })
  }

  render() {
    const { verifyStateCode } = this.props
    return (
      <View className='login'>
        <Button className='sendVerift' onClick={this.sendVerift}>发送验证</Button>
        <View><Text>{verifyStateCode}</Text></View>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Login