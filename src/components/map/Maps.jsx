import React, { useEffect, useContext } from 'react';
import {Card } from 'react-bootstrap'
import Mapping from './Mapping';
import { AppContext } from '../context/appContext';
import './Map.css'
import io from "socket.io-client";

// Spinner for loading animation
import ClipLoader from "react-spinners/ClipLoader";


import qs from "qs";
import { createBrowserHistory } from "history";

const Maps = () => {

  // declaring variables
  let Animal, newDataAnimal;

  const { 
    rhinoName, animalData, setRhinoName, setAnimalData, isMaploading, setIsMaploading,
    setNewData, newData } =useContext(AppContext);

    // connect the front end and backend via socket.io-client
  const socket = io.connect("https://animaltracking.patrickmamsery.works/api/socket");

  //getting any new data that be posted to the server
  useEffect(() => {
    socket.on("newGps", (data) => {
      setNewData(data)
    })
  }, [socket, setNewData])

  const isEmpty = (obj) =>{
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }
    return true;
  }

  // getting the current animal name that is being tracked
  const history = createBrowserHistory();
  useEffect(() => {
    const filterParams = history.location.search.substring(1);
    const filtersFromParams = qs.parse(filterParams);
    if (filtersFromParams.rhinoName) {
      setRhinoName(String(filtersFromParams.rhinoName));
    }
  }, [history.location.search, setRhinoName]);

  useEffect(() => {
    history.push(`?rhinoName=${rhinoName}`);
  }, [rhinoName, history]);

  useEffect(() => {
    const fetchData = async () => {
      setIsMaploading(true);
      getAnimalData(
        (data) => {
          setAnimalData(data);
            setIsMaploading(false);
        },
        (error) => {
          console.log(error);
          setIsMaploading(false);
        }
      )
    }
    fetchData();
  }, [setAnimalData, setIsMaploading]);

  const getAnimalData = async (cbsf, cbef) => {
    try {
      const response = await fetch("https://animaltracking.patrickmamsery.works/api/v1/getdata",{
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      cbsf(data.data);
    } catch (error) {
      cbef(error);
    }
  };

  if(!isMaploading){
  // single animal tracking current state before any update;
    if(isEmpty(newData)){
      Animal = animalData.filter(d => d.objectName === rhinoName).map((datum, _id) => {
        return (
          {
            "title": datum.objectName,
            "latitude": datum.latitude,
            "longitude": datum.longitude,
            "speed": datum.speed,
            "altitude": datum.altitude,
            "MeasureDate": datum.createAt
          }
        )
      })
    }
    //after update........
    else{
       newDataAnimal = {
        "title": newData.objectName,
        "latitude": newData.latitude,
        "longitude": newData.longitude,
        "speed": newData.speed,
        "altitude": newData.altitude,
         "MeasureDate": newData.MeasureDate
      }
    }
  } 
  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className='m-0'>Map Tracking {rhinoName}</h1>
              </div>
            </div>
          </div>
          <section className='content'>
            <div className='container-fluid'>
            <Card className="text-center">
              <Card.Body style={{height: "500px"}} >
                  {
                      !isMaploading ? <Mapping Animal={Animal} newDataAnimal= {newDataAnimal}/>: <ClipLoader color={"#123abc"} loading={isMaploading} size={150} />
                    }
                  </Card.Body>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default Maps;