import React, { memo, useState, useMemo, useReducer } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { ORDER_DEPART } from './constant.js'
import './Bottom.css'
import Slider from './Slider.jsx'

function checkedReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'toggle':
      const newState = {...state}
      if (payload in newState) {
        delete newState[payload]
      } else {
        newState[payload] = true
      }
      return newState
    case 'reset':
      return {}
    default:
  }
  return state
}

const OptionsItem = memo((props) => {
  const { name, checked, value, dispatch } = props
  return (
    <li 
    className={classnames({checked})}
    onClick={() => dispatch({type: 'toggle', payload: value})}
    >
      { name }
    </li>
  )
})
OptionsItem.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
}
const OptionsWrap = memo((props) => {
  const { title, options, checkedMap, dispatch } = props
  
  return (
    <div className="option">
      <h3>{ title }</h3>
      <ul>
        {
          options.map(option => {
            return (
              <OptionsItem 
                {...option} 
                checked={option.value in checkedMap}
                key={option.value}
                dispatch={dispatch}
              />
            )
          })
        }
      </ul>
    </div>
  )
})
OptionsWrap.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  checkedMap: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}

const BottomModal = memo((props) => {
  const {
    ticketTypes,
    checkedTicketTypes,
    trainTypes,
    checkedTrainTypes,
    departStations,
    checkedDepartStations,
    arriveStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    setCheckedTicketTypes,
    setCheckedTrainTypes,
    setCheckedDepartStations,
    setCheckedArriveStations,
    setDepartTimeStart,
    setDepartTimeEnd,
    setArriveTimeStart,
    setArriveTimeEnd,
    toggleIsFiltersVisible
  } = props
  // 将store中的数据转换到组件本地缓存

  const [localCheckedTicketTypes, localCheckedTicketTypesDispatch] = useReducer(
    checkedReducer, 
    checkedTicketTypes, 
    (checkedTicketTypes) => {
      return {...checkedTicketTypes}
  })

  const [localCheckedTrainTypes, localCheckedTrainTypesDispatch] = useReducer(
    checkedReducer,
    checkedTrainTypes,
    (checkedTrainTypes) => {
      return {...checkedTrainTypes}
  })

  const [localCheckedDepartStations, localCheckedDepartStationsDispatch] = useReducer(
    checkedReducer,
    checkedDepartStations,
    (checkedDepartStations) => {
      return {...departStations}
  })

  const [localCheckedArriveStations, localCheckedArriveStationsDispatch] = useReducer(
    checkedReducer,
    checkedArriveStations,
    (checkedArriveStations) => {
      return {...arriveStations}
  })
  const [localDepartTimeStart, setlocalDepartTimeStart] = useState(() => {
    return departTimeStart
  })
  const [localDepartTimeEnd, setlocalDepartTimeEnd] = useState(() => {
    return departTimeEnd
  })
  const [localArriveTimeStart, setlocalArriveTimeStart] = useState(() => {
    return arriveTimeStart
  })
  const [localArriveTimeEnd, setlocalArriveTimeEnd] = useState(() => {
    return arriveTimeEnd
  })
  const optionGroup = [
    {
      title: '坐席类型',
      options: ticketTypes,
      checkedMap: localCheckedTicketTypes,
      dispatch: localCheckedTicketTypesDispatch
    },
    {
      title: '车次类型',
      options: trainTypes,
      checkedMap: localCheckedTrainTypes,
      dispatch: localCheckedTrainTypesDispatch
    },
    {
      title: '出发车站',
      options: departStations,
      checkedMap: localCheckedDepartStations,
      dispatch: localCheckedDepartStationsDispatch
    },
    {
      title: '到达车站',
      options: arriveStations,
      checkedMap: localCheckedArriveStations,
      dispatch: localCheckedArriveStationsDispatch
    }
  ]
  // 提交本地数据
  const sure = () => {
    setCheckedTicketTypes(localCheckedTicketTypes)
    setCheckedTrainTypes(localCheckedTrainTypes)
    setCheckedDepartStations(localCheckedDepartStations)
    setCheckedArriveStations(localCheckedArriveStations)
    setDepartTimeStart(localDepartTimeStart)
    setDepartTimeEnd(localDepartTimeEnd)
    setArriveTimeStart(localArriveTimeStart)
    setArriveTimeEnd(localArriveTimeEnd)
    // 关闭浮层
    toggleIsFiltersVisible() 
  }

  const isRestDisabled = useMemo(() => {
    return Object.keys(localCheckedTicketTypes).length === 0
      && Object.keys(localCheckedTrainTypes).length === 0
      && Object.keys(localCheckedDepartStations).length === 0
      && Object.keys(localCheckedArriveStations).length === 0
      && localDepartTimeStart === 0
      && localDepartTimeEnd === 24
      && localArriveTimeStart === 0
      && localArriveTimeEnd === 24
  }, [
    localCheckedTicketTypes,
    localCheckedTrainTypes,
    localCheckedDepartStations,
    localCheckedArriveStations,
    localDepartTimeStart,
    localDepartTimeEnd,
    localArriveTimeStart,
    localArriveTimeEnd
  ])
    
  const reset = () => {
    if (isRestDisabled) return
    localCheckedTicketTypesDispatch({type: 'reset'})
    localCheckedTrainTypesDispatch({type: 'reset'})
    localCheckedDepartStationsDispatch({type: 'reset'})
    localCheckedArriveStationsDispatch({type: 'reset'})
    setlocalDepartTimeStart(0)
    setlocalDepartTimeEnd(24)
    setlocalArriveTimeStart(0)
    setlocalArriveTimeEnd(24)
  }

  return (
    <div className="bottom-modal">
      <div className="bottom-dialog">
        <div className="bottom-dialog-content">
          <div className="title">
            <span 
              className={classnames('reset', {disabled: isRestDisabled})}
              onClick={reset}
            >
              重置
            </span>
            <span className="ok" onClick={sure}>确定</span>
          </div>
          <div className="options">
            {
              optionGroup.map(group => {
                return (
                  <OptionsWrap 
                    {...group}
                    key={group.title}
                  />
                )
              })
            }
            <Slider 
              title="出发时间"
              currentStartHours={localDepartTimeStart}
              currentEndHours={localDepartTimeEnd}
              onStartChanged={setlocalDepartTimeStart}
              onEndChanged={setlocalDepartTimeEnd}
            />
            <Slider 
              title="到达时间"
              currentStartHours={localArriveTimeStart}
              currentEndHours={localArriveTimeEnd}
              onStartChanged={setlocalArriveTimeStart}
              onEndChanged={setlocalArriveTimeEnd}
            />
          </div>
        </div>
      </div>
    </div>
  )
})
BottomModal.propTypes = {
  ticketTypes: PropTypes.array.isRequired,
  checkedTicketTypes: PropTypes.object.isRequired,
  trainTypes: PropTypes.array.isRequired,
  checkedTrainTypes: PropTypes.object.isRequired,
  departStations: PropTypes.array.isRequired,
  checkedDepartStations: PropTypes.object.isRequired,
  arriveStations: PropTypes.array.isRequired,
  checkedArriveStations: PropTypes.object.isRequired,
  departTimeStart: PropTypes.number.isRequired,
  departTimeEnd: PropTypes.number.isRequired,
  arriveTimeStart: PropTypes.number.isRequired,
  arriveTimeEnd: PropTypes.number.isRequired,
  setCheckedTicketTypes: PropTypes.func.isRequired,
  setCheckedTrainTypes: PropTypes.func.isRequired,
  setCheckedDepartStations: PropTypes.func.isRequired,
  setCheckedArriveStations: PropTypes.func.isRequired,
  setDepartTimeStart: PropTypes.func.isRequired,
  setDepartTimeEnd: PropTypes.func.isRequired,
  setArriveTimeStart: PropTypes.func.isRequired,
  setArriveTimeEnd: PropTypes.func.isRequired,
  toggleIsFiltersVisible: PropTypes.func.isRequired,
}

