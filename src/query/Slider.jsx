import React, { memo, useState, useMemo, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { leftZero } from '../utils/fp.js'
import './Slider.css'
import useWinSize from '../common/useWinSize.js'

function Slider(props) {
  const {
    title,
    currentStartHours,
    currentEndHours,
    onStartChanged,
    onEndChanged
  } = props

  const winSize = useWinSize()
  // 左右滑块dom
  const startHandle = useRef()
  const endHandle = useRef()
  const lastStartX = useRef()
  const lastEndX = useRef()
  const slider = useRef()
  const sliderWidth = useRef()
  
  // 记录上一次时间
  const prevCurrentStartHours = useRef(currentStartHours)
  const prevCurrentEndHours = useRef(currentEndHours)
  // 24小时百分比
  const [start, setStart] = useState(() => {
    return currentStartHours / 24 * 100
  })
  const [end, setEnd] = useState(() => {
    return currentEndHours / 24 * 100
  })
  // 对比前后数据
  if (prevCurrentStartHours.current !== currentStartHours) {
    setStart(currentStartHours / 24 * 100)
    prevCurrentStartHours.current = currentStartHours
  }
  if (prevCurrentEndHours.current !== currentEndHours) {
    setEnd(currentEndHours / 24 * 100)
    prevCurrentEndHours.current = currentEndHours
  }

  const startPercent = useMemo(() => {
    if (start > 100) {
      return 100
    }
    if (start < 0) {
      return 0
    }
    return start
  }, [start])
  const endPercent = useMemo(() => {
    if (end > 100) {
      return 100
    }
    if (end < 0) {
      return 0
    }
    return end
  }, [end])
  const startHours = Math.round(startPercent * 24 / 100)
  const endHours = Math.round(endPercent * 24 / 100)
  const startHoursTxt = useMemo(() => {
    return `${leftZero(startHours)}:00`
  }, [startHours])
  const endHoursTxt = useMemo(() => {
    return `${leftZero(endHours)}:00`
  }, [endHours])
  // 两滑块监听事件
  const onStartTouchBegin = (e) => {
    const touch = e.targetTouches[0]
    lastStartX.current = touch.pageX
  }
  const onStartTouchMove = (e) => {
    const touch = e.targetTouches[0]
    const distance = touch.pageX - lastStartX.current
    // 更新上一次的值
    lastStartX.current = touch.pageX 
    setStart(start => start + (distance / sliderWidth.current) * 100)
  }
  const onEndTouchBegin = (e) => {
    const touch = e.targetTouches[0]
    lastEndX.current = touch.pageX
  }
  const onEndTouchMove = (e) => {
    const touch = e.targetTouches[0]
    const distance = touch.pageX - lastEndX.current
    // 更新上一次的值
    lastEndX.current = touch.pageX 
    setEnd(end => end + (distance / sliderWidth.current) * 100)
  }
  // 计算slider的宽度,resize
  useEffect(() => {
    sliderWidth.current = parseFloat(
      window.getComputedStyle(slider.current).width
    )
  }, [winSize.width])

  useEffect(() => {
    startHandle.current.addEventListener('touchstart', onStartTouchBegin, false)
    startHandle.current.addEventListener('touchmove', onStartTouchMove, false)
    endHandle.current.addEventListener('touchstart', onEndTouchBegin, false)
    endHandle.current.addEventListener('touchmove', onEndTouchMove, false)

    return () => {
      startHandle.current.removeEventListener('touchstart', onStartTouchBegin, false)
      startHandle.current.removeEventListener('touchmove', onStartTouchMove, false)
      endHandle.current.removeEventListener('touchstart', onEndTouchBegin, false)
      endHandle.current.removeEventListener('touchmove', onEndTouchMove, false)
    }
  })

  useEffect(() => {
    onStartChanged(startHours)
  }, [onStartChanged, startHours])
  useEffect(() => {
    onEndChanged(endHours)
  }, [endHours, onEndChanged])

  return (
    <div className="option">
      <h3>{ title }</h3>
      <div className="range-slider">
        <div className="slider" ref={slider}>
          <div 
            className="slider-range"
            style={{
              left: startPercent + '%',
              width: endPercent - startPercent + '%'
            }}
          ></div>
          <i 
            className="slider-handle" 
            style={{left: startPercent + '%'}}
            ref={startHandle}
          >
            <span>{ startHoursTxt }</span>
          </i>
          <i 
            className="slider-handle" 
            style={{left: endPercent + '%'}}
            ref={endHandle}
          >
            <span>{ endHoursTxt }</span>
          </i>
        </div>
      </div>
    </div>
  )
}
Slider.propTypes = {
  title: PropTypes.string.isRequired,
  currentStartHours: PropTypes.number.isRequired,
  currentEndHours: PropTypes.number.isRequired,
  onStartChanged: PropTypes.func.isRequired,
  onEndChanged: PropTypes.func.isRequired
}

export default memo(Slider)