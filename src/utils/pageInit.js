import Taro from '@tarojs/taro'
import auth from './auth'

function pageInit() {
  return function WrappedComponent(Component) {
    return class extends Component {

      constructor(props) {
        super(props);
      }

      //onLoad
      componentWillMount() {
        //初始分享信息
        initShareMenu(this.state);
      }

      //阻塞 didMount ， 鉴权
      async componentDidMount() {
        Taro.login({
          success: result => {
            console.log(result)
            Taro.atMessage({
              'message': '登录成功',
              'type': 'success',
            })
          },
          fail: () => {
            Taro.atMessage({
              'message': '登录失败',
              'type': 'error',
            })
          },

        })
        let result = await auth.appCheckAuth();
        //授权成功
        if (result) {
          //调用父组件的函数
          super.componentDidMount && super.componentDidMount();
        } else {
          //授权失败
          Taro.showToast({
            title: '授权失败',
            icon: 'none',
            mask: true
          })
        }
      }

      //重写分享
      onShareAppMessage() {
        let shareOptions = super.onShareAppMessage();
        //如果当前页面配置分享使用配置的
        if (shareOptions) return shareOptions;
        //默认分享
        return {
          title: '默认分享内容'
        }
      }

      //重新下拉刷新
      onPullDownRefresh() {
        if (super.onPullDownRefresh) {
          super.onPullDownRefresh();
          setTimeout(() => {
            Taro.stopPullDownRefresh();
          }, 1500)
        }
      }
    }
  };
}

/**
 * 初始化分享信息
 */
function initShareMenu(state) {
  // 初始化页面分享信息
  if (state && state.canShare) {
    Taro.showShareMenu({
      withShareTicket: false
    })
  } else {
    Taro.hideShareMenu();
  }
}

export default pageInit;