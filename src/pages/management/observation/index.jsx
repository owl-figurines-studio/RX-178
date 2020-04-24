import Taro, { Component } from '@tarojs/taro'
import { View, Navigator } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import BasicPage from 'src/containers/BasicPage'
import { router } from 'src/utils/router'



@connect(({ user }) => {
  const { verifyStateCode } = user
  return { verifyStateCode }
})
class Observation extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillReceiveProps() {}

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }



  render() {

    const navBarProps = {
      title: '元数据',
    }

    return (
      <BasicPage navBarProps={navBarProps} >
        <View >
          <Navigator url={router('user')} >观察</Navigator>
        </View>
      </BasicPage>
    )
  }
}

export default Observation