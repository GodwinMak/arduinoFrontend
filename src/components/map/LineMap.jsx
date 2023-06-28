/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import mapboxgl from '!mapbox-gl';
import animalData from '../../assets/animalData8.json'
// import '../../style.css'
import { Card } from 'react-bootstrap';


mapboxgl.accessToken ="pk.eyJ1IjoiZ29kd2luLW1ha3lhbyIsImEiOiJjbGcxdnBobTAxcHA0M25xeWRycWhldDRhIn0.K6dLSpAqVOmeX8X4205dVQ";

const LineMap = () => {
    const mapContainer = React.useRef(null);

    const elephantData = animalData.filter(animal => animal.speciesId === "E001").sort((a, b) => Date.parse(a.time) - Date.parse(b.time))

            const viewAnimalData = React.useMemo(()=> {
                return{
                        "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                             "coordinates": elephantData.map(animal => {
                                return[
                                    animal.location.longitude, animal.location.latitude
                                ]
                             })
                        }
                    }] 
                }
            }, [elephantData]);
            console.log(viewAnimalData)

    React.useEffect(()=>{
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-v9',
            zoom: 0
        });

        map.on('load', async () => {
            const response = await fetch(
                'https://docs.mapbox.com/mapbox-gl-js/assets/hike.geojson'
            );
            const data = await response.json();

            // save full coordinate list for later
            const coordinates = data.features[0].geometry.coordinates;

            // start by showing just the first coordinate
            data.features[0].geometry.coordinates = [coordinates[0]];

            // add it to the map
            map.addSource('trace', { type: 'geojson', data: data });
            map.addLayer({
                'id': 'trace',
                'type': 'line',
                'source': 'trace',
                'paint': {
                'line-color': 'yellow',
                'line-opacity': 0.75,
                'line-width': 5
                }
            });

            // setup the viewport
            map.jumpTo({ 'center': coordinates[0], 'zoom': 14 });
            map.setPitch(25);

            // on a regular basis, add more coordinates from the saved list and update the map
            let i = 0;
            const timer = setInterval(() => {
                if (i < coordinates.length) {
                    data.features[0].geometry.coordinates.push(coordinates[i]);
                    map.getSource('trace').setData(data);
                    map.panTo(coordinates[i]);
                    i++;
                } else {
                    window.clearInterval(timer);
                }
            }, 10);

        })
    },[])

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

export default LineMap