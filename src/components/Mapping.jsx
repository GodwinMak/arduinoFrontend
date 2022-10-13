import React, { useRef, useEffect, useContext } from "react";
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";
import "./Map.css";
import {AppContext} from '../components/context/appContext'



mapboxgl.accessToken ="pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const Map = ({ Animal, newDataAnimal }) => {
  let Data;
  let title;
  let latitude;
  let longitude;
   const latestDateTimesByDate = {};
  const { setCoordinat, coordinat } = useContext(AppContext);
    // new Date(Math.max(...Animal.map(e => new Date(e.MeasureDate))));


  const isEmpty = (obj) => {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }
    return true;
  }
   
  if(!isEmpty(Animal)){
    Animal.forEach(di => {

      //   // Use the date part of the date time as a key/ property name on the latestDateTimesByDate object
      let dateKey = di.MeasureDate.substring(0, 10);
      // If that date key doesnt exist or the current MeasureDate  is gretaer than the recorded one
      if (!latestDateTimesByDate[dateKey] || di.MeasureDate > latestDateTimesByDate[dateKey].MeasureDate) {
        latestDateTimesByDate[dateKey] = di;
      }

    });
    console.log(latestDateTimesByDate);
    // if you need it as an array then add each of the date properties to an element of an array
    const finalArray = [];
    Object.keys(latestDateTimesByDate).forEach(key => finalArray.push(latestDateTimesByDate[key]));
    finalArray.map(data => {
      return (
        title = data.title,
        latitude = data.latitude,
        longitude = data.longitude
      )
    })
  }
  else{
    if(!isEmpty(newDataAnimal)){
      title = newDataAnimal.title;
      latitude = newDataAnimal.latitude;
      longitude = newDataAnimal.longitude;
    }
  }

    Data = {
      "features": [
        {
          "type": "Feature",
          "properties": {
            "title": title,
            "description": "A Game Reserve nearby Sereget National park"
          },
          "geometry": {
            "coordinates": [longitude, latitude],
            "type": "Point"
          }
        }
      ],
      "type": "FeatureCollection"
    }
  

  //     Data = {
  //       "features": [
  //         {
  //           "type": "Feature",
  //           "properties": {
  //             "title": title,
  //             "description": "A Game Reserve nearby Sereget National park"
  //           },
  //           "geometry": {
  //             "coordinates": [longitude, latitude],
  //             "type": "Point"
  //           }
  //         }
  //       ],
  //       "type": "FeatureCollection"
  //     }
  //   }
  // }
    
  

    
useEffect(() => {
  setCoordinat([longitude, latitude])
}, [longitude, latitude, setCoordinat]);




  const mapContainerRef = useRef(null);
  //Initialize map when component mounts
  useEffect(() => {
    setTimeout(()=>{
      const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
        center: coordinat,
      zoom: 8,
    });
    // setMap(map);

    map.addControl(new mapboxgl.FullscreenControl());

    map.on("load",   () => {
      //Add an image to use as a custom marker
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
         (error, image) => {
          if (error) throw error;
          map.addImage("custom-marker", image);
          //Add a GeoJSON source with multiple points
          map.addSource("points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: Data.features,
            },
          });
          //Add a symbol layer
          map.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              //get the title name from the source's "title" property
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });
        }
      );
    });

    //Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    //Clean up on unmount
    return () => map.remove();
    }, 5000)
 
  }, [Data.features, coordinat]);
  
  

  return <div className="map-container" ref={mapContainerRef} />;

};

export default Map;