import { createStore, combineReducers, applyMiddelware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers.js'

const store = createStore(
  combineReducers(reducers),
  {},
  applyMiddelware(thunk)
)

export default store