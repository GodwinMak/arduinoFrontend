import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import Maps from './components/map/Maps';
import Login from "./pages/Login"
import Sign from "./pages/Sign"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import AnimalList from './components/animalList/AnimalList';
import React, { useState} from 'react'
import {AppContext} from './components/context/appContext'
import "react-toastify/dist/ReactToastify.css"
import EmailVerify from './pages/EmailVerify';
import HeatMap from './components/map/HeatMap';
import LineMap from './components/map/LineMap';
// import TimeSlider from './components/map/TimeSlider';
import ClusterMap from './components/map/ClusterMap';


function App() {

  const [animalData, setAnimalData] = useState([]);
  const[animal_name, setAnimal_name] = useState([]);
  const[animal_names, setAnimal_names] = useState([]);
  const [rhinoName, setRhinoName] = useState([]);
  const [newData, setNewData] = useState({});
  const [coordinat, setCoordinat] = useState([]);
  const [loading, setLoading] = useState(false) // creating loading state
  const [isMaploading, setIsMaploading] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);

   const user = localStorage.getItem("token")
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
        isMaploading, setIsMaploading,
        currentUser, setCurrentUser
      }}
    >      
     <BrowserRouter>
         <Routes>
           <Route path="/" exact element={<Login/>}/>
           <Route path='/sign' exact element={<Sign/>}/>
           {
            user &&
              
            <Route path="/dashboard" exact element={<Dashboard/>} > 
             <Route path= '/dashboard' exact element={<AnimalList/>}/>
             <Route path='/dashboard/map' exact element={<Maps/>}/>
              <Route path='/dashboard/realtime' exact element={<ClusterMap/>}/>
             <Route path='/dashboard/heatMap' exact element={<HeatMap/>}/>
             <Route path='/dashboard/linemap' exact element={<LineMap/>}/>
              {/* <Route path='/dashboard/timeslider' exact element={<TimeSlider/>}/> */}
            </Route>
          }
          <Route path="/dashboard" exact element={<Navigate replace to='/'/>}/>
          <Route path ="/api/v1/:id/verify/:token" element={<EmailVerify/>}/>
          </Routes>
     </BrowserRouter>
    </AppContext.Provider>

  );
}

export default App;
