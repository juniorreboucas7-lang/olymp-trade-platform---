import React, { useState, useEffect } from 'react';
import api from './api';
import { Plus, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

export const Services: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    property_id: '',
    type: 'CAR',
    status: 'Pendente',
    technical_responsible: '',
    value: '',
    deadline: ''
  });

  useEffect(() => {
    fetchServices();
    fetchClients();
    fetchProperties();
  }, []);

  const fetchServices = async () => {
    const res = await api.get('/services/');
    setServices(res.data);
  };

  const fetchClients = async () => {
    const res = await api.get('/clients/');
    setClients(res.data);
  };

  const fetchProperties = async () => {
    const res = await api.get('/properties/');
    setProperties(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/services/', formData);
    setShowForm(false);
    fetchServices();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Concluído': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> {status}</span>;
      case 'Em Andamento': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12}/> {status}</span>;
      default: return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle size={12}/> {status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-700">Gerenciamento de Serviços Técnicos</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-2f-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 border-b-2 border-2f-gold"
        >
          <Plus size={20} />
          Abrir Novo Serviço
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Serviço</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Cliente / Propriedade</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Status</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Valor</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-2f-green">{service.type}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {clients.find(c => c.id === service.client_id)?.name || 'Cliente'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {properties.find(p => p.id === service.property_id)?.name || 'Propriedade'}
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(service.status)}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-700">R$ {service.value?.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/reports/proposal/${service.id}`, '_blank')}
                    className="flex items-center gap-1 text-2f-green hover:underline font-bold"
                  >
                    <FileText size={16}/> Proposta
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-[600px] shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-2f-green mb-6">Novo Serviço / Ordem de Trabalho</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <select
                    className="w-full p-2 border rounded text-black"
                    value={formData.client_id}
                    onChange={e => setFormData({...formData, client_id: e.target.value})}
                    required
                  >
                    <option value="">Selecione...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Propriedade</label>
                  <select
                    className="w-full p-2 border rounded text-black"
                    value={formData.property_id}
                    onChange={e => setFormData({...formData, property_id: e.target.value})}
                    required
                  >
                    <option value="">Selecione...</option>
                    {properties.filter(p => p.owner_id == formData.client_id).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
                  <select
                    className="w-full p-2 border rounded text-black"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="CAR">CAR</option>
                    <option value="CCIR">CCIR</option>
                    <option value="SIGEF">SIGEF</option>
                    <option value="Georreferenciamento">Georreferenciamento</option>
                    <option value="Licenciamento Ambiental">Licenciamento Ambiental</option>
                    <option value="Topografia">Topografia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Serviço</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded text-black"
                    value={formData.value}
                    onChange={e => setFormData({...formData, value: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500">Cancelar</button>
                <button type="submit" className="bg-2f-green text-white px-6 py-2 rounded-lg font-bold border-b-2 border-2f-gold">Criar Serviço</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
