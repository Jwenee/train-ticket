import React from 'react'
import './Submit.css'

function Submit(props) {
  return (
    <div className="submit">
      <button className="submit-button" type="submit">搜索</button>
    </div>
  )
}

export default React.memo(Submit)