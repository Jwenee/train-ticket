import { useCallback } from 'react'
import { timeHandle } from '../utils/fp.js'

export default function useComNav(departDate, dispatch, prevDate, nextDate) {
  const isPrevDisabled = timeHandle(departDate) <= timeHandle() // 出发日期小于当天的0时刻，不可点
  const isNextDisabled = timeHandle(departDate) - timeHandle > 20 * 86400 * 1000 // 出发日期大于当天20天，不可点
  const prev = useCallback(() => {
    if (isPrevDisabled) return
    dispatch(prevDate())
  }, [dispatch, isPrevDisabled, prevDate])
  const next = useCallback(() => {
    if (isNextDisabled) return
    dispatch(nextDate())
  }, [dispatch, isNextDisabled, nextDate])

  return {
    isPrevDisabled,
    isNextDisabled,
    prev,
    next
  }
}