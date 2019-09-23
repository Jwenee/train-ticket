import React, { useMemo, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import URI from 'urijs'
import dayjs from 'dayjs'
import { timeHandle } from '../utils/fp.js'
import useComNav from '../common/useComNav.js'
import './App.css'

import ComHeader from '../common/ComHeader.jsx'
import  ComNav from '../common/ComNav.jsx'
import List from './List.jsx'
import Bottom from './Bottom.jsx'

import {
  setFrom,
  setTo,
  setHighSpeed,
  setDepartDate,
  setSearchParsed,
  setTrainList,
  setTicketTypes,
  setTrainTypes,
  setDepartStations,
  setArriveStations,
  prevDate,
  nextDate,
  toggleHighSpeed,
  toggleOrderType,
  toggleOnlyTickets,
  toggleIsFiltersVisible,
  setCheckedTicketTypes,
  setCheckedTrainTypes,
  setCheckedDepartStations,
  setCheckedArriveStations,
  setDepartTimeStart,
  setDepartTimeEnd,
  setArriveTimeStart,
  setArriveTimeEnd
} from './actions.js'

function App(props) {
  const { 
    trainList,
    from, to, dispatch,
    searchParsed,
    departDate,
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
    arriveTimeEnd
  } = props
  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  useEffect(() => {
    const queries = URI.parseQuery(window.location.search)
    const { from, to, highSpeed, date } = queries
    dispatch(setFrom(from))
    dispatch(setTo(to))
    dispatch(setDepartDate(timeHandle(dayjs(date).valueOf())))
    dispatch(setHighSpeed(highSpeed === 'true'))
    dispatch(setSearchParsed(true))
  }, [dispatch])

  useEffect(() => {
    if (!searchParsed) return

    const url = new URI('/rest/query')
        .setSearch('from', from)
        .setSearch('to', to)
        .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
        .setSearch('highSpeed', highSpeed)
        .setSearch('orderType', orderType)
        .setSearch('onlyTickets', onlyTickets)
        .setSearch('checkedTicketTypes', Object.keys(checkedTicketTypes).join())
        .setSearch('checkedTrainTypes', Object.keys(checkedTrainTypes).join())
        .setSearch('checkedDepartStations', Object.keys(checkedDepartStations).join())
        .setSearch('checkedArriveStations', Object.keys(checkedArriveStations).join())
        .setSearch('departTimeStart', departTimeStart)
        .setSearch('departTimeEnd', departTimeEnd)
        .setSearch('arriveTimeStart', arriveTimeStart)
        .setSearch('arriveTimeEnd', arriveTimeEnd)
        .toString()

    fetch(url)
      .then(res => res.json())
      .then(result => {
        const {
          dataMap: {
            directTrainInfo: {
              trains,
              filter: {
                ticketType,
                trainType,
                depStation,
                arrStation
              }
            }
          }
        } = result
        dispatch(setTrainList(trains))
        dispatch(setTicketTypes(ticketType))
        dispatch(setTrainTypes(trainType))
        dispatch(setDepartStations(depStation))
        dispatch(setArriveStations(arrStation))
      })
  }, [
    dispatch,
    from,
    to,
    departDate,
    highSpeed,
    searchParsed,
    orderType,
    onlyTickets,
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd
  ])

  const {isPrevDisabled, isNextDisabled, prev, next} = useComNav(departDate, dispatch, prevDate, nextDate)

  const bottomCbs = useMemo(() => {
    return bindActionCreators({
      toggleHighSpeed,
      toggleOrderType,
      toggleOnlyTickets,
      toggleIsFiltersVisible,
      setCheckedTicketTypes,
      setCheckedTrainTypes,
      setCheckedDepartStations,
      setCheckedArriveStations,
      setDepartTimeStart,
      setDepartTimeEnd,
      setArriveTimeStart,
      setArriveTimeEnd
    }, dispatch)
  }, [dispatch])
  if (!searchParsed) {
    return null
  }

  return (
    <div>
      <div className="header-wrapper">
        <ComHeader 
          title={`${from} - ${to}`}
          onBack={onBack}
        />
      </div>
      <ComNav 
        date={departDate}
        isPrevDisabled={isPrevDisabled}
        isNextDisabled={isNextDisabled}
        prev={prev}
        next={next}
      />
      <List list={trainList}/>
      <Bottom 
        highSpeed={highSpeed}
        orderType={orderType}
        onlyTickets={onlyTickets}
        isFiltersVisible={isFiltersVisible}
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
        {...bottomCbs}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return state
}
const mapDispatchToProps = (dispatch) => {
  return { dispatch }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)