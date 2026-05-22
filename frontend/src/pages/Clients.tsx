import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Plus, User, Phone, Mail, MapPin, MoreVertical, Edit, Trash } from 'lucide-react';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentClient, setCurrentClient] = useState<any>({
    name: '', cpf_cnpj: '', email: '', phone: '', city: '', state: ''
  });

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients/');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentClient.id) {
        await api.put(`/clients/${currentClient.id}`, currentClient);
      } else {
        await api.post('/clients/', currentClient);
      }
      setShowModal(false);
      setCurrentClient({ name: '', cpf_cnpj: '', email: '', phone: '', city: '', state: '' });
      fetchClients();
    } catch (error) {
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Clientes</h1>
          <p className="text-gray-500">Cadastre e gerencie os clientes da 2F Consultoria.</p>
        </div>
        <button
          onClick={() => { setCurrentClient({ name: '', cpf_cnpj: '', email: '', phone: '', city: '', state: '' }); setShowModal(true); }}
          className="bg-consultoria-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition shadow-md"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF/CNPJ..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-consultoria-green outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3 pl-2">Cliente</th>
                <th className="pb-3">Contato</th>
                <th className="pb-3">Localização</th>
                <th className="pb-3">CPF/CNPJ</th>
                <th className="pb-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 text-consultoria-green rounded-full flex items-center justify-center font-bold">
                        {client.name[0]}
                      </div>
                      <span className="font-medium text-gray-800">{client.name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1 text-gray-600"><Phone size={14} /> {client.phone}</div>
                      <div className="flex items-center gap-1 text-gray-400"><Mail size={14} /> {client.email}</div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin size={14} /> {client.city} - {client.state}
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{client.cpf_cnpj}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => { setCurrentClient(client); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                       <button onClick={async () => { if(confirm('Excluir?')) { await api.delete(`/clients/${client.id}`); fetchClients(); } }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClients.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400">Nenhum cliente encontrado.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="bg-consultoria-green p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">{currentClient.id ? 'Editar Cliente' : 'Novo Cliente'}</h3>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentClient.name}
                    onChange={(e) => setCurrentClient({...currentClient, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF / CNPJ</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentClient.cpf_cnpj}
                    onChange={(e) => setCurrentClient({...currentClient, cpf_cnpj: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentClient.email}
                    onChange={(e) => setCurrentClient({...currentClient, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentClient.phone}
                    onChange={(e) => setCurrentClient({...currentClient, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Município</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentClient.city}
                    onChange={(e) => setCurrentClient({...currentClient, city: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentClient.state}
                    onChange={(e) => setCurrentClient({...currentClient, state: e.target.value})}
                  >
                    <option value="">Selecione</option>
                    <option value="PA">Pará</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="AM">Amazonas</option>
                    <option value="TO">Tocantins</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition">Cancelar</button>
                <button type="submit" className="bg-consultoria-green text-white px-8 py-2 rounded-lg font-bold shadow-lg hover:bg-opacity-90 transition">Salvar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
