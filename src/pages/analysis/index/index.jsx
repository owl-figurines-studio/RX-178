import Taro, { Component } from '@tarojs/taro'
import { View, Navigator } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import BasicPage from 'src/containers/BasicPage'
import { router } from 'src/utils/router'

@connect(({ user }) => {
  const { verifyStateCode } = user
  return { verifyStateCode }
})
class Analysis extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }



  render() {

    const navBarProps = {
      title: '数据分析',
    }

    return (
      <BasicPage navBarProps={navBarProps} >
        <View >
          <Navigator url={router('index')} >用户模块</Navigator>
        </View>
      </BasicPage>
    )
  }
}

export default Analysis