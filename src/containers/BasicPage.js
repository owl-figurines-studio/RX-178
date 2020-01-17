import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import RequestMessage from 'src/components/RequestMessage'
import pageInit from 'src/utils/pageInit'

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