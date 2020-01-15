import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import RequestMessage from '../components/RequestMessage'
import pageInit from '../utils/pageInit'

@pageInit()
class BasicPage extends Component {

  render() {
    const { children } = this.props
    return (
      <View>
        <RequestMessage />
        {children}
      </View>
    )
  }
}

export default BasicPage