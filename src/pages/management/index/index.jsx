import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import BasicPage from 'src/containers/BasicPage'
import { AtList, AtListItem } from "taro-ui"
import { router } from 'src/utils/router'

@connect(({ user }) => {
  const { verifyStateCode } = user
  return { verifyStateCode }
})
class Management extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  navTo = path => {
    const route = router(path)
    Taro.navigateTo({ url: route })
  }

  render() {

    const navBarProps = {
      title: '管理',
    }

    return (
      <BasicPage navBarProps={navBarProps} >
        <View >
          <AtList>
            <AtListItem
              title='人口统计数据'
              note='个人属性、联系信息、紧急联系人、近亲等'
              arrow='right'
              iconInfo={{ size: 25, color: '#78A4FA', value: 'calendar', }}
              onClick={() => this.navTo("management/patient")}
            />
            <AtListItem
              title='原始数据'
              note='来自患者的直接数据输入'
              arrow='right'
              iconInfo={{ size: 25, color: 'green', value: 'money', }}
              onClick={() => this.navTo("management/origin")}
            />
            <AtListItem
              title='个人观察和护理信息'
              arrow='right'
              iconInfo={{ size: 25, color: '#FF4949', value: 'bookmark', }}
              onClick={() => this.navTo("management/observation")}
            />
          </AtList>
        </View>
      </BasicPage>
    )
  }
}

export default Management