import { Map } from 'react-map-gl';

export default function Mapbox() {
  return (
    <Map
      mapboxAccessToken="pk.eyJ1Ijoic2ZoYWRtaW4iLCJhIjoiY2t6bWZoemliMXBmbDJucGFjcHBqcGNpeiJ9.hTActdDjpLc-9IEf-EPnPA"
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
        scrollZoom: false,
        attributionControl: false,
      }}
      style={{ width: '100%', height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}
