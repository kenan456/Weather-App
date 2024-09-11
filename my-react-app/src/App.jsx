import { useState, useEffect } from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import { HashRouter as Router, Route, Routes, useNavigate } from "react-router-dom"
import HomePage from './HomePage'
import WeatherDisplay from './WeatherDisplay'


function App() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  return(
    <Router>
      <Routes>
        <Route path="/" element={<HomePage state={state} setState={setState} city={city} setCity={setCity} />}/>
        <Route path="/WeatherDisplay" element={<WeatherDisplay state={state} setState={setState} city={city} setCity={setCity} />}/>
      </Routes>
    </Router>
  )
  
}

export default App
