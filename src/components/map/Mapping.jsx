import React, { useRef, useEffect, useContext, useState } from "react";
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";
import "./Map.css";
import {AppContext} from '../context/appContext'

mapboxgl.accessToken ="pk.eyJ1IjoiZ29kd2luLW1ha3lhbyIsImEiOiJjbGcxdnBobTAxcHA0M25xeWRycWhldDRhIn0.K6dLSpAqVOmeX8X4205dVQ";


const Map = ({ Animal, newDataAnimal }) => {
  let Data;
  let title;
  let latitude;
  let longitude;
  let speed;
  let altitude;
   const latestDateTimesByDate = {};
  const { setCoordinat, coordinat } = useContext(AppContext);

  const isEmpty = (obj) => {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }
    return true;
  }
  if(!isEmpty(Animal)){
    Animal.forEach(di => {
         // Use the date part of the date time as a key/ property name on the latestDateTimesByDate object
      let dateKey = di.MeasureDate.substring(0, 10);
      // If that date key doesnt exist or the current MeasureDate  is gretaer than the recorded one
      if (!latestDateTimesByDate[dateKey] || di.MeasureDate > latestDateTimesByDate[dateKey].MeasureDate) {
        latestDateTimesByDate[dateKey] = di;
      }
    });
    // if you need it as an array then add each of the date properties to an element of an array
    const finalArray = [];
    Object.keys(latestDateTimesByDate).forEach(key => finalArray.push(latestDateTimesByDate[key]));
    finalArray.map(data => {
      return (
        title = data.title,
        latitude = data.latitude,
        longitude = data.longitude,
        speed = data.speed,
        altitude = data.altitude
      )
    })
  }
  else{
    if(!isEmpty(newDataAnimal)){
      title = newDataAnimal.title;
      latitude = newDataAnimal.latitude;
      longitude = newDataAnimal.longitude;
      speed = newDataAnimal.speed;
      altitude = newDataAnimal.altitude;
    }
  }
    Data = {
      "features": [
        {
          "type": "Feature",
          "properties": {
            "description": `<p>
                        <strong>Target: ${title}</strong><br/> 
                        <strong>Location: ${longitude}</strong>, 
                        <strong>${latitude}</strong>,<br/> 
                        <strong>Speed: ${speed}m/s</strong><br/> 
                        <strong>Altitude: ${altitude}m</strong>
            </p>`
          },
          "geometry": {
            "coordinates": [longitude, latitude],
            "type": "Point"
          }
        }
      ],
      "type": "FeatureCollection"
    } 
useEffect(() => {
  setCoordinat([longitude, latitude])
}, [longitude, latitude, setCoordinat]);

  const mapContainerRef = useRef(null);

  // map style
  const [value, setValue] = useState("satellite-streets-v11");
    const onChangeValue = (e) => {
      // e.preventDefault()
      setValue(e.target.value);
    }
  
  
  //Initialize map when component mounts
  useEffect(() => {
    setTimeout(()=>{
      const map = new mapboxgl.Map({
      container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v11",
        center: coordinat,
      zoom: 8,
    });

      
    // setMap(map);

    map.addControl(new mapboxgl.FullscreenControl());

    map.on("load",   () => {
      //Add an image to use as a custom marker
          map.addSource("places", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: Data.features,
            },
          });
          //Add a symbol layer
           map.addLayer({
             id: 'places',
             type: 'circle',
             source: 'places',
             paint: {
               'circle-color': '#4264fb',
               'circle-radius': 10,
               'circle-stroke-width': 2,
               'circle-stroke-color': '#ffffff'
             }
           });


      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      map.on('mouseenter', 'places', (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
      });

      map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });
    //Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.setStyle('mapbox://styles/mapbox/' + value);

    //Clean up on unmount
    return () => map.remove();
    }, 5000)
 
  }, [Data.features, coordinat, value]);
  
  const MapChoice = ()=>{
    return(
      <div id="menu" className="menu-map-style" >
        <input 
          type="radio" 
          name="satellite" 
          value="satellite-streets-v11" 
          checked={value === "satellite-streets-v11"} 
          onChange={onChangeValue} 
        />
        <label htmlFor="satellite-streets-v11">satellite</label>
        <input 
          type="radio" 
          name="light" 
          value="light-v10" 
          checked={value === "light-v10"} 
          onChange={onChangeValue} 
        />
        <label htmlFor="light-v10">light</label>
        <input 
          type="radio" 
          name="dark" 
          value="dark-v10" 
          checked={value === "dark-v10"} 
          onChange={onChangeValue} 

        />
        <label htmlFor="dark-v10">dark</label>
        <input 
          type="radio" 
          name="streets" 
          value="streets-v11" 
          checked={value === "streets-v11"} 
          onChange={onChangeValue} 
        />
        <label htmlFor="streets-v11">streets</label>
        <input 
        type="radio" 
        name="outdoors" 
        value="outdoors-v11" 
        checked={value === "outdoors-v11"} 
        onChange={onChangeValue} 
        />
        <label htmlFor="outdoors-v11">outdoors</label>
      </div>
    )
  }

  return (
    <>
      <MapChoice/>
      <div className="map-container" ref={mapContainerRef} />
    </>
  );

};

export default Map;