import Taro, { Component } from '@tarojs/taro'
import { View, Navigator, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import BasicPage from 'src/containers/BasicPage'
import { router } from 'src/utils/router'

@connect(({ acquisition }) => {
  const { isNeedOCR, uploadID } = acquisition
  return { isNeedOCR, uploadID }
})
class Acquisition extends Component {
  constructor(props) {
    super(props);
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

  render() {

    const navBarProps = {
      title: '数据获取',
    }

    return (
      <BasicPage navBarProps={navBarProps} >
        <View >
          <Navigator url={router('acquisition/image')} >图像</Navigator>
          <Button onClick={this.ocr} >OCR</Button>
        </View>
      </BasicPage>
    )
  }
}

export default Acquisition