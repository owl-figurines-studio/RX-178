import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTag, AtModal } from 'taro-ui'
import { connect } from '@tarojs/redux'
import classNames from 'classnames'
import BasicPage from 'src/containers/BasicPage'
import EditField from 'src/components/editField'
import EditDate from 'src/components/editDate'
import EditSelector from 'src/components/editSelector'
import { changedFieldKeys } from 'src/utils/common'
import styles from './index.module.less'

const genderMap = [{ cn: '男', en: 'male' }, { cn: '女', en: 'female' }, { cn: '未知', en: 'unknown' }]

@connect(({ user }) => {
  const { patientInfo, userPhone } = user
  return { patientInfo, userPhone }
})
class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      name: "",
      birthDate: "2000-01-01",
      gender: 'male',
      telecom: "",
      isOpenUpdateModal: false,
      changedFields: []
    }
  }

  componentDidMount() {
    const { patientInfo } = this.props
    const { name, gender, birthDate, telecom } = patientInfo
    this.setState({ name, gender, birthDate, telecom })
  }

  componentWillReceiveProps() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onNameChange = value => {
    this.setState({
      name: value
    })
  }

  onGenderChange = event => {
    this.setState({
      gender: genderMap[event.target.value].en
    })
  }

  onBirthDateChange = event => {
    this.setState({
      birthDate: event.target.value
    })
  }

  onTelecomChange = value => {
    this.setState({
      telecom: value
    })
  }

  onEdit = () => {
    const { patientInfo } = this.props
    const { isEdit, name, birthDate, gender, telecom } = this.state

    if (isEdit) {
      const changedFields = changedFieldKeys(
        {
          ...patientInfo
        },
        {
          name,
          birthDate,
          gender,
          telecom,
        }
      )
      this.setState({ changedFields })
      if (changedFields.length > 0) {
        this.openUpdateModal()
      }
    }
    this.setState({
      isEdit: !isEdit
    })
  }

  openUpdateModal = () => {
    this.setState({
      isOpenUpdateModal: true
    })
  }

  closeUpdateModal = () => {
    this.setState({
      isOpenUpdateModal: false
    })
  }

  update = () => {
    this.closeUpdateModal()
    this.updatePatient()
  }

  updatePatient = () => {
    const { dispatch, patientInfo: { id } } = this.props
    const { name, gender, birthDate, telecom } = this.state
    const nameArray = [name]
    dispatch({
      type: 'user/updatePatient',
      payload: {
        arg: { id, name: nameArray, gender, birthDate, telecom, },
        fields: ['id', 'name', 'gender', 'birthDate', 'telecom'],
      },
    })
  }

  queryPatient = arg => {
    const { dispatch } = this.props
    const { changedFields } = this.state
    if (changedFields.length > 0) {
      dispatch({
        type: 'user/queryPatient',
        payload: {
          arg,
          fields: ['id', 'name', 'gender', 'birthDate', 'telecom'],
        },
      })
    }

  }

  render() {

    const { name, gender, birthDate, isEdit, telecom, isOpenUpdateModal } = this.state
    const navBarProps = {
      title: '基本信息',
    }
    const genderRange = genderMap.map(item => item.cn)

    return (
      <BasicPage navBarProps={navBarProps} >

        <AtModal
          isOpened={isOpenUpdateModal}
          title='确认更改'
          cancelText='取消'
          confirmText='确认'
          onClose={this.closeUpdateModal}
          onCancel={this.closeUpdateModal}
          onConfirm={this.update}
          content='是否保存修改'
        />

        <View className={styles.header} >
          <View className={classNames('at-row')} >
            <View className={classNames('at-col', 'at-col-3', 'at-col__offset-9')} >
              <AtTag
                size='normal'
                circle
                onClick={this.onEdit}
                active
              >
                {isEdit ? ('完成') : ('编辑')}
              </AtTag>
            </View>
          </View>
        </View>
        <View className={styles.content}>
          <View className='at-row'>
            <View className={classNames('at-col', 'at-col-3', styles.title)} >姓名：</View>
            <View className={classNames('at-col', 'at-col-8', styles.editItem)} >
              <EditField isEdit={isEdit} value={name} onChange={this.onNameChange} />
            </View>
          </View>
          <View className='at-row'>
            <View className={classNames('at-col', 'at-col-3', styles.title)} >出生日期：</View>
            <View className={classNames('at-col', 'at-col-8', styles.editItem)} >
              <EditDate isEdit={isEdit} value={birthDate} onChange={this.onBirthDateChange} />
            </View>
          </View>
          <View className='at-row'>
            <View className={classNames('at-col', 'at-col-3', styles.title)} >性别：</View>
            <View className={classNames('at-col', 'at-col-8', styles.editItem)} >
              <EditSelector isEdit={isEdit} value={genderMap.findIndex(item => item.en === gender)} range={genderRange} onChange={this.onGenderChange} />
            </View>
          </View>
          <View className='at-row'>
            <View className={classNames('at-col', 'at-col-3', styles.title)} >联系方式：</View>
            <View className={classNames('at-col', 'at-col-8', styles.editItem)} >
              <EditField isEdit={isEdit} value={telecom} onChange={this.onTelecomChange} />
            </View>
          </View>

        </View>
      </BasicPage>
    )
  }
}

export default Patient