import { useEffect, useRef, useState } from 'react';
import * as tt from '@tomtom-international/web-sdk-maps'
import * as ttapi from '@tomtom-international/web-sdk-services'
import './App.css';
import '@tomtom-international/web-sdk-maps/dist/maps.css'

const App = () =>{
  const mapElement = useRef()
  const[map, setMap] = useState({})
  const [longitude, setLongitude]= useState(-57.5458946)
  const [latitude, setLatitude]= useState(-38.0420353)

  const convertToPoints = (lngLat) => {
    return{
      point:{
        latitude: lngLat.lat,
        longitude: lngLat.lng
      }
    }
  }

  const addDeliveryMarker = (lngLat, map) => {
    const element = document.createElement('div')
    element.className = 'marker-delivery'
    new tt.Marker({
      element: element
    })
    .setLngLat(lngLat)
    .addTo(map)
  }

  useEffect(() =>{
    const origin = {
      lng: longitude,
      lat: latitude,
    }

    const destinations = []

    let map = tt.map({
      key: 'kdZtBKzO9Z1ih7uVApCyfuI0GLslsBEm',
      container: mapElement.current,
      stylesVisibility: {
        trafficIncidents: true,
        trafficFlow: true,
      }, 
      center: [longitude, latitude],
      zoom: 14
  })
    setMap(map)

    const addMarker = () => {
      const popupOffset = {
        bottom: [0, -25]
      }
      const popup = new tt.Popup({ offset:popupOffset }).setHTML('This is you!')
      const element = document.createElement('div')
      element.className= 'marker'

      const marker = new tt.Marker({
        draggable: true,
        element: element,
      })
      .setLngLat([longitude, latitude])
      .addTo(map)

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat()
        setLongitude(lngLat.lng)
        setLatitude(lngLat.lat)
      })

      marker.setPopup(popup).togglePopup()
    }
    addMarker()

    const sortDestinations = (locations) => {
      const pointsForDestinations = locations.map((destination) => {
        return convertToPoints(destination)
      })

        const callParameters = {
          key: 'kdZtBKzO9Z1ih7uVApCyfuI0GLslsBEm',
          destinations: pointsForDestinations,
          origin: [convertToPoints(origin)]
        }
      
      return new Promise((resolve, reject) =>{
        ttapi.services
          .matrixRouting(callParameters)
        .then((matrixAPIResults) => {
          const results = matrixAPIResults.matrix[0]
          const resultsArray = results.map((result, index) =>{
            return{
              location: locations[index],
              drivingtime: result.response.routeSummary.travelTimeInSeconds,
            }
          })
          resultsArray.sort((a, b) => {
            return a.drivingtime - b.drivingtime
          })
          const sortLocations = resultsArray.map((result) =>{
            return result.location
          })
          resolve(sortLocations)
        })

          })
    }


    map.on('click', (e) =>{
      destinations.push(e.lngLat)
      addDeliveryMarker(e.lngLat, map)
    })

    return () => map.remove()
  }, [longitude, latitude])

  return (
    <>
      {map && <div className="app">
        <div ref={mapElement} className='map'/>
        <div className="search=-bar">
          <h1>¿Where to?</h1>
          <input 
            type='text'
            id='longitude'
            className='longitude'
            placeholder='Put in Longitude'
            onChange= {(e) => {setLongitude(e.target.value)}}
            />
          <input 
            type='text'
            id='latitude'
            className='latitude'
            placeholder='Put in Latitude'
            onChange={(e) => {setLatitude(e.target.value)}}/>
        </div>
      </div>}
    </>
  );
}

export default App;
