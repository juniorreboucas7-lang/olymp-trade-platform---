import React, { useState, useEffect } from 'react';
import api from './api';
import { Plus, Search, MapPin, Layers, Map as MapIcon } from 'lucide-react';
import { PropertyMap } from './PropertyMap';

export const Properties: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [formData, setFormData] = useState({
    owner_id: '',
    name: '',
    total_area: '',
    city: '',
    car_number: '',
    ccir_number: '',
    land_situation: 'Regular'
  });

  useEffect(() => {
    fetchProperties();
    fetchClients();
  }, []);

  const fetchProperties = async () => {
    const res = await api.get('/properties/');
    setProperties(res.data);
  };

  const fetchClients = async () => {
    const res = await api.get('/clients/');
    setClients(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/properties/', formData);
    setShowForm(false);
    fetchProperties();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-gray-700">Imóveis Rurais</h3>
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-2f-green shadow-sm' : 'text-gray-500'}`}
            >
              Grade
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-white text-2f-green shadow-sm' : 'text-gray-500'}`}
            >
              Mapa
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-2f-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 border-b-2 border-2f-gold"
        >
          <Plus size={20} />
          Cadastrar Propriedade
        </button>
      </div>

      {viewMode === 'map' ? (
        <PropertyMap properties={properties} />
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(prop => (
          <div key={prop.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-2f-gold transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-bold text-2f-green text-lg">{prop.name}</h4>
                <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={14}/> {prop.city}</p>
              </div>
              <div className="bg-2f-gold/10 text-2f-gold p-2 rounded-lg">
                <Layers size={20} />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Área Total:</span>
                <span className="font-bold text-gray-800">{prop.total_area} ha</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">CAR:</span>
                <span className="text-gray-800">{prop.car_number || 'Não informado'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Situação:</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">{prop.land_situation}</span>
              </div>
            </div>

            <button className="w-full py-2 text-2f-green font-bold text-sm border border-2f-green rounded-lg hover:bg-2f-green hover:text-white transition-all">
              Ver Detalhes
            </button>
          </div>
        ))}
      </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-[600px] shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-2f-green mb-6">Nova Propriedade Rural</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proprietário</label>
                <select
                  className="w-full p-2 border rounded text-black"
                  value={formData.owner_id}
                  onChange={e => setFormData({...formData, owner_id: e.target.value})}
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Propriedade</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded text-black"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área Total (ha)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full p-2 border rounded text-black"
                    value={formData.total_area}
                    onChange={e => setFormData({...formData, total_area: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Município</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded text-black"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nº do CAR</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded text-black"
                    value={formData.car_number}
                    onChange={e => setFormData({...formData, car_number: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nº do CCIR</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded text-black"
                    value={formData.ccir_number}
                    onChange={e => setFormData({...formData, ccir_number: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500">Cancelar</button>
                <button type="submit" className="bg-2f-green text-white px-6 py-2 rounded-lg font-bold border-b-2 border-2f-gold">Salvar Propriedade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
