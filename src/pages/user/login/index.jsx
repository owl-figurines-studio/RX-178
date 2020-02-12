import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtInput, AtForm, AtButton } from 'taro-ui'
import BasicPage from 'src/containers/BasicPage'

@connect(({ user }) => {
  const { verifyStateCode } = user
  return { verifyStateCode }
})
class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userPhoneNum: null,
    }
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

  sendVerift = () => {
    const { userPhoneNum } = this.state
    this.props.dispatch({
      type: 'user/sendVerift',
      payload: {
        userphone: userPhoneNum
      }
    })
  }

  phoneNumberOnChange = value => {
    this.setState(
      {
        userPhoneNum: value,
      }
    )
  }

  render() {
    const { verifyStateCode } = this.props
    const { userPhoneNum } = this.state
    return (
      <BasicPage>
        <View className='login'>
          <AtForm
            onSubmit={this.sendVerift}
          >
            <AtInput
              name='userPhoneNum'
              title='电话'
              type='number'
              placeholder='请输入电话号码'
              value={userPhoneNum}
              onChange={value => this.phoneNumberOnChange(value)}
            />
            <AtButton className='sendVerift' formType='submit'>发送验证</AtButton>
          </AtForm>
          <Navigator url='/pages/index/index' >注册页面</Navigator>
          <View><Text>{verifyStateCode}</Text></View>
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