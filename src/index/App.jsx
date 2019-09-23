import React, { useCallback, useMemo } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { timeHandle } from '../utils/fp.js'
import './App.css'

import ComHeader from '../common/ComHeader.jsx'
import DepartDate from './DepartDate.jsx'
import HighSpeed from './HighSpeed.jsx'
import Journey from './Journey.jsx'
import Submit from './Submit.jsx'
import CitySelector from '../common/CitySelector.jsx'
import DateSelector from '../common/DateSelector.jsx'

import {
  exchangeFromTo,
  showCitySelector,
  hideCitySelector,
  fetchCityData,
  setSelectedCity,
  showDateSelector,
  hideDateSelector,
  setDepartDate,
  toggleHighSpeed
} from './actions.js'

function App(props) {
  const { 
    from,
    to,
    dispatch ,
    isCitySelectorVisible,
    isDateSelectorVisible,
    highSpeed,
    cityData,
    isLoadingCityData,
    departDate
  } = props

  const onBack = useCallback(() => {
    window.history.back()
  }, [])
  
  const journeyCbs = useMemo(() => {
    return bindActionCreators({
      exchangeFromTo,
      showCitySelector
    }, dispatch)
  }, [dispatch])

  const citySelectorCbs = useMemo(() => {
    return bindActionCreators({
      onBack: hideCitySelector,
      onSelect: setSelectedCity,
      fetchCityData
    }, dispatch)
  }, [dispatch])

  const departDateCbs = useMemo(() => {
    return bindActionCreators({
      onClick: showDateSelector
    }, dispatch)
  }, [dispatch])

  const dateSelectorCbs = useMemo(() => {
    return bindActionCreators({
      onBack: hideDateSelector
    }, dispatch)
  }, [dispatch])

  const highSpeedCbs = useMemo(() => {
    return bindActionCreators({
      toggle: toggleHighSpeed
    }, dispatch)
  }, [dispatch])

  const onDateSelect = useCallback((day) => {
    if (!day) return
    // 日期为过去的
    if (day < timeHandle()) return
    dispatch(setDepartDate(day))
    dispatch(hideDateSelector())
  }, [dispatch])

  return (
    <div>
      <div className="header-wrapper">
        <ComHeader title="火车票" onBack={onBack} />
      </div>
      <form action="./query.html" className="form">
        <Journey 
          from={from} 
          to={to} 
          {...journeyCbs}
        />
        <DepartDate 
          time={departDate}
          {...departDateCbs}
        />
        <HighSpeed 
          highSpeed={highSpeed}
          {...highSpeedCbs}
        />
        <Submit />
      </form>
      <CitySelector 
        show={isCitySelectorVisible}
        cityData={cityData}
        isLoading={isLoadingCityData}
        {...citySelectorCbs}
      />
      <DateSelector 
        show={isDateSelectorVisible}
        {...dateSelectorCbs}
        onDateSelect={onDateSelect}
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