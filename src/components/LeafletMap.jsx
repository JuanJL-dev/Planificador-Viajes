
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { animate: true });
  }, [center, map]);
  return null;
}

function LeafletMap({ locationData }) {
  if (!locationData) return (
    <div className="card map-card">
      <h2>Mapa de Destino</h2>
      <p style={{color: '#666'}}>Esperando ubicación...</p>
    </div>
  );

  const position = [locationData.lat, locationData.lng];

  return (
    <div className="card map-card" style={{ zIndex: 1 }}>
      <h2>Destino: {locationData.place_name.split(',')[0]}</h2>
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '350px', width: '100%', borderRadius: '8px', zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>{locationData.place_name}</Popup>
        </Marker>
        <MapUpdater center={position} />
      </MapContainer>
    </div>
  );
}

export default LeafletMap;
