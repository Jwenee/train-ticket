import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers.js'
import { timeHandle } from '../utils/fp.js'
import { ORDER_DEPART } from './constant.js'

const store = createStore(
  combineReducers(reducers),
  {
    from: null,
    to: null,
    departDate: timeHandle(Date.now()),
    highSpeed: false,
    trainList: [],
    orderType: ORDER_DEPART,
    onlyTickets: false,
    ticketTypes: [],
    checkedTicketTypes: {},
    trainTypes: [],
    checkedTrainTypes: {},
    departStations: [],
    checkedDepartStations: {},
    arriveStations: [],
    checkedArriveStations: {},
    departTimeStart: 0,
    departTimeEnd: 24,
    arriveTimeStart: 0,
    arriveTimeEnd: 24,
    isFiltersVisible: false,
    searchParsed: false
  },
  applyMiddleware(thunk)
)

export default store