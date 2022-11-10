import React, { useRef, useEffect, useContext } from "react";
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";
import "./Map.css";
import {AppContext} from '../context/appContext'

mapboxgl.accessToken ="pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

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
                        <strong>${title}</strong> 
                        with at position <strong>${longitude}</strong> longitude, 
                        <strong>${latitude}</strong> latitude 
                        at a speed of <strong>${speed}m/s</strong> 
                        at alitude of <strong>${altitude}m</strong>
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
      // map.loadImage(
        // "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        //  (error, image) => {
          // if (error) throw error;
          // map.addImage("custom-marker", image);
          //Add a GeoJSON source with multiple points
      
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

          // map.addLayer({
          //   id: "points",
          //   type: "symbol",
          //   source: "points",
          //   layout: {
          //     "icon-image": "custom-marker",
          //     //get the title name from the source's "title" property
          //     "text-field": ["get", "title"],
          //     "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          //     "text-offset": [0, 1.25],
          //     "text-anchor": "top",
          //   },
          // });
        // }
      // );

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

    const layerList = document.getElementById('menu');
    const inputs = layerList.getElementsByTagName('input');


      for (const input of inputs) {
        input.onclick = (layer) => {
          // map.remove();
          const layerId = layer.target.id;
          map.setStyle('mapbox://styles/mapbox/' + layerId);
        };
      }

    //Clean up on unmount
    return () => map.remove();
    }, 5000)
 
  }, [Data.features, coordinat]);
  
  const MapChoice = ()=>{
    return(
      <div id="menu" className="menu-map-style">
        <input id="satellite-streets-v11" type="radio" name="rtoggle" value="satellite" defaultChecked={true} />
        <label htmlFor="satellite-streets-v11">satellite</label>
        <input id="light-v10" type="radio" name="rtoggle" value="light" />
        <label htmlFor="light-v10">light</label>
        <input id="dark-v10" type="radio" name="rtoggle" value="dark" />
        <label htmlFor="dark-v10">dark</label>
        <input id="streets-v11" type="radio" name="rtoggle" value="streets" />
        <label htmlFor="streets-v11">streets</label>
        <input id="outdoors-v11" type="radio" name="rtoggle" value="outdoors" />
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