/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import mapboxgl from '!mapbox-gl';
// import '../../../style.css'


mapboxgl.accessToken ="pk.eyJ1IjoiZ29kd2luLW1ha3lhbyIsImEiOiJjbGcxdnBobTAxcHA0M25xeWRycWhldDRhIn0.K6dLSpAqVOmeX8X4205dVQ";


const Map = ({filteredData, dateOnSlider}) => {
  const viewAnimalData = React.useMemo(()=> {
    if(filteredData){
       return{
            "type": "FeatureCollection",
        "features": filteredData.map(data =>{
            return{
                 "type": "Feature",
                "properties": {
                    "species": data.species,
                    "specieID": data.id,
                    "id": data.speciesId,
                    "density": data.density,
                    "time": data.time.slice(0, 10)
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [data.location.longitude, data.location.latitude]
                },
            }
        })
        }
    }
       
    }, [filteredData]);

    const mapContainer = React.useRef(null);

     React.useEffect(() => {
       const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [33.92388, -2.5894],
        zoom: 5,
        });

        if(viewAnimalData && dateOnSlider){

          map.on('load', ()=>{
            map.addSource('animals', {
                type: 'geojson',
                data: viewAnimalData,
            });
            let filterDay = ['==', ['string', ['get', 'time']], dateOnSlider];

             map.addLayer({
                id: 'animal-location-heat-map-layer',
                type: 'heatmap',
                source: 'animals',
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
                'filter': ['all', filterDay]
            });

            map.setFilter('animal-location-heat-map-layer', ['==', ['string', ['get', 'time']], dateOnSlider]);
            map.addLayer(
                {
                    id: 'animals-point',
                    type: 'circle',
                    source: 'animals',
                    minzoom: 14,
                    paint: {
                    // increase the radius of the circle as the zoom level and dbh value increases
                    'circle-radius': {
                        property: 'density',
                        type: 'exponential',
                        stops: [
                        [{ zoom: 15, value: 1 }, 5],
                        [{ zoom: 15, value: 62 }, 10],
                        [{ zoom: 22, value: 1 }, 20],
                        [{ zoom: 22, value: 62 }, 50]
                        ]
                    },
                    'circle-color': {
                        property: 'density',
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

            map.on('click', 'animals-point', (event) => {
                new mapboxgl.Popup()
                    .setLngLat(event.features[0].geometry.coordinates)
                    .setHTML(`<strong>DBH:</strong> ${event.features[0].properties.density}`)
                    .addTo(map);
            });
        })

        }

    }, [dateOnSlider, viewAnimalData])
    

  return (
    <>
        <div ref={mapContainer} className="map-container" />
    </>
  )
}

export default Map