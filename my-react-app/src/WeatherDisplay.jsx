import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './WeatherDisplay.module.css'

function WeatherDisplay({state, setState, city, setCity}) {
    
    const apiKey = "9929c1649f7fccc1fda5fd76a623f3a5";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const hourlyApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const [weatherData, setWeatherData] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [timeAgo, setTimeAgo] = useState('');
    const intervals = [];

    /*
    function getWeatherdata() {
        useEffect( () => {
            fetch(apiUrl).then(response => response.json()).then(data => setWeather(data)).catch(err => console.log(err));
            console.log(weather);
        }, [])
    }
    */
    
    /*
    async function getWeatherdata() {
        const response = await fetch(apiUrl);
        const result = await response.json();
        console.log(result);
        //console.log(result.main.temp)
        const t = result.name;
        console.log(t);
        //return(t)
    }
    */

    // Save the current city to localStorage whenever it changes
    useEffect(() => {
        if (city) {
        localStorage.setItem('city', city);
        }
    }, [city]);

    // Load the city from localStorage on component mount
    useEffect(() => {
        const savedCity = localStorage.getItem('city');
        if (savedCity) {
        setCity(savedCity);
        }
    }, [setCity]);

    useEffect(() => {
        if (state) {
        localStorage.setItem('state', state);
        }
    }, [state]);

    useEffect(() => {
        const savedState = localStorage.getItem('state');
        if (savedState) {
        setState(savedState);
        }
    }, [setState]);

    useEffect(() => {
        const fetchHourly = async () => {
          try {
            const response = await fetch(hourlyApiUrl);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            setHourlyForecast(data);
          } catch (err) {
            //setError(err.message);
            console.log(err);
          } 
        };
    
        fetchHourly();
      }, [city, apiKey]);

      
      useEffect(() => {
        const fetchWeather = async () => {
          try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setWeatherData(data);
            setLastUpdated(new Date()); 
            console.log(data);
          } catch (err) {
            //setError(err.message);
            console.log(err);
          } 
        };
    
        fetchWeather();
      }, [city, apiKey]);


      useEffect(() => {
        if (lastUpdated) {
            const intervalId = setInterval(() => {
                const now = new Date();
                const secondsAgo = Math.floor((now - lastUpdated) / 1000);
                const minutesAgo = Math.floor(secondsAgo / 60);
                
                if (minutesAgo < 1) {
                    setTimeAgo("Updated just now");
                } else if (minutesAgo === 1) {
                    setTimeAgo("Updated 1 minute ago");
                } else {
                    setTimeAgo(`Updated ${minutesAgo} minutes ago`);
                }
            }, 60000); // Update every minute

            return () => clearInterval(intervalId); // Clear interval on component unmount
        }
    }, [lastUpdated]);


      const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert UNIX timestamp to milliseconds
        const dayName = date.toLocaleString('default', { weekday: 'long' }); // Full day name (e.g., Wednesday)
        const monthName = date.toLocaleString('default', { month: 'long' }); // Full month name (e.g., September)
        const numericDay = date.getDate(); // Numeric day (e.g., 4)
        return `${dayName}, ${monthName} ${numericDay}`;
      };

      const formatTime = (time) => {
        const date = new Date(time * 1000);
        let hours = date.getHours();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12; // Convert to 12-hour format and handle "0" as "12"
        return `${hours}${ampm}`;
      };

      const getWindDirection = (degree) => {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round((degree % 360) / 22.5);
        return directions[index % 16];
      };

      function getInterval(i) {
         
        const isNewDay = i === 0 || (hourlyForecast && formatDate(hourlyForecast.list[i].dt) !== formatDate(hourlyForecast.list[i - 1].dt));

        return ( 
        <div id={styles.interval1}>
            {isNewDay && (<div id={styles.dayMonthDay}>
                { hourlyForecast && formatDate(hourlyForecast.list[i].dt)}
            </div>)}
            <div id={styles.hourlyWeatherContent}>
                <div id={styles.hourlyTime}>
                    { hourlyForecast && formatTime(hourlyForecast.list[i].dt)}
                </div>
                <div id={styles.hourlyTempAndImage}>
                    <div id={styles.hourlyImg}>
                        {hourlyForecast && getIcon2(hourlyForecast, i)}
                    </div>
                    <div id={styles.hourlyTempAndDeg}>
                        <div id={styles.hourlyTemp}>
                            { hourlyForecast && (hourlyForecast.list[i].main.temp - 273.15).toFixed(0) }
                        </div>
                        <div id={styles.hourlyDegreeSym}>
                            °
                        </div>
                    </div>
                        
                </div>
                <div id={styles.hourlyWeatherDes}>
                    { hourlyForecast && hourlyForecast.list[i].weather[0].description }
                </div>
                <div id={styles.hourlyFeelsTemp}>
                    { hourlyForecast && `Feels ${(hourlyForecast.list[i].main.feels_like - 273.15).toFixed(0)}`}
                </div>
                <div id={styles.regWind}>
                    🍃Wind
                </div>
                <div id={styles.windGust}>
                    🍃Wind Gust
                </div>
                
                <div id={styles.hourlyWindSpeed}>
                    { hourlyForecast && `${Math.round(hourlyForecast.list[i].wind.speed * 3.6)} km/h ${getWindDirection(hourlyForecast.list[i].wind.deg)}`}
                </div>
                <div id={styles.hourlyGustSpeed}>
                    { hourlyForecast && `${Math.round(hourlyForecast.list[i].wind.gust * 3.6)} km/h`}
                </div>

                <div id={styles.hourlyPop}>
                    ☔P.O.P.
                </div>
                <div id={styles.hourlyPopValue}>
                    { hourlyForecast && (hourlyForecast.list[i].pop * 100).toFixed(0)}%
                </div>
                <div id={styles.hourlyPressure}> 
                    🌎Pressure
                </div>
                <div id={styles.hourlyPressureValue}>
                    { hourlyForecast && (hourlyForecast.list[i].main.pressure / 10).toFixed(1) } kPa
                </div>
                <div id={styles.hourlyHumidityValue}>
                    { hourlyForecast && hourlyForecast.list[i].main.humidity }%
                </div>
                <div id={styles.hourlyHumidity}>
                    💧Humidity
                </div>
                <div id={styles.hourlyVisibility}>
                    👁️Visibility
                </div>
                <div id={styles.hourlyVisibilityValue}>
                    { hourlyForecast && (hourlyForecast.list[i].visibility / 1000).toFixed(0)} km
                </div>

            </div>
        </div> 
        );
      }

      

        for (let k = 0; k < 40; k++) {
            intervals.push(getInterval(k));
        }

        //getting icon for current weather display
        function getIcon(conditions) {
            const weatherIconCode = conditions.weather[0].icon;
            const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
            
            return (
                <img src={weatherIconUrl} width="88px" alt={conditions.weather[0].description}></img>
            );
        }

        //getting icon for hourly weather display
        function getIcon2(conditions, ind) {
            const weatherIconCode = conditions.list[ind].weather[0].icon;
            const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
            
            return (
                <img src={weatherIconUrl} width="60px" alt={conditions.list[ind].weather[0].description}></img>
            );
        }
    
    
    return (
        <div className={styles.weatherDisplayContainer}>
            <div className={styles.topBar}>
                <div id={styles.emptyDivBlock}></div>
                <Link to="/" onClick={() => setCity("")}>
                    <div id={styles.sunIcon}>
                        <i id={styles.sunImg} className='material-symbols-outlined'>partly_cloudy_day</i>
                    </div>
                </Link>
                <Link to="/" className={styles.noUnderline} onClick={() => setCity("")}>
                    <div id={styles.title}>
                        <h2 id={styles.h2TheWeather}>The Weather</h2>
                        <h2 id={styles.h2Forecast}>Forecast</h2>
                    </div>
                </Link>
            </div>
            <div className={styles.bottomBar}>
                <main>
                    <div id={styles.location}>
                        <div id={styles.locationHeader}>
                            <h1>{city}, {state}</h1>
                        </div>
                        <div id={styles.updatedHeader}>
                            {timeAgo}
                        </div>
                    </div>
                    <div id={styles.currentWeatherContainer}>
                        <div id={styles.currentWeather}>
                            <div id={styles.tempAndImage}>
                                <div id={styles.image}>
                                    {weatherData && getIcon(weatherData)}
                                </div>
                                <div id={styles.realTemp}>
                                    <div id={styles.tempValue}>
                                        {weatherData && `${(weatherData.main.temp - 273.15).toFixed(0)}`}
                                    </div>
                                    <div id={styles.degreeSymbol}>
                                        °
                                    </div>
                                    <div id={styles.celsius}>
                                        C
                                    </div>
                                </div>
                            </div>
                            <div id={styles.descAndFeelsLike}>
                                <div id={styles.currWeatherDesc}>
                                    {weatherData && weatherData.weather[0].description}
                                </div>
                                <div id={styles.feelsLikeTemp}>
                                    {weatherData && `Feels ${(weatherData.main.feels_like - 273.15).toFixed(0)}`}
                                </div>
                            </div>
                            
                        </div>
                        <div id={styles.currentWeatherObs}>
                            <div id={styles.obsWind}>
                                {`Wind`}
                            </div>
                            <div id={styles.obsWindValue}>
                                {weatherData && `${Math.round(weatherData.wind.speed * 3.6)} km/h ${getWindDirection(weatherData.wind.deg)}`} 
                            </div>
                            
                            <div id={styles.obsGust}>{weatherData && weatherData.wind.gust && "Gust" }</div>
                                
                            <div id={styles.obsGustValue}> { weatherData && weatherData.wind.gust && `${Math.round(weatherData.wind.gust * 3.6)} km/h`} </div>
                            
                            <div id={styles.obsHumidity}>
                                {`Humidity`}
                            </div>
                            <div id={styles.obsHumidityValue}>
                                {weatherData && `${weatherData.main.humidity}%`}
                            </div>
                            <div id={styles.obsPressure}>
                                {`Pressure`}
                            </div>
                            <div id={styles.obsPressureValue}>
                                {weatherData && `${(weatherData.main.pressure / 10).toFixed(1)} kPa`}
                            </div>
                            <div id={styles.obsVisibility}>
                                {`Visibility`}
                            </div>
                            <div id={styles.obsVisibilityValue}>
                                {weatherData && `${(weatherData.visibility / 1000).toFixed(0)} km`}
                            </div>
                        </div>
                    </div>
                    <div className={styles.forecast}>
                        <div id={styles.forecastType}>
                            Hourly Forecast
                        </div>
                        <div id={styles.forecastIntervals}>
                            { intervals }
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default WeatherDisplay;