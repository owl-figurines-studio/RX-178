import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import BasicPage from 'src/containers/BasicPage'
import { AtList, AtListItem } from "taro-ui"
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

  navTo = path => {
    const route = router(path)
    Taro.navigateTo({ url: route })
  }

  render() {

    const navBarProps = {
      title: '数据分析',
    }

    return (
      <BasicPage navBarProps={navBarProps} >
        <View >
          <AtList>
            <AtListItem
              title='糖尿病预测'
              note='以血糖、胰岛素、BMI系数、年龄为参数进行糖尿病预测'
              arrow='right'
              iconInfo={{ size: 25, color: '#78A4FA', value: 'calendar', }}
              onClick={() => this.navTo("analysis/diabetes")}
            />
          </AtList>
        </View>
      </BasicPage>
    )
  }
}

export default Analysis