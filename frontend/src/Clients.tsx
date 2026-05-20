import React, { useState, useEffect } from 'react';
import api from './api';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    cpf_cnpj: '',
    email: '',
    phone: '',
    city: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients/');
      setClients(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/clients/', formData);
      setShowForm(false);
      setFormData({ name: '', cpf_cnpj: '', email: '', phone: '', city: '' });
      fetchClients();
    } catch (err) {
      alert('Erro ao salvar cliente');
    }
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cpf_cnpj.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF/CNPJ..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-2f-green outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-2f-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-all border-b-2 border-2f-gold"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-[500px] shadow-2xl">
            <h3 className="text-xl font-bold text-2f-green mb-6">Cadastrar Novo Cliente</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded text-black"
                    value={formData.cpf_cnpj}
                    onChange={e => setFormData({...formData, cpf_cnpj: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded text-black"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded text-black"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded text-black"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-2f-green text-white px-6 py-2 rounded-lg font-bold border-b-2 border-2f-gold"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Nome</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">CPF/CNPJ</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Cidade</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{client.name}</div>
                  <div className="text-xs text-gray-500">{client.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{client.cpf_cnpj}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{client.city}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-3">
                    <button className="text-2f-green hover:text-green-700"><Edit2 size={18}/></button>
                    <button className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
