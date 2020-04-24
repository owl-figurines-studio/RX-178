import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTag, AtModal } from 'taro-ui'
import { connect } from '@tarojs/redux'
import classNames from 'classnames'
import BasicPage from 'src/containers/BasicPage'
import EditField from 'src/components/editField'
import EditDate from 'src/components/editDate'
import EditSelector from 'src/components/editSelector'
// import { router } from 'src/utils/router'
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
      gender: 0,
      isOpenUpdateModal: false,
    }
  }

  componentDidMount() {
    const { dispatch, userPhone } = this.props
    dispatch({
      type: 'user/queryPatient',
      payload: {
        arg: { telecom: userPhone },
        fields: ['name', 'gender', 'birthDate',],
      },
    })
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
      gender: event.target.value
    })
  }

  onBirthDateChange = event => {
    this.setState({
      birthDate: event.target.value
    })
  }

  onEdit = () => {
    const { isEdit } = this.state
    if (isEdit) {
      this.openUpdateModal()
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
    console.log("update")
  }

  render() {
    const { name, gender, birthDate, isEdit, isOpenUpdateModal } = this.state
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
          <View className={classNames('at-row', styles.buttonArea)} >
            <View className={classNames('at-col', 'at-col-3', 'at-col__offset-9')} >
              <AtTag
                size='normal'
                circle
                onClick={this.onEdit}
                active={isEdit}
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
              <EditSelector isEdit={isEdit} value={gender} range={genderRange} onChange={this.onGenderChange} />
            </View>
          </View>
        </View>
      </BasicPage>
    )
  }
}

export default Patient