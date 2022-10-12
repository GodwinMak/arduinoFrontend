import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import Maps from './components/Maps';
import Login from "./pages/Login"
import Sign from "./pages/Sign"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import AnimalList from './components/AnimalList';
import React, { useState} from 'react'
import {AppContext} from './components/context/appContext'


function App() {

  const [animalData, setAnimalData] = useState([]);
  const[animal_name, setAnimal_name] = useState([]);
  const[animal_names, setAnimal_names] = useState([]);
  const [rhinoName, setRhinoName] = useState([]);
  const [newData, setNewData] = useState({});
  const [coordinat, setCoordinat] = useState([]);
  const [loading, setLoading] = useState(false) // creating loading state
  const [isMaploading, setIsMaploading] = useState(false);

  return (
    <AppContext.Provider
      value={{
        animalData, setAnimalData,
        animal_names, setAnimal_names,
        animal_name, setAnimal_name,
        rhinoName, setRhinoName,
        newData, setNewData,
        coordinat, setCoordinat,
        loading, setLoading,
        isMaploading, setIsMaploading
      }}
    >      
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path='/sign' element={<Sign/>}/>
            <Route path="/dashboard" element={<Dashboard/>} > 
              <Route path= '/dashboard' element={<AnimalList/>}/>
              <Route path='/dashboard/map' element={<Maps/>}/>
            </Route>
          </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
