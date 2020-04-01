import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import BasicPage from 'src/containers/BasicPage'
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

  sendImage = () => {
    const { dispatch, imagePath } = this.props
    Taro.getFileSystemManager().readFile({
      filePath: imagePath,
      encoding: 'base64',
      success: res => {
        const { data } = res 
        dispatch({
          type: "acquisition/sendImage",
          payload: {
            imageBase64: data,
          },
        })
      },
    })
  }

  render() {

    const navBarProps = {
      title: '预览',
    }
    const { imagePath } = this.props
    return (
      <BasicPage navBarProps={navBarProps} tabBarVisible={false} >
        <View >
          <Image className={styles.imagePreview} src={imagePath} />
          <Button onClick={this.sendImage} >提交</Button>
        </View>
      </BasicPage>
    )
  }
}

export default ImagePreview