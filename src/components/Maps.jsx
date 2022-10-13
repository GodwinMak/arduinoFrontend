import React, { useEffect, useContext } from 'react';
import {  Container,  Card } from 'react-bootstrap'
import Mapping from './Mapping';
import { AppContext } from './context/appContext';
import './Map.css'
import io from "socket.io-client";


import qs from "qs";
import { createBrowserHistory } from "history";

const Maps = () => {

  // declaring variables
  
  let Animal, newDataAnimal;

  const { 
    rhinoName, animalData, setRhinoName, setAnimalData, isMaploading, setIsMaploading,
    setNewData, newData } =useContext(AppContext);

    // connect the front end and backend via socket.io-client
  const socket = io.connect("http://localhost:5003/api/socket");

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

console.log(isEmpty(newData));


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
      const response = await fetch("https://gpsarduinoproject.herokuapp.com/api/v1/getdata", {
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

  
  console.log(isMaploading)


  // single animal tracking current state before any update;
  if(!isMaploading){
    if(isEmpty(newData)){
      Animal = animalData.filter(d => d.objectName === rhinoName).map((datum, _id) => {
        return (
          {
            "title": datum.objectName,
            "latitude": datum.latitude,
            "longitude": datum.longitude,
            "MeasureDate": datum.createAt
          }
        )
      })
    }
    else{
       newDataAnimal = {
        "title": newData.objectName,
        "latitude": newData.latitude,
        "longitude": newData.longitude,
         "MeasureDate": newData.MeasureDate
      }
    }
  } 

  console.log(Animal)
  // console.log(newDataAnimal)

  return (
    <Container>
        <div>
        <h3>Tranking {rhinoName} </h3>
              <Card className="text-center">
                  <Card.Body style={{height: "500px"}} >
                    {
                      !isMaploading ? <Mapping Animal={Animal} newDataAnimal= {newDataAnimal}/>: <div>map is loading</div>
                    }
                  </Card.Body>
              </Card>
        </div>
    </Container>
  )
}

export default Maps;