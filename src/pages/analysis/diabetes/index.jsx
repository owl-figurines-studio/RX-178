import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import {
  AtInput,
  AtAccordion,
  AtTag,
  AtList,
  AtFloatLayout,
  AtListItem
} from 'taro-ui'
import { connect } from '@tarojs/redux'
import classNames from 'classnames'
import BasicPage from 'src/containers/BasicPage'
import { router } from 'src/utils/router'
import styles from './index.module.less'



@connect(({ analysis }) => {
  const { diabetesResult } = analysis
  return { diabetesResult }
})
class diabetes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formDisabled: false,
      age: null,
      glucose: null,
      insulin: null,
      weight: null,
      height: null,
      bloodPressure: null,
      resultAccordion: false,
      isObservationFloatOpen: false
    }
  }

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  stateChange = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  clearAll = () => {
    this.setState({
      formDisabled: false,
      age: null,
      glucose: null,
      insulin: null,
      weight: null,
      height: null,
      bloodPressure: null,
    })
  }

  forecast = () => {
    this.diabetesPredic()
    this.setState({
      formDisabled: true,
    })
  }

  edit = () => {
    this.setState({
      formDisabled: false,
    })
  }
  resultAccordionSwitch = (value = null) => {
    const { resultAccordion } = this.state
    this.setState({
      resultAccordion: value ? value : !resultAccordion
    })
  }

  observationFloatSwitch = (value = null) => {
    const { isObservationFloatOpen } = this.state
    this.setState({
      isObservationFloatOpen: value ? value : !isObservationFloatOpen
    })
  }

  openObservationFloat = () => {
    this.observationFloatSwitch(true)
  }

  choiceData = (key, value) => {
    this.stateChange(key, value)
    this.observationFloatSwitch(false)
  }

  diabetesPredic = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'analysis/diabetesPredic',
      payload: {
        Age: 32,
        Glucose: 1830,
        Insulin: 0,
        weight: 75.5,
        height: 180,
        BloodPressure: 64,
        phone:'18258232093',
      }
    })
  }


  render() {

    const {
      formDisabled,
      age,
      glucose,
      insulin,
      weight,
      height,
      bloodPressure,
      resultAccordion,
      isObservationFloatOpen,
    } = this.state

    const { result = '阳性' } = this.props
    const { observationData = [{ value: 140, code: '体检', date: '2000-01-01' }, { value: 132, code: '年检', date: '2001-02-01' }] } = this.props

    const navBarProps = {
      title: '糖尿病预测',
    }

    return (
      <BasicPage navBarProps={navBarProps} tabBarVisible={!isObservationFloatOpen} >

        <AtFloatLayout isOpened={isObservationFloatOpen} title='血压历史数据' onClose={() => this.observationFloatSwitch(false)} >
          <AtList>
            {
              observationData.map((item, index) => {
                const { value, code, date } = item
                return (
                  <AtListItem
                    key={`${date}${index}`}
                    title={`${value} mmHg`}
                    note={`${date} ${code}`}
                    onClick={() => this.choiceData('bloodPressure', value)}
                  />
                )
              })
            }
          </AtList>
        </AtFloatLayout>

        <View>
          <View>
            <AtInput
              disabled={formDisabled}
              title='年龄'
              type='number'
              value={age}
              clear
              onChange={value => { this.stateChange('age', value) }}
            />
            <AtInput
              disabled={formDisabled}
              title='血糖'
              type='number'
              placeholder='mmol/L'
              value={glucose}
              clear
              onChange={value => { this.stateChange('glucose', value) }}
            >
              <Button onClick={this.openObservationFloat} >检查数据</Button>
            </AtInput>
            <AtInput
              disabled={formDisabled}
              title='空腹胰岛素'
              type='number'
              placeholder='uU/ml'
              value={insulin}
              clear
              onChange={value => { this.stateChange('insulin', value) }}
            >
              <Button onClick={this.openObservationFloat} >检查数据</Button>
            </AtInput>
            <AtInput
              disabled={formDisabled}
              title='体重'
              type='number'
              placeholder='kg'
              value={weight}
              clear
              onChange={value => { this.stateChange('weight', value) }}
            />

            <AtInput
              disabled={formDisabled}
              title='身高'
              type='number'
              placeholder='m'
              value={height}
              clear
              onChange={value => { this.stateChange('height', value) }}
            />
            <AtInput
              disabled={formDisabled}
              title='舒张压'
              type='number'
              placeholder='mmHg'
              value={bloodPressure}
              clear
              onChange={value => { this.stateChange('bloodPressure', value) }}
            >
              <Button onClick={this.openObservationFloat} >检查数据</Button>
            </AtInput>
          </View>

          <View className='at-row at-row__justify--around'>
            <View className='at-col at-col-5' >
              <Button onClick={this.forecast} >提交</Button>
            </View>
            <View className='at-col at-col-5' >
              {
                formDisabled ? (
                  <Button onClick={this.edit} >编辑</Button>
                ) : (
                    <Button onClick={this.clearAll} >清空</Button>
                  )
              }
            </View>
          </View>
        </View>
        {result ?
          (<AtAccordion
            open={resultAccordion}
            onClick={this.resultAccordionSwitch}
            title='糖尿病预测结果'
          >
            <View className={classNames('at-row', 'at-row__justify--center', styles.result)} >
              <View className={classNames('at-col', 'at-col-3', styles.resultTitle)} >预测结果：</View>
              <View className='at-col at-col-3' >
                <AtTag circle active>阳性</AtTag>
              </View>
            </View>
          </AtAccordion>)
          : null}
      </BasicPage >
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default diabetes