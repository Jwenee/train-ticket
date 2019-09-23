import {
  SET_FROM,
  SET_TO,
  SET_IS_CITY_SELECTOR_VISIBLE,
  SET_CURRENT_SELECTING_LEFT_CITY,
  SET_CITY_DATA,
  SET_IS_LOADING_CITY_DATA,
  SET_IS_DATE_SELECTOR_VISIBLE,
  SET_DEPART_DATE,
  SET_HIGH_SPEED
} from './actions.js'

export default {
  from(state = '北京', action) {
    const { type, payload } = action
    switch (type) {
      case SET_FROM:
        return payload
      default:
        break;
    }
    return state
  },
  to(state = '上海', action) {
    const { type, payload } = action
    switch (type) {
      case SET_TO:
        return payload
      default:
        break;
    }
    return state
  },
  isCitySelectorVisible(state = false, action) {
    const { type, payload } = action
    switch (type) {
      case SET_IS_CITY_SELECTOR_VISIBLE:
        return payload
      default:
        break;
    }
    return state
  },
  currentSelectingLeftCity(state = false, action) {
    const { type, payload } = action
    switch (type) {
      case SET_CURRENT_SELECTING_LEFT_CITY:
        return payload
      default:
        break;
    }
    return state
  },
  cityData(state = null, action) {
    const { type, payload } = action
    switch (type) {
      case SET_CITY_DATA:
        return payload
      default:
        break;
    }
    return state
  },
  isLoadingCityData(state = false, action) {
    const { type, payload } = action
    switch (type) {
      case SET_IS_LOADING_CITY_DATA:
        return payload
      default:
        break;
    }
    return state
  },
  isDateSelectorVisible(state = false, action) {
    const { type, payload } = action
    switch (type) {
      case SET_IS_DATE_SELECTOR_VISIBLE:
        return payload
      default:
        break;
    }
    return state
  },
  departDate(state = Date.now(), action) {
    const { type, payload } = action
    switch (type) {
      case SET_DEPART_DATE:
        return payload
      default:
        break;
    }
    return state
  },
  highSpeed(state = false, action) {
    const { type, payload } = action
    switch (type) {
      case SET_HIGH_SPEED:
        return payload
      default:
        break;
    }
    return state
  },
}