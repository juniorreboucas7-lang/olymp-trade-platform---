import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyMapProps {
  properties: any[];
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ properties }) => {
  const defaultCenter: [number, number] = [-3.4168, -54.7036]; // Default to a region in Pará, Brazil (typical for 2F)

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border-2 border-2f-gold shadow-lg">
      <MapContainer center={defaultCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map(prop => (
          prop.latitude && prop.longitude && (
            <Marker key={prop.id} position={[prop.latitude, prop.longitude]}>
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold text-2f-green">{prop.name}</h4>
                  <p className="text-xs text-gray-600">Área: {prop.total_area} ha</p>
                  <p className="text-xs text-gray-600">CAR: {prop.car_number}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};
