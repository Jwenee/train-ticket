/**
 * 
 * @param {number} timestamp 时间戳,默认当前月份
 * @return {number} 返回本月第一天0时刻时间戳
 */
export function timeHandle(timestamp = Date.now()) {
  const target = new Date(timestamp)

  target.setHours(0)
  target.setMinutes(0)
  target.setSeconds(0)
  target.setMilliseconds(0)
  return target.getTime()
}

export function leftZero(num) {
  return num > 10 ? num : `0${num}`
}