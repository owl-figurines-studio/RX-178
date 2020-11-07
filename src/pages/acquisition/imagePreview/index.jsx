import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import BasicPage from 'src/containers/BasicPage'
import { router } from 'src/utils/router'
import styles from './index.module.less'



@connect(({ acquisition }) => {
  const { imagePath } = acquisition
  return { imagePath }
})
class ImagePreview extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  uploadImage = () => {
    const { dispatch, imagePath } = this.props
    dispatch({
      type: 'acquisition/uploadImage',
      payload: {
        imagePath,
      },
    }).then(() => Taro.redirectTo({ url: router('acquisition') }))
  }

  backToCamera = () => {
    Taro.redirectTo({ url: router('acquisition/image/camera') })
  }

  confirm = () => {
    this.uploadImage()
  }

  render() {

    const navBarProps = {
      title: '预览',
    }
    const { imagePath } = this.props
    return (
      <BasicPage navBarProps={navBarProps} tabBarVisible={false} >
        <View >
          <Image className={styles.imagePreview} src={imagePath} mode='aspectFit' />
          <View className={styles.buttonArea} >
            <Button className={styles.confirmButton} onClick={this.confirm} >确认</Button>
            <Button className={styles.regainButton} onClick={this.backToCamera} >重新获取</Button>
          </View>
        </View>
      </BasicPage>
    )
  }
}

export default ImagePreview