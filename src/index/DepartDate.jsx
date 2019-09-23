import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { timeHandle } from '../utils/fp.js'
import './DepartDate.css'

function DepartDate(props) {
  const { time, onClick } = props
  const handleTime = timeHandle(time)
  const departDate = new Date(handleTime)
  const departDateString = useMemo(() => {
    return dayjs(handleTime).format('YYYY-MM-DD')
  }, [handleTime])
  
  const isToday = handleTime === timeHandle()
  const weekArr = ['日', '一', '二', '三', '四', '五', '六']
  const weekString = `周${weekArr[departDate.getDay()]}${isToday ? '(今天)' : ''}`

  return (
    <div className="depart-date" onClick={onClick}>
      <input 
        type="hidden" 
        name="date" 
        value={departDateString}
      />
      { departDateString }
      <span className="depart-week">{ weekString }</span>
    </div>
  )
}
DepartDate.propTypes = {
  time: PropTypes.number.isRequired, 
  onClick: PropTypes.func.isRequired
}

export default DepartDate
