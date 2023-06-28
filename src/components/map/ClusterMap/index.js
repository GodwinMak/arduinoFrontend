/* eslint-disable import/no-webpack-loader-syntax */
import React, {useEffect, useRef, useMemo} from 'react'
import mapboxgl from '!mapbox-gl';
import animalData from '../../../assets/animalData8.json'
// import {MapboxStyleSwitcherControl} from 'mapbox-gl-style-switcher';
// import "mapbox-gl-style-switcher/styles.css";
// import '../../style.css'
import { Card } from 'react-bootstrap';

mapboxgl.accessToken ="pk.eyJ1IjoiZ29kd2luLW1ha3lhbyIsImEiOiJjbGcxdnBobTAxcHA0M25xeWRycWhldDRhIn0.K6dLSpAqVOmeX8X4205dVQ";

const ClusterMap = () => {
    const mapContainer = useRef(null);

    const viewAnimalData =useMemo(()=> {
        return {
        "type": "FeatureCollection",
        "features": animalData.map(data =>{
            return{
                 "type": "Feature",
                "properties": {
                    "species": data.species,
                    "specieID": data.id,
                    "id": data.speciesId,
                    "time": data.time
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [data.location.longitude, data.location.latitude]
                },
            }
        })
    }}, [])

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            center: [34.2184097, -2.1613585],
            zoom: 8
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
        // };
        // map.addControl(new MapboxStyleSwitcherControl(styles, options), 'bottom-left');

        const addDataLayer =()=>{
        map.addSource('animals', {
        type: 'geojson',
        data: viewAnimalData,
        cluster: true,
        clusterMaxZoom: 14, 
        clusterRadius: 50 
        });

        map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'animals',
        filter: ['has', 'point_count'],
        paint: {
        'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1'
        ],
        'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
        ]
        }
        });

        map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'animals',
        filter: ['has', 'point_count'],
        layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
        }
        });

        map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'animals',
        filter: ['!', ['has', 'point_count']],
        paint: {
        'circle-color': '#11b4da',
        'circle-radius': 8,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
        }
        });
        }
 
        map.on('load', () => {
            addDataLayer()
        });

        map.on('style.load', () => {
        // Remove existing layers and sources
            if (map.getSource('animals')) {
                map.removeSource('animals');
            }
            if (map.getSource('clusters')) {
                map.removeSource('clusters');
            }
            if (map.getSource('cluster-count')) {
            map.removeSource('cluster-count');
            }
            if (map.getSource('unclustered-point')) {
            map.removeSource('unclustered-point');
            }
            

            // Add the layers and sources with the updated style
            addDataLayer();
        });
        // inspect a cluster on click
        map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('animals').getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
        if (err) return;

        map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
        });
        }
        );
        });

        map.on('click', 'unclustered-point', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const name = e.features[0].properties.species;
            const id =
            e.features[0].properties.id;
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
            `name is: ${name}<br/> and specie id is ${id} `
            )
            .addTo(map);
        });

        map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
        });
      return () => {
      }
    }, [viewAnimalData])
    
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

export default ClusterMap