function Bottom(props) {
  const {
    toggleHighSpeed,
    toggleOrderType,
    toggleOnlyTickets,
    toggleIsFiltersVisible,
    highSpeed,
    orderType,
    onlyTickets,
    isFiltersVisible,
    ticketTypes,
    checkedTicketTypes,
    trainTypes,
    checkedTrainTypes,
    departStations,
    checkedDepartStations,
    arriveStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    setCheckedTicketTypes,
    setCheckedTrainTypes,
    setCheckedDepartStations,
    setCheckedArriveStations,
    setDepartTimeStart,
    setDepartTimeEnd,
    setArriveTimeStart,
    setArriveTimeEnd
  } = props

  const noChecked = useMemo(() => {
    return Object.keys(checkedTicketTypes).length === 0
      && Object.keys(checkedTrainTypes).length === 0
      && Object.keys(checkedDepartStations).length === 0
      && Object.keys(checkedArriveStations).length === 0
      && departTimeStart === 0
      && departTimeEnd === 24
      && arriveTimeStart === 0
      && arriveTimeEnd === 24
  }, [
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd
  ])

  return (
    <div className="bottom">
      <div className="bottom-filters">
        <span className="item" onClick={toggleOrderType}>
          <i className="icon">&#xf065;</i>
          {orderType === ORDER_DEPART ? '出发 早→晚' : '耗时 短→长'}
        </span>
        <span 
          className={classnames('item', {'item-on': highSpeed})}
          onClick={toggleHighSpeed}
        >
          <i className="icon">{highSpeed ? '\uf43f' : '\uf43e'}</i>
          只看高铁动车
        </span>
        <span 
          className={classnames('item', {'item-on': onlyTickets})}
          onClick={toggleOnlyTickets}
        >
          <i className="icon">{onlyTickets ? '\uf43d' : '\uf43c'}</i>
          只看有票
        </span>
        <span 
          className={classnames('item', {'item-on': isFiltersVisible || !noChecked})}
          onClick={toggleIsFiltersVisible}
        >
          <i className="icon">{noChecked ? '\uf0f7' : '\uf446'}</i>
          综合筛选
        </span>
      </div>
      {
        isFiltersVisible && (
          <BottomModal 
            ticketTypes={ticketTypes}
            checkedTicketTypes={checkedTicketTypes}
            trainTypes={trainTypes}
            checkedTrainTypes={checkedTrainTypes}
            departStations={departStations}
            checkedDepartStations={checkedDepartStations}
            arriveStations={arriveStations}
            checkedArriveStations={checkedArriveStations}
            departTimeStart={departTimeStart}
            departTimeEnd={departTimeEnd}
            arriveTimeStart={arriveTimeStart}
            arriveTimeEnd={arriveTimeEnd}
            setCheckedTicketTypes={setCheckedTicketTypes}
            setCheckedTrainTypes={setCheckedTrainTypes}
            setCheckedDepartStations={setCheckedDepartStations}
            setCheckedArriveStations={setCheckedArriveStations}
            setDepartTimeStart={setDepartTimeStart}
            setDepartTimeEnd={setDepartTimeEnd}
            setArriveTimeStart={setArriveTimeStart}
            setArriveTimeEnd={setArriveTimeEnd}
            toggleIsFiltersVisible={toggleIsFiltersVisible}
          />
        )
      }
    </div>
  )
}
Bottom.propTypes = {
  toggleHighSpeed: PropTypes.func.isRequired,
  toggleOrderType: PropTypes.func.isRequired,
  toggleOnlyTickets: PropTypes.func.isRequired,
  toggleIsFiltersVisible: PropTypes.func.isRequired,
  highSpeed: PropTypes.bool.isRequired,
  orderType: PropTypes.number.isRequired,
  onlyTickets: PropTypes.bool.isRequired,
  isFiltersVisible: PropTypes.bool.isRequired,
  ticketTypes: PropTypes.array.isRequired,
  checkedTicketTypes: PropTypes.object.isRequired,
  trainTypes: PropTypes.array.isRequired,
  checkedTrainTypes: PropTypes.object.isRequired,
  departStations: PropTypes.array.isRequired,
  checkedDepartStations: PropTypes.object.isRequired,
  arriveStations: PropTypes.array.isRequired,
  checkedArriveStations: PropTypes.object.isRequired,
  departTimeStart: PropTypes.number.isRequired,
  departTimeEnd: PropTypes.number.isRequired,
  arriveTimeStart: PropTypes.number.isRequired,
  arriveTimeEnd: PropTypes.number.isRequired,
  setCheckedTicketTypes: PropTypes.func.isRequired,
  setCheckedTrainTypes: PropTypes.func.isRequired,
  setCheckedDepartStations: PropTypes.func.isRequired,
  setCheckedArriveStations: PropTypes.func.isRequired,
  setDepartTimeStart: PropTypes.func.isRequired,
  setDepartTimeEnd: PropTypes.func.isRequired,
  setArriveTimeStart: PropTypes.func.isRequired,
  setArriveTimeEnd: PropTypes.func.isRequired
}

export default Bottom