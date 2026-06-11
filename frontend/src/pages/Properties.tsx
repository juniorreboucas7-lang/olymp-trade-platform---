import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { MapPin, Plus, Search, Home, Maximize, FileText, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center);
  return null;
};

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-2.4430, -54.7084]); // Santarém
  const [currentProp, setCurrentProp] = useState<any>({
    name: '', total_area: 0, city: '', owner_id: '', coordinates: '-2.4430, -54.7084', land_situation: 'Regular'
  });

  const fetchData = async () => {
    try {
      const [propRes, cltRes] = await Promise.all([
        api.get('/properties/'),
        api.get('/clients/')
      ]);
      setProperties(propRes.data);
      setClients(cltRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...currentProp, total_area: parseFloat(currentProp.total_area), owner_id: parseInt(currentProp.owner_id) };
      if (currentProp.id) {
        await api.put(`/properties/${currentProp.id}`, data);
      } else {
        await api.post('/properties/', data);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert('Erro ao salvar propriedade');
    }
  };

  const filteredProperties = properties.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOwnerName = (id: number) => clients.find(c => c.id === id)?.name || 'N/A';

  const focusOnMap = (coords: string) => {
    try {
      const [lat, lng] = coords.split(',').map(c => parseFloat(c.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter([lat, lng]);
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Propriedades</h1>
          <p className="text-gray-500">Controle de áreas, documentos técnicos e situação fundiária.</p>
        </div>
        <button
          onClick={() => { setCurrentProp({ name: '', total_area: 0, city: '', owner_id: '', coordinates: '-2.4430, -54.7084', land_situation: 'Regular' }); setShowModal(true); }}
          className="bg-consultoria-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition shadow-md"
        >
          <Plus size={20} />
          Nova Propriedade
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome da fazenda ou proprietário..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-consultoria-green outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => focusOnMap(prop.coordinates)}
                className="p-4 border border-gray-100 rounded-xl hover:border-consultoria-green cursor-pointer transition bg-gray-50/50 group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 group-hover:text-consultoria-green">{prop.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-1 bg-white border border-gray-200 rounded uppercase">{prop.land_situation}</span>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex items-center gap-2"><MapPin size={14} /> {prop.city}</div>
                  <div className="flex items-center gap-2"><Maximize size={14} /> {prop.total_area} ha</div>
                  <div className="flex items-center gap-2 font-medium text-gray-700 mt-2">Proprietário: {getOwnerName(prop.owner_id)}</div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setCurrentProp(prop); setShowModal(true); }} className="text-xs text-blue-600 font-bold hover:underline">Editar</button>
                  <button className="text-xs text-green-600 font-bold hover:underline">Documentos</button>
                </div>
              </div>
            ))}
            {filteredProperties.length === 0 && (
              <div className="text-center py-10 text-gray-400">Nenhuma propriedade encontrada.</div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-2 h-[500px] rounded-xl overflow-hidden border border-gray-100 z-0 relative">
             <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md border border-gray-200 flex items-center gap-2 pointer-events-none">
                <Navigation size={16} className="text-consultoria-green" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Visualização Geoespacial</span>
             </div>
             <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <ChangeView center={mapCenter} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredProperties.map(prop => {
                   const coords = prop.coordinates.split(',').map((c: string) => parseFloat(c.trim()));
                   if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                     return (
                        <Marker key={prop.id} position={[coords[0], coords[1]] as any}>
                          <Popup>
                            <div className="font-sans">
                              <h4 className="font-bold text-consultoria-green">{prop.name}</h4>
                              <p className="text-xs text-gray-600">{prop.total_area} hectares</p>
                              <p className="text-xs text-gray-600">{prop.city}</p>
                            </div>
                          </Popup>
                        </Marker>
                     );
                   }
                   return null;
                })}
             </MapContainer>
          </div>
        </div>
      </div>

      {/* Footer Branding Info */}
      <div className="text-center py-4 text-[10px] text-gray-400 border-t border-gray-100 mt-10">
          Francisco Rebouças Junior – Téc. em Agrimensura, Meio Ambiente e Agricultura – CFT 00348436203 – (93) 99185-3915
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="bg-consultoria-green p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">{currentProp.id ? 'Editar Propriedade' : 'Nova Propriedade'}</h3>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Fazenda/Área</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentProp.name}
                    onChange={(e) => setCurrentProp({...currentProp, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proprietário</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentProp.owner_id}
                    onChange={(e) => setCurrentProp({...currentProp, owner_id: e.target.value})}
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área Total (ha)</label>
                  <input
                    type="number" step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentProp.total_area}
                    onChange={(e) => setCurrentProp({...currentProp, total_area: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Município</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentProp.city}
                    onChange={(e) => setCurrentProp({...currentProp, city: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coordenadas (Lat, Lng)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentProp.coordinates}
                    onChange={(e) => setCurrentProp({...currentProp, coordinates: e.target.value})}
                    placeholder="-2.4430, -54.7084"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Situação Fundiária</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentProp.land_situation}
                    onChange={(e) => setCurrentProp({...currentProp, land_situation: e.target.value})}
                  >
                    <option>Regular</option>
                    <option>Em Regularização</option>
                    <option>Posse</option>
                    <option>Título Definitivo</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition">Cancelar</button>
                <button type="submit" className="bg-consultoria-green text-white px-8 py-2 rounded-lg font-bold shadow-lg hover:bg-opacity-90 transition">Salvar Propriedade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
