import React, { Suspense, useEffect, useCallback, useMemo, lazy } from 'react'
import URI from 'urijs'
import dayjs from 'dayjs'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { timeHandle } from '../utils/fp.js'
import { TrainContext } from './context.js'
import './App.css'
import useComNav from '../common/useComNav'

import ComHeader from '../common/ComHeader.jsx'
import ComNav from '../common/ComNav.jsx'
import Detail from '../common/Detail.jsx'
import Candidate from './Candidate.jsx'

import {
  setDepartStation,
  setArriveStation,
  setDepartDate,
  setTrainNumber,
  setSearchParsed,
  prevDate,
  nextDate,
  setDepartTimeStr,
  setArriveTimeStr,
  setArriveDate,
  setDurationStr,
  setTickets,
  toggleIsScheduleVisible
} from './actions.js'

const Schedule = lazy(() => import('./Schedule.jsx'))

function App(props) {
  const {
    dispatch,
    departDate,
    arriveDate,
    departTimeStr,
    arriveTimeStr,
    departStation,
    arriveStation,
    trainNumber,
    durationStr,
    tickets,
    isScheduleVisible,
    searchParsed
  } = props

  useEffect(() => {
    const queries = URI.parseQuery(window.location.search)
    const { dStation, aStation, date, trainNumber } = queries

    dispatch(setDepartStation(dStation))
    dispatch(setArriveStation(aStation))
    dispatch(setDepartDate(timeHandle(dayjs(date).valueOf())))
    dispatch(setTrainNumber(trainNumber))
    dispatch(setSearchParsed(true))
  }, [dispatch])

  useEffect(() => {
    document.title = trainNumber
  }, [trainNumber])

  useEffect(() => {
    if (!searchParsed) return
    const url = new URI('/rest/ticket')
                .setQuery('date', dayjs(departDate).format('YYY-MM-DD'))
                .setSearch('trainNumber', trainNumber)
                .toString()

    fetch(url)
      .then(res => res.json())
      .then(result => {
        const { detail, candidates } = result
        const { departTimeStr, arriveTimeStr, arriveDate, durationStr} = detail
        dispatch(setDepartTimeStr(departTimeStr))
        dispatch(setArriveTimeStr(arriveTimeStr))
        dispatch(setArriveDate(arriveDate))
        dispatch(setDurationStr(durationStr))
        dispatch(setTickets(candidates))
      })
  }, [departDate, searchParsed, trainNumber, dispatch])

  const { 
    isPrevDisabled, isNextDisabled, prev, next 
  } = useComNav(departDate, dispatch, prevDate, nextDate)

  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  const detailCbs = useMemo(() => {
    return bindActionCreators({
      toggleIsScheduleVisible
    }, dispatch)
  }, [dispatch])
  if (!searchParsed) {
    return null
  }
  return (
    <div className="app">
      <div className="header-wrapper">
        <ComHeader 
          title={trainNumber}
          onBack={onBack}
        />
      </div>
      <div className="nav-wrapper">
        <ComNav 
          date={departDate}
          isPrevDisabled={isPrevDisabled}
          isNextDisabled={isNextDisabled}
          prev={prev}
          next={next}
        />
      </div>
      <div className="detail-wrapper">
        <Detail 
          departDate={departDate}
          arriveDate={arriveDate}
          departTimeStr={departTimeStr}
          arriveTimeStr={arriveTimeStr}
          trainNumber={trainNumber}
          departStation={departStation}
          arriveStation={arriveStation}
          durationStr={durationStr}
        >
          <span className="left"></span>
          <span className="schedule" onClick={() => detailCbs.toggleIsScheduleVisible()}>时刻表</span>
          <span className="right"></span>
        </Detail>
      </div>
      <TrainContext.Provider 
        value={{trainNumber, departStation, arriveStation, departDate}}
      >
        <Candidate  tickets={tickets} />
      </TrainContext.Provider>
      { isScheduleVisible && 
        <div className="mask" onClick={() => dispatch(toggleIsScheduleVisible())}>
          <Suspense fallback={<div>loading</div>} >
            <Schedule 
              date={departDate}
              trainNumber={trainNumber}
              departStation={departStation}
              arriveStation={arriveStation}
            />
          </Suspense>
      </div>
      }
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