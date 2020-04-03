import Taro, { Component } from '@tarojs/taro'
import { View, Camera, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import BasicPage from 'src/containers/BasicPage'
import { router } from 'src/utils/router';
import { connect } from '@tarojs/redux'
import styles from './index.module.less'

@connect(({ acquisition }) => {
  const { imagePath } = acquisition
  return { imagePath }
})
class ImageInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      photo: null,
    }
  }

  componentWillMount() {
    this.cameraContext = Taro.createCameraContext()
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  saveImagePath = path => {
    const { dispatch } = this.props
    dispatch({
      type: 'acquisition/saveImagePath',
      payload: {
        imagePath: path
      }
    })
  }

  takePhoto = () => {
    this.cameraContext.takePhoto({
      quality: 'high',
      success: res => {
        this.saveImagePath(res.tempImagePath)
        Taro.redirectTo({ url: router('acquisition/image/preview') })
      },
    })
    console.log(this.cameraContext)
  }

  localImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success: res => {
        this.saveImagePath(res.tempFilePaths[0])
        Taro.redirectTo({ url: router('acquisition/image/preview') })
      }
    })
  }

  render() {

    const navBarProps = {
      title: '图像信息获取',
    }

    return (
      <BasicPage navBarProps={navBarProps} tabBarVisible={false} >
        <View className={styles.backGround} >
          <Camera className={styles.camera} devicePosition='back' flash='auto' />
          <View className={styles.cameraBtnArea}>
            <View className={styles.localImage} onClick={this.localImage} >
              <AtIcon className={styles.imageIcon} value='image' />
            </View>
            <View className={styles.shutter} >
              <View className={styles.shutterButton} onClick={this.takePhoto} />
            </View>
          </View>
        </View>
        <Image src={this.state.photo} />
      </BasicPage>
    )
  }
}

export default ImageInfo