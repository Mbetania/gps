import { useEffect, useRef, useState } from 'react';
import * as tt from '@tomtom-international/web-sdk-maps'
import './App.css';
import '@tomtom-international/web-sdk-maps/dist/maps.css'

const App = () =>{
  const mapElement = useRef()
  const[map, setMap] = useState({})
  const [longitude, setLongitude]= useState(-57.5458946)
  const [latitude, setLatitude]= useState(-38.0420353)

  useEffect(() =>{
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
      const popup = new tt.Popup({ offeset:popupOffset }).setHTML('This is you!')
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
