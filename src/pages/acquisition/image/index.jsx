import Taro, { Component } from '@tarojs/taro'
import { CoverView, View, Button, Camera, Image } from '@tarojs/components'
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

  componentWillUnmount() {}

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
        // this.setState({
        //   photo: res.tempImagePath
        // })
        Taro.navigateTo({url:router('acquisition/image/preview')})
        // Taro.uploadFile({
        //   url: "http://127.0.0.1:5000/upload/",
        //   filePath: res.tempImagePath,
        //   name: "img",
        //   success: () => console.log("upload success"),
        // })
      },
    })
    console.log(this.cameraContext)
  }

  render() {

    const navBarProps = {
      title: '图像信息获取',
    }

    return (
      <BasicPage navBarProps={navBarProps} tabBarVisible={false} >
        <View >
          <Camera className={styles.camera} devicePosition='back' />
          <CoverView className={styles.cameraBtnArea}>
            <CoverView className={styles.shutter} > 
              <Button className={styles.shutterButton} onClick={this.takePhoto} />
            </CoverView>
          </CoverView>
        </View>
        {/* <View><Text>预览</Text></View> */}
        <Image src={this.state.photo} />
      </BasicPage>
    )
  }
}

export default ImageInfo