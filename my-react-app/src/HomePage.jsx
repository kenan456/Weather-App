import { useState, useEffect } from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"
import styles from './HomePage.module.css'

function HomePage({state, setState, city, setCity}) {
  const date = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [loaded, setLoaded] = useState([]);


  const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'd40ecc9f42msh8d74844960085f9p19210fjsn25d66f896942',
      'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
    }
  };

  async function loadCityOptions(inputValue) {
    try {
      const response = await fetch(`${url}?namePrefix=${inputValue}`, options);
      const result = await response.json();
      console.log(result);
      setLoaded(result.data.map( (c) => ( {name: c.name, state: c.regionCode}) ));
    } catch (error) {
      console.error(error);
    }   
    
  }

  function handleCityChange(event) {
    setCity(event.target.value);
    loadCityOptions(event.target.value);
  }

  return (
        <div className={styles.container}>
          <div className={styles.topBar}>
                <div id={styles.emptyDiv}></div>
                <Link to="/">
                    <div id={styles.sunIcon}>
                        <i id={styles.sunImg} className='material-symbols-outlined'>partly_cloudy_day</i>
                    </div>
                </Link>
                <Link to="/" className={styles.noUnderline}>
                    <div id={styles.title}>
                        <h2 id={styles.h2TheWeather}>The Weather</h2>
                        <h2 id={styles.h2Forecast}>Forecast</h2>
                    </div>
                </Link>
          </div>
          <div id={styles.bottomBar}>
            <div id="locationSearch">
              <br/>
              <h4 id={styles.homePageDate}>Its {days[date.getDay()]}, {months[date.getMonth()]} {date.getDate()}</h4>
              <h1 id={styles.homePageGreeting}>Be ready for what the weather brings</h1>
              <br/>
              <div id={styles.searchInputPlusIcon}>
                <i id={styles.searchIcon} className='material-symbols-outlined'>search</i>
                <input type="text" placeholder="Enter location" onChange={handleCityChange} value={city}></input>
              </div>
            
            </div>
              
              {city !== "" && loaded.length === 0 && <div id={styles.searchResultsContainer}>
                                                      <div className="searchResults">
                                                          <div id={styles.noLocationFound}>No locations found. Please try again.</div>
                                                      </div>
                                                     </div>
              }

              {city !== "" && loaded.length !== 0 && <div id={styles.searchResultsContainer}>
                                <div className="searchResults">
                                  {loaded.map( (l, index) => <div id={styles.locationResult} key={index}><Link  id={styles.locationResultLink} onClick={() => {setState(l.state); setCity(l.name);}} to="/WeatherDisplay">{`${l.name} ${l.state}`}</Link></div> )}
                                </div>
                              </div>
              }
            
            <div id="bottomHalf_bottomBar">
            </div>
          </div>
        </div>
      
    
  )
}

export default HomePage;