import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import './ComNav.css'

function ComNav(props) {
  const { date, prev, next, isPrevDisabled, isNextDisabled } = props

  const currentString = useMemo(() => {
    const d = dayjs(date)
    return d.format('M月D日') + d.locale('zh-cn').format('ddd')
  }, [date])
  
  return (
    <div className="nav">
      <span
        className={classnames('nav-prev', {'nav-disabled': isPrevDisabled})}
        onClick={prev}
      >
        前一天
      </span>
      <span className="nav-current">{currentString}</span>
      <span
        className={classnames('nav-next', {'nav-disabled': isNextDisabled})}
        onClick={next}
      >
        后一天
      </span>
    </div>
  )
}
ComNav.propTypes = {
  date: PropTypes.number.isRequired,
  prev: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  isPrevDisabled: PropTypes.bool.isRequired,
  isNextDisabled: PropTypes.bool.isRequired
}

export default React.memo(ComNav)