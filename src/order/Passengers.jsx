import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import './Passengers.css'

const PassengerItem = memo((props) => {
  const { 
    id,
    name,
    ticketType,
    licenceNo,
    gender,
    birthday,
    onRemove,
    onUpdate,
    showGenderMenu,
    showFollowAdultMenu,
    showTicketTypeMenu,
    followAdultName
  } = props

  const isAdult = ticketType === 'adult'
  return (
    <li className="passenger">
      <i 
        className="delete"
        onClick={() => onRemove(id)}
      >-</i>
      <ol className="items">
        <li className="item">
          <label className="label name">姓名</label>
          <input 
            type="text"
            className="input name"
            placeholder="乘客姓名"
            value={name}
            onChange={(e) => onUpdate(id, {name: e.target.value})}
          />
          <label className="ticket-type" onClick={() => showTicketTypeMenu(id)}>
            { isAdult ? '成人票' : '儿童票' }
          </label>
        </li>
        { isAdult &&
        <li className="item">
          <label className="label licenceNo">身份证</label>
          <input 
            type="text"
            className="input name"
            placeholder="证件号码"
            value={licenceNo}
            onChange={(e) => onUpdate(id, {licenceNo: e.target.value})}
          />
        </li>
        }
        { !isAdult &&
        <li className="item arrow">
          <label className="label gender">性别</label>
          <input 
            type="text"
            className="input gender"
            placeholder="请选择"
            onClick={() => showGenderMenu(id)}
            value={
              gender === 'male'
              ? '男'
              : gender === 'female'
                ? '女'
                : ''
            }
            readOnly
          />
        </li>
        }
        { !isAdult &&
        <li className="item">
          <label className="label birthday">出生日期</label>
          <input 
            type="text"
            className="input birthday"
            placeholder="如 19950105"
            value={birthday}
            onChange={(e) => onUpdate(id, {birthday: e.target.value})}
          />
        </li>
        }
        { !isAdult &&
        <li className="item arrow">
          <label className="label followAdult">同行成人</label>
          <input 
            type="text"
            className="input followAdult"
            placeholder="请选择"
            onClick={() => showFollowAdultMenu(id)}
            value={followAdultName}
            readOnly
          />
        </li>
        }
      </ol>
    </li>
  )
})
PassengerItem.propTypes = {
  id: PropTypes.number.isRequired, 
  name: PropTypes.string.isRequired, 
  ticketType: PropTypes.string.isRequired,
  licenceNo: PropTypes.string, 
  gender: PropTypes.string, 
  birthday: PropTypes.string,
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showGenderMenu: PropTypes.func.isRequired,
  showFollowAdultMenu: PropTypes.func.isRequired,
  showTicketTypeMenu: PropTypes.func.isRequired,
  followAdultName: PropTypes.string
}

function Passengers(props) {
  const { 
    passengers, createAdult, 
    createChild, removePassenger,
    updatePassenger,
    showGenderMenu,
    showFollowAdultMenu,
    showTicketTypeMenu
  } = props

  const nameMap = useMemo(() => {
    const ret = []
    passengers.forEach(passenger => {
      ret[passenger.id] = passenger.name
    })
    // for (let passenger of passengers) {
    //   ret[passenger.id] = passenger.name
    // }
    return ret
  }, [passengers])

  return (
    <div className="passengers">
      <ul>
        {
          passengers.map(passenger => {
            return (
              <PassengerItem 
                key={passenger.id}
                followAdultName={nameMap[passenger.followAdult]}
                {...passenger}
                onRemove={removePassenger}
                onUpdate={updatePassenger}
                showGenderMenu={showGenderMenu}
                showFollowAdultMenu={showFollowAdultMenu}
                showTicketTypeMenu={showTicketTypeMenu}
              />
            )
          })
        }
      </ul>
      <section className="add">
        <div className="adult" onClick={() => createAdult()}>添加成人</div>
        <div className="child" onClick={() => createChild()}>添加儿童</div>
      </section>
    </div>
  )
}
Passengers.propTypes = {
  passengers: PropTypes.array.isRequired,
  createAdult: PropTypes.func.isRequired,
  createChild: PropTypes.func.isRequired,
  removePassenger: PropTypes.func.isRequired,
  updatePassenger: PropTypes.func.isRequired,
  showGenderMenu: PropTypes.func.isRequired,
  showFollowAdultMenu: PropTypes.func.isRequired,
  showTicketTypeMenu: PropTypes.func.isRequired
}

export default memo(Passengers)