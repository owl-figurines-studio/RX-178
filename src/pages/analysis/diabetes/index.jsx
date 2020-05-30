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

const diabetesResultMap = { "0": "阴性", "1": "阳性" }

@connect(({ analysis, user, observation }) => {
  const { diabetesResult } = analysis
  const { userPhone } = user
  const { observations } = observation
  return { diabetesResult, userPhone, observations }
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
      isObservationFloatOpen: false,
      observationData: [],
      floatTitle: "",
    }
  }

  componentDidMount() { }

  componentWillReceiveProps() { }

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

  submit = () => {
    this.diabetesPredic()
    this.setState({
      formDisabled: true,
    })
  }

  edit = () => {
    const { dispatch } = this.props
    this.setState({
      formDisabled: false,
    })
    dispatch({
      type: "analysis/saveDiabetesResult",
      payload: { diabetesResult: null }
    })
  }
  resultAccordionSwitch = (value = null) => {
    const { diabetesResult } = this.props
    const { resultAccordion } = this.state
    if (typeof (diabetesResult) === 'string') {
      this.setState({
        resultAccordion: value ? value : !resultAccordion
      })
    }
  }

  observationFloatSwitch = (value = null) => {
    const { isObservationFloatOpen } = this.state
    this.setState({
      isObservationFloatOpen: value ? value : !isObservationFloatOpen
    })
  }

  openObservationFloat = code => {
    this.setState({ floatTitle: `${code}历史` })
    this.queryObservationByCode(code)
    this.observationFloatSwitch(true)
  }

  choiceData = (key, value) => {
    this.stateChange(key, value)
    this.observationFloatSwitch(false)
  }

  diabetesPredic = () => {
    const { dispatch, userPhone } = this.props
    const { age, glucose, insulin, weight, height, bloodPressure, } = this.state
    dispatch({
      type: 'analysis/diabetesPredic',
      payload: {
        Age: age,
        Glucose: glucose,
        Insulin: insulin,
        weight,
        height,
        BloodPressure: bloodPressure,
        phone: userPhone,
      }
    })
  }

  queryObservationByCode = code => {
    const { dispatch } = this.props
    dispatch({
      type: "observation/queryObservation",
      payload: {
        arg: {},
        fields: [
          'id',
          'code{text}',
          'encounter{reference}',
          'subject{reference}',
          'valueQuantity{value,unit}'
        ],
      }
    }).then(() => {
      const { observations } = this.props
      const observationData = observations.filter(item => {
        const { code: { text } } = item
        return text && (text === code)
      })
      this.setState({ observationData })
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
      observationData,
      floatTitle,
    } = this.state

    const { diabetesResult } = this.props
    const result = typeof (diabetesResult) === 'string' ? diabetesResultMap[diabetesResult] : null

    const navBarProps = {
      title: '糖尿病预测',
    }

    return (
      <BasicPage navBarProps={navBarProps} tabBarVisible={!isObservationFloatOpen} >

        <AtFloatLayout isOpened={isObservationFloatOpen} title={floatTitle} onClose={() => this.observationFloatSwitch(false)} >
          {
            observationData.length > 0 ? (
              <AtList>
                {
                  observationData.map((item, index) => {
                    const { valueQuantity: { value, unit }, code: { text }, } = item
                    return (
                      <AtListItem
                        key={`${text}${index}`}
                        title={`${value} ${unit}`}
                        note={`${text}`}
                        onClick={() => this.choiceData('bloodPressure', value)}
                      />
                    )
                  })
                }
              </AtList>
            ) : (
                <View className={styles.empty} >
                  <View>无数据</View>
                </View>
              )
          }

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
              <Button onClick={() => this.openObservationFloat("血糖")} >检查数据</Button>
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
              <Button onClick={() => this.openObservationFloat("胰岛素")} >检查数据</Button>
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
              <Button onClick={() => this.openObservationFloat("血压")} >检查数据</Button>
            </AtInput>
          </View>

          <View className='at-row at-row__justify--around'>
            <View className='at-col at-col-5' >
              <Button onClick={this.submit} >提交</Button>
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
                <AtTag circle active>{result}</AtTag>
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