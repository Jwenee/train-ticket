import React, { useState, useEffect, useMemo, useCallback, memo } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import './CitySelector.css'

const CityItem = memo((props) => {
  const { name, onSelect } = props

  return (
    <li className="city-li" onClick={() => onSelect(name)}>
      { name }
    </li>
  )
})
CityItem.propTypes = {
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

const CitySection = memo((props) => {
  const { title, cities = [], onSelect } = props
  
  return (
    <ul className="city-ul">
      <li className="city-li" key="title" data-cate={ title }>
        { title }
      </li>
      {
        cities.map(city => {
          return (
            <CityItem 
              key={city.name} 
              name={city.name}
              onSelect={onSelect}
            />
          )          
        })
      }
    </ul>
  )
})
CitySection.propTypes = {
  title: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  cities: PropTypes.array
}

const AlphaIndex = memo((props) => {
  const { alpha, onIndexClick } = props

  return (
    <i className="city-index-item" onClick={() => onIndexClick(alpha)}>
      { alpha }
    </i>
  )
})
AlphaIndex.propTypes = {
  alpha: PropTypes.string.isRequired,
  onIndexClick: PropTypes.func.isRequired
}
// 26个大写字母表
const alphabet = Array.from(new Array(26), (el, index) => {
  return String.fromCharCode(65 + index)
})

const CityList = memo((props) => {
  const { sections, onSelect, toAlpha } = props

  return (
    <div className="city-list">
      <div className="city-cate">
        {
          sections.map(section => {
            return (
              <CitySection
                key={section.title}
                title={section.title}
                cities={section.citys}
                onSelect={onSelect}                
              />
            )
          })
        }
      </div>
      <div className="city-index">
        {
          alphabet.map(alpha => {
            return (
              <AlphaIndex 
                key={alpha}
                alpha={alpha}
                onIndexClick={toAlpha}
              />
            )
          })
        }
      </div>
    </div>
  )
})
CityList.propTypes = {
  onSelect: PropTypes.func.isRequired,
  toAlpha: PropTypes.func.isRequired,
  sections: PropTypes.array.isRequired
}

const SuggestItem = memo((props) => {
  const { name, onCitySelect } = props

  return (
    <li className="city-suggest-li" onClick={() => onCitySelect(name)}>
      { name }
    </li>
  )
})
SuggestItem.propTypes = {
  name: PropTypes.string.isRequired,
  onCitySelect: PropTypes.func.isRequired
}

const SuggestList = memo((props) => {
  const { searchKey, onSelect } = props
  const [result, setResult] = useState([])

  useEffect(() => {
    fetch(`/rest/search?key=${encodeURIComponent(searchKey)}`)
      .then(res => res.json())
      .then(data => {
        const { result, searchKey: sKey } = data
        if (sKey === searchKey) {
          setResult(result)
        }
      })
  }, [searchKey])

  const fallBackResult = useMemo(() => {
    if (!result.length) {
      return [{display: searchKey}]
    }
    return result
  }, [result, searchKey])

  return (
    <div className="city-suggest">
      <ul className="city-suggest-ul">
        {
          fallBackResult.map(item => {
            return (
              <SuggestItem 
                key={item.display}
                name={item.display}
                onCitySelect={onSelect}
              />
            )
          })
        }
      </ul>
    </div>
  )
})
SuggestList.propTypes = {
  searchKey: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

const CitySelector = memo((props) => {
  const { show, cityData, isLoading, onBack } = props
  const { fetchCityData, onSelect } = props
  const [searchKey, setSearchKey] = useState('')
  const key = useMemo(() => searchKey.trim(), [searchKey]) 

  useEffect(() => {
    if (!show || cityData || isLoading) return
    fetchCityData()
  }, [show, cityData, isLoading, fetchCityData])

  const toAlpha = useCallback(alpha => {
    document.querySelector(`[data-cate="${alpha}"]`).scrollIntoView()
  }, [])
  const outputCitySections = () => {
    if (isLoading) {
      return <div>loading</div>
    }
    if (cityData) {
      return (
        <CityList 
          sections={cityData.cityList}
          onSelect={onSelect}
          toAlpha={toAlpha}
        />
      )
    }
    return <div>error</div>
  }
  
  return (
    <div className={classnames('city-selector', {hidden: !show})}>
      <div className="city-search">
        <div className="search-back" onClick={() => onBack()}>
          <svg width="42" height="42">
            <polyline
              points="25,13 16,21 25,29"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
            ></polyline>
          </svg>
        </div>
        <div className="search-input-wrapper">
          <input 
            type="text"
            value={searchKey}
            className="search-input"
            placeholder="城市、车站的中文或拼音"
            onChange={e => setSearchKey(e.target.value)}
          />
        </div>
        <i 
          className={classnames("search-clean", {hidden: key.length === 0})}
          onClick={() => setSearchKey('')}
        >
          &#xf063;
        </i>
      </div>
      {
        Boolean(key) && (
          <SuggestList 
            searchKey={key}
            onSelect={key => onSelect(key)}
          />
        )
      }
      { !Boolean(key) && outputCitySections() }
    </div>
  )
})
CitySelector.propTypes = {
  show: PropTypes.bool.isRequired,
  cityData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired, 
  onBack: PropTypes.func.isRequired,
  fetchCityData: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default CitySelector