import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { timeHandle } from '../utils/fp.js'
import './DateSelector.css'

import ComHeader from './ComHeader.jsx'

const Day = (props) => {
  const { day, onDateSelect } = props
  if (!day) {
    return <td className="null"></td>
  }
  let classes = []
  const now = timeHandle()
  if (day < now) {
    classes.push('disable')
  }
  if ([6, 0].includes(new Date(day).getDay())) {
    classes.push('weekend')
  }
  const dateString = now === day ? '今天' : new Date(day).getDate()
  return (
    <td 
      className={classnames(classes)} 
      onClick={() => onDateSelect(day)}
    >
      { dateString }
    </td>
  )
}
Day.propTypes = {
  day: PropTypes.number,
  onDateSelect: PropTypes.func.isRequired
}

const Week = (props) => {
  const { days, onDateSelect } = props
  return (
    <tr className="date-table-days">
      {
        days.map((day, index) => {
          return (
            <Day 
              key={index} 
              day={day} 
              onDateSelect={onDateSelect}
            />
          )
        })
      }
    </tr>
  )
}
Week.propTypes = {
  days: PropTypes.array.isRequired,
  onDateSelect: PropTypes.func.isRequired
}

const Month = (props) => {
  const { startingTimeInMonth, onDateSelect } = props
  const startDay = new Date(startingTimeInMonth)
  const currentDay = new Date(startingTimeInMonth)
  let days = []
  while (currentDay.getMonth() === startDay.getMonth()) {
    days.push(currentDay.getTime())
    currentDay.setDate(currentDay.getDate() + 1)
  }
  // 补齐数组开始空格,星期日补6个
  days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6)
        .fill(null).concat(days)
  const lastDay = new Date(days[days.length - 1])
  // 补齐数组结尾空格
  days = days.concat(new Array(lastDay.getDay() ? 7 - lastDay.getDay() : 0)
        .fill(null))
  // 划分月7天一组
  let weeks = []
  for (let row = 0; row < days.length / 7; row++) {
    const week = days.slice(row * 7, (row + 1) * 7)
    weeks.push(week)
  }

  return (
    <table className="date-table">
      <thead>
        <tr>
          <td colSpan="7">
            <h5>
            {startDay.getFullYear()}年{startDay.getMonth() + 1}月
            </h5>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr className="date-table-weeks">
          <th>周一</th>
          <th>周二</th>
          <th>周三</th>
          <th>周四</th>
          <th>周五</th>
          <th className="weekend">周六</th>
          <th className="weekend">周日</th>
        </tr>
        {
          weeks.map((week, index) => {
            return (
              <Week 
                key={index}
                days={week}
                onDateSelect={onDateSelect}
              />
            )
          })
        }
      </tbody>
    </table>
  )
}
Month.propTypes = {
  startingTimeInMonth: PropTypes.number.isRequired,
  onDateSelect: PropTypes.func.isRequired
}

const DateSelector = (props) => {
  const { show, onDateSelect, onBack } = props
  const now = new Date()
  // 设置本月第一天0时刻
  now.setHours(0)
  now.setMinutes(0)
  now.setSeconds(0)
  now.setMilliseconds(0)
  now.setDate(1)
  // 获取连续三个月数组 eg:[7,8,9]
  const monthSequence = [now.getTime()]
  now.setMonth(now.getMonth() + 1)
  monthSequence.push(now.getTime())
  now.setMonth(now.getMonth() + 1)
  monthSequence.push(now.getTime())

  return (
    <div className={classnames('date-selector', {hidden: !show})}>
      <ComHeader 
        title="日期选择"
        onBack={onBack}
      />
      <div className="date-selector-tables">
        {
          monthSequence.map(month => {
            return (
              <Month 
                key={month}
                startingTimeInMonth={month}
                onDateSelect={onDateSelect}
              />
            )
          })
        }
      </div>
    </div>
  )
}
DateSelector.propTypes = {
  show: PropTypes.bool.isRequired,
  onDateSelect: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
}

export default DateSelector