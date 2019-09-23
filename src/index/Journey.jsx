import React from 'react'
import switchImg from './image/switch.svg'
import './Journey.css'

function Journey(props) {
  const { from, to, exchangeFromTo, showCitySelector } = props
  return (
    <div className="journey">
      <div 
        className="journey-station"
        onClick={() => showCitySelector(true)}
      >
        <input 
          type="text" 
          className="journey-input journey-from"
          readOnly
          name="from"
          value={from}
        />
      </div>
      <div 
        className="journey-switch"
        onClick={() => exchangeFromTo()}
      >
        <img src={switchImg} alt="switch" width="70" height="40" />
      </div>
      <div 
        className="journey-station"
        onClick={() => showCitySelector(false)}
      >
        <input 
          type="text" 
          className="journey-input journey-to"
          readOnly
          name="to"
          value={to}
        />
      </div>
    </div>
  )
}

export default Journey