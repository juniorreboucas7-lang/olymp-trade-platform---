import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Plus, Briefcase, Calendar, DollarSign, User as UserIcon, FileText, Download, CheckCircle, Clock } from 'lucide-react';

const Services: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState<any>({
    service_type: 'Georreferenciamento', status: 'Pendente', value: 0, client_id: '', property_id: '', responsible_id: 1
  });

  const fetchData = async () => {
    try {
      const [srvRes, cltRes, propRes] = await Promise.all([
        api.get('/services/'),
        api.get('/clients/'),
        api.get('/properties/')
      ]);
      setServices(srvRes.data);
      setClients(cltRes.data);
      setProperties(propRes.data);
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
      const data = {
        ...currentService,
        value: parseFloat(currentService.value),
        client_id: parseInt(currentService.client_id),
        property_id: parseInt(currentService.property_id),
        responsible_id: parseInt(currentService.responsible_id)
      };
      if (currentService.id) {
        await api.put(`/services/${currentService.id}`, data);
      } else {
        await api.post('/services/', data);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert('Erro ao salvar serviço');
    }
  };

  const getClientName = (id: number) => clients.find(c => c.id === id)?.name || 'N/A';
  const getPropName = (id: number) => properties.find(p => p.id === id)?.name || 'N/A';

  const downloadReport = async (id: number) => {
    try {
      const response = await api.get(`/documents/generate/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_servico_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report', error);
      alert('Erro ao gerar relatório. Verifique se o serviço existe e se você tem permissão.');
    }
  };

  const statusColors: any = {
    'Pendente': 'bg-gray-100 text-gray-600',
    'Em andamento': 'bg-orange-100 text-orange-600',
    'Concluído': 'bg-green-100 text-green-600',
    'Cancelado': 'bg-red-100 text-red-600'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Serviços</h1>
          <p className="text-gray-500">Acompanhamento de processos técnicos e prazos.</p>
        </div>
        <button
          onClick={() => { setCurrentService({ service_type: 'Georreferenciamento', status: 'Pendente', value: 0, client_id: '', property_id: '', responsible_id: 1 }); setShowModal(true); }}
          className="bg-consultoria-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition shadow-md"
        >
          <Plus size={20} />
          Novo Serviço
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por cliente ou serviço..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-consultoria-green outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                <th className="px-6 py-4">Serviço</th>
                <th className="px-6 py-4">Cliente / Propriedade</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-consultoria-green/5 text-consultoria-green rounded-lg">
                         <Briefcase size={18} />
                       </div>
                       <div>
                         <div className="font-bold text-gray-800">{srv.service_type}</div>
                         <div className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} /> {new Date(srv.start_date).toLocaleDateString()}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-800">{getClientName(srv.client_id)}</div>
                      <div className="text-gray-500">{getPropName(srv.property_id)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[srv.status]}`}>
                      {srv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">R$ {srv.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => downloadReport(srv.id)} title="Gerar Relatório" className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Download size={18} /></button>
                       <button onClick={() => { setCurrentService(srv); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FileText size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="bg-consultoria-green p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">{currentService.id ? 'Editar Serviço' : 'Novo Serviço'}</h3>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentService.service_type}
                    onChange={(e) => setCurrentService({...currentService, service_type: e.target.value})}
                  >
                    <option>Georreferenciamento</option>
                    <option>CAR</option>
                    <option>CCIR</option>
                    <option>SIGEF</option>
                    <option>Licenciamento ambiental</option>
                    <option>Laudo técnico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentService.status}
                    onChange={(e) => setCurrentService({...currentService, status: e.target.value})}
                  >
                    <option>Pendente</option>
                    <option>Em andamento</option>
                    <option>Concluído</option>
                    <option>Cancelado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentService.client_id}
                    onChange={(e) => setCurrentService({...currentService, client_id: e.target.value})}
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Propriedade</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentService.property_id}
                    onChange={(e) => setCurrentService({...currentService, property_id: e.target.value})}
                    required
                  >
                    <option value="">Selecione uma propriedade</option>
                    {properties.filter(p => !currentService.client_id || p.owner_id == currentService.client_id).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Serviço (R$)</label>
                  <input
                    type="number" step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={currentService.value}
                    onChange={(e) => setCurrentService({...currentService, value: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsável Técnico</label>
                  <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
                    ID Técnico: {currentService.responsible_id}
                  </div>
                </div>
                <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Observações / Descrição</label>
                   <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green h-24"
                    value={currentService.observations || ''}
                    onChange={(e) => setCurrentService({...currentService, observations: e.target.value})}
                   ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition">Cancelar</button>
                <button type="submit" className="bg-consultoria-green text-white px-8 py-2 rounded-lg font-bold shadow-lg hover:bg-opacity-90 transition">Salvar Serviço</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
