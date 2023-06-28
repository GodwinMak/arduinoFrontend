/* eslint-disable import/no-webpack-loader-syntax */
import React, { useEffect, useMemo, useRef} from 'react'
import HeatMapAnimalData from '../../assets/dummy1.json'
import mapboxgl from '!mapbox-gl';
import treeData from '../../assets/trees.geojson'
// import '../../style.css'
// import {MapboxStyleSwitcherControl} from 'mapbox-gl-style-switcher';
import {Card } from 'react-bootstrap'


mapboxgl.accessToken ="pk.eyJ1IjoiZ29kd2luLW1ha3lhbyIsImEiOiJjbGcxdnBobTAxcHA0M25xeWRycWhldDRhIn0.K6dLSpAqVOmeX8X4205dVQ";


const HeatMap = () => {
    console.log(treeData.features);
    const viewAnimalData = useMemo(()=> {
        return{
            "type": "FeatureCollection",
        "features": HeatMapAnimalData.map(data =>{
            return{
                 "type": "Feature",
                "properties": {
                    "species": data.species,
                    "specieID": data.id,
                    "id": data.speciesId,
                    "density": data.density,
                    "time": data.time
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [data.location.longitude, data.location.latitude]
                },
            }
        })
        }
    }, []);

    console.log(viewAnimalData)


    const mapContainer = useRef(null);
    // const [lng, setLng] = useState(34.2184097);
    // const [lat, setLat] = useState(-2.1613585);
    useEffect(() => {
       const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-79.999732, 40.4374],
        zoom: 9,
        });

        // const styles = [
        //     {
        //         title: "Dark",
        //         uri:"mapbox://styles/mapbox/dark-v11"
        //     },
        //     {
        //         title: "Light",
        //         uri:"mapbox://styles/mapbox/light-v9"
        //     },
        //     {
        //         title: "Satellite Street",
        //         uri:"mapbox://styles/mapbox/satellite-streets-v12"
        //     },
        //     {
        //         title: "Satellite",
        //         uri:"mapbox://styles/mapbox/satellite-v9"
        //     },
        //     {
        //         title: 'Street',
        //         uri: "mapbox://styles/mapbox/streets-v12"
        //     },
        //     {
        //         title: 'Outdoors',
        //         uri: "mapbox://styles/mapbox/outdoors-v12"
        //     },
        //     {
        //         title: 'Navigation Day',
        //         uri: "mapbox://styles/mapbox/navigation-day-v1"
        //     },
        //     {
        //         title: 'Navigation Night',
        //         uri: "mapbox://styles/mapbox/navigation-night-v1"
        //     },
        // ];

        // const options = {
        //     defaultStyle: "Navigation Night",
        //     eventListeners: {
        //           onOpen: (event) => false,
        //           onSelect: (event) => false,
        //           onChange: (event, style) => false,
        //     }
        // }

        // map.addControl(new MapboxStyleSwitcherControl(styles, options), 'bottom-left');


        map.on('load', ()=>{
            map.addSource('trees', {
                type: 'geojson',
                data: treeData,
            });

             map.addLayer({
                id: 'animal-location-heat-map-layer',
                type: 'heatmap',
                source: 'trees',
                maxzoom: 15,
                paint: {
                    'heatmap-intensity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0,
                    1,
                    15,
                    3,
                    ],
                    'heatmap-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0,
                    2,
                    15,
                    20,
                    ],
                    'heatmap-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7,
                    1,
                    10,
                    0.5,
                    13,
                    0.2,
                    15,
                    0.1,
                    16,
                    0,
                    ],
                },
            });
            map.addLayer(
                {
                    id: 'trees-point',
                    type: 'circle',
                    source: 'trees',
                    minzoom: 14,
                    paint: {
                    // increase the radius of the circle as the zoom level and dbh value increases
                    'circle-radius': {
                        property: 'dbh',
                        type: 'exponential',
                        stops: [
                        [{ zoom: 15, value: 1 }, 5],
                        [{ zoom: 15, value: 62 }, 10],
                        [{ zoom: 22, value: 1 }, 20],
                        [{ zoom: 22, value: 62 }, 50]
                        ]
                    },
                    'circle-color': {
                        property: 'dbh',
                        type: 'exponential',
                        stops: [
                        [0, 'rgba(236,222,239,0)'],
                        [10, 'rgb(236,222,239)'],
                        [20, 'rgb(208,209,230)'],
                        [30, 'rgb(166,189,219)'],
                        [40, 'rgb(103,169,207)'],
                        [50, 'rgb(28,144,153)'],
                        [60, 'rgb(1,108,89)']
                        ]
                    },
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': {
                        stops: [
                        [14, 0],
                        [15, 1]
                        ]
                    }
                    }
                },
                'waterway-label'
            );

                map.on('click', 'trees-point', (event) => {
                    new mapboxgl.Popup()
                        .setLngLat(event.features[0].geometry.coordinates)
                        .setHTML(`<strong>DBH:</strong> ${event.features[0].properties.dbh}`)
                        .addTo(map);
                });

        })
      
    
      return () => {
      }
    }, [])
    
  return (
    <div className="content-wrapper">
        {/* Content Wrapper. Contains page content */}
        <div className="content-header">
            <section className="content">
                <div className='container-fluid'>
                    <Card className="text-center">
              <Card.Body style={{height: "500px", width: '100%'}} >
                    <div ref={mapContainer} className="map-container" />
                  
                  </Card.Body>
              </Card>
                </div>
            </section>{/* /.container-fluid */}
        </div>
        {/* /.content */}
        {/* /.content-wrapper */}

    </div>
  )
}

export default HeatMap