import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtTag, AtModal, AtAccordion, AtIcon, AtList, AtListItem } from 'taro-ui'
import { connect } from '@tarojs/redux'
import classNames from 'classnames'
import BasicPage from 'src/containers/BasicPage'
import EditField from 'src/components/editField'
import EditDate from 'src/components/editDate'
// import { router } from 'src/utils/router'
import styles from './index.module.less'


@connect(({ user }) => {
  const { verifyStateCode } = user
  return { verifyStateCode }
})
class Origin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      isEdit: false,
      isOpenUpdateModal: false,
      observationDate: "",
      inspectName: "",
      isEncounterOpen: false,
      isObservationOpen: false,
      dataList: [
        {
          key: '血细胞',
          value: '12',
        },
      ],
    }
  }

  componentDidMount() { }

  componentWillReceiveProps() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

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

  onInspectNameChange = value => {
    this.setState({
      inspectName: value
    })
  }

  onObservationDateChange = event => {
    this.setState({
      observationDate: event.target.value
    })
  }

  encounterSwitch = value => {
    this.setState({
      isEncounterOpen: value
    })
  }

  observationSwitch = value => {
    this.setState({
      isObservationOpen: value
    })
  }

  addData = () => {
    const { dataList } = this.state
    const newList = [...dataList, { key: '', value: '' }]
    this.setState({ dataList: newList })
  }

  subtractData = key => {
    const { dataList } = this.state
    const newList = dataList.filter((item, index) => index !== key)
    this.setState({ dataList: newList })
  }

  initData = () => {
    this.setState({ dataList: [{ key: '', value: '' }] })
  }

  dataChange = (indexKey, itemKey, value) => {
    const { dataList } = this.state
    let newItem = { ...dataList[indexKey] }
    newItem[itemKey] = value
    dataList.splice(indexKey, 1, newItem)
    this.setState({ dataList })
  }

  currentSwitch = value => {
    this.setState({
      current: value
    })
  }

  render() {
    const {
      current,
      isEdit,
      isOpenUpdateModal,
      observationDate,
      inspectName,
      isEncounterOpen,
      isObservationOpen,
      dataList,
    } = this.state
    const navBarProps = {
      title: '元数据',
    }

    const encounter = [ { code:'血常规', date:'2000-01-01' } ]

    return (
      <BasicPage navBarProps={navBarProps} >

        {/* <AtSegmentedControl
          values={['概览', '详情']}
          onClick={this.currentSwitch}
          current={this.state.current}
        /> */}
        {
          current === 0 ? (
            encounter.map(item => {
              const { code, date } = item
              return (
                <AtList key={`${code}${date}`} >
                  <AtListItem
                    title={code}
                    note={date}
                    extraText='详细信息'
                    arrow='right'
                    onClick={() => this.currentSwitch(1)}
                  />
                </AtList>
              )
            }
            )

          ) : (
              <View>
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
                    <View className={classNames('at-col', 'at-col-1')} onClick={() => this.currentSwitch(0)} >
                      <AtIcon value='chevron-left' color='#7093EA' />
                    </View>
                    <View className={classNames('at-col', 'at-col-1', styles.return)} onClick={() => this.currentSwitch(0)} >
                      返回
                    </View>
                    <View className={classNames('at-col', 'at-col-3', 'at-col__offset-7')} >
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
                  <AtAccordion
                    open={isEncounterOpen}
                    onClick={this.encounterSwitch}
                    title='基本信息'
                  >
                    <View className='at-row'>
                      <View className={classNames('at-col', 'at-col-3', styles.title)} >检查名称：</View>
                      <View className={classNames('at-col', 'at-col-8', styles.editItem)} >
                        <EditField isEdit={isEdit} value={inspectName} onChange={this.onInspectNameChange} />
                      </View>
                    </View>
                    <View className='at-row'>
                      <View className={classNames('at-col', 'at-col-3', styles.title)} >检查时间：</View>
                      <View className={classNames('at-col', 'at-col-8', styles.editItem)} >
                        <EditDate isEdit={isEdit} value={observationDate} onChange={this.onObservationDateChange} />
                      </View>
                    </View>
                  </AtAccordion>
                  <AtAccordion
                    open={isObservationOpen}
                    onClick={this.observationSwitch}
                    title='数据'
                  >
                    <View>
                      <View className='at-row'>
                        <View className='at-col at-col-5'  ><View style={{ 'marginLeft': '32rpx' }}>项目名称</View></View>
                        <View className='at-col at-col-5'  ><View style={{ 'marginLeft': '32rpx' }}>检查结果</View></View>
                        <View className='at-col at-col-2'>删除</View>
                      </View>
                      {
                        dataList.map(
                          (item, index) => {
                            return (
                              <View className='at-row' key={`${item}_${index}`}>
                                <View className='at-col at-col-5'>
                                  {/* <AtInput value={item.key} onChange={value => this.dataChange(index, 'key', value)} /> */}
                                  <EditField isEdit={isEdit} value={item.key} onChange={value => this.dataChange(index, 'key', value)} />
                                </View>
                                <View className='at-col at-col-5'>
                                  <EditField isEdit={isEdit} value={item.value} onChange={value => this.dataChange(index, 'value', value)} />
                                </View>
                                {
                                  dataList.length > 1 ? (
                                    <View className='at-col at-col-2'>
                                      <AtIcon onClick={() => this.subtractData(index)} value='subtract-circle' color='red' />
                                    </View>
                                  ) : null
                                }
                              </View>
                            )
                          }
                        )
                      }
                      {
                        isEdit ? (
                          <View className='at-row'>
                            <View className='at-col'>
                              <Button onClick={this.addData} ><AtIcon value='add' />新增</Button>
                            </View>
                            <View className='at-col'>
                              <Button onClick={this.initData} ><AtIcon value='close' />清空</Button>
                            </View>
                          </View>
                        ) : null
                      }

                    </View>
                  </AtAccordion>
                </View>
              </View>
            )
        }


      </BasicPage>
    )
  }
}

export default Origin