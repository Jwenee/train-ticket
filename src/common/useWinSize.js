import { useState, useEffect } from 'react'

export default function useWinSize() {
  const [width, setWidth] = useState(document.documentElement.clientWidth)
  const [hight, setHight] = useState(document.documentElement.clientHight)

  const onResize = () => {
    setWidth(document.documentElement.clientWidth)
    setHight(document.documentElement.clientHight)
  }
  useEffect(() =>{
    window.addEventListener('resize', onResize, false)

    return () => {
      window.removeEventListener('resize', onResize, false)
    }
  }, [])

  return { width, hight }
}