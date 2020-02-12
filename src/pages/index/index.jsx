import Taro, { Component } from '@tarojs/taro'
import { View, Navigator } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import BasicPage from 'src/containers/BasicPage'



@connect(({ user }) => {
  const { verifyStateCode } = user
  return { verifyStateCode }
})
class Login extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  config = {
    navigationBarTitleText: '登录'
  };

  componentDidShow() { }

  componentDidHide() { }

  

  render() {
    return (
      <BasicPage>
        <View>
          <Navigator url='/pages/user/login/index' >注册页面</Navigator>
        </View>
      </BasicPage>
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