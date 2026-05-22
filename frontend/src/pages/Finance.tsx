import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Trash,
  Filter,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

const Finance: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'Entrada', description: '', amount: 0, category: 'Geral'
  });

  const fetchData = async () => {
    try {
      const [recRes, sumRes] = await Promise.all([
        api.get('/finance/records'),
        api.get('/finance/summary')
      ]);
      setRecords(recRes.data);
      setSummary(sumRes.data);
    } catch (error) {
      console.error('Error fetching finance data', error);
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
      await api.post('/finance/records', { ...newRecord, amount: parseFloat(newRecord.amount as any) });
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert('Erro ao salvar registro');
    }
  };

  const downloadReceipt = async (id: number) => {
    try {
      const response = await api.get(`/documents/receipt/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `recibo_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading receipt', error);
      alert('Erro ao gerar recibo.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Controle Financeiro</h1>
          <p className="text-gray-500">Fluxo de caixa, entradas e saídas da empresa.</p>
        </div>
        <button
          onClick={() => { setNewRecord({ type: 'Entrada', description: '', amount: 0, category: 'Geral' }); setShowModal(true); }}
          className="bg-consultoria-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition shadow-md"
        >
          <Plus size={20} />
          Novo Lançamento
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                <ArrowUpRight size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Entradas Totais</p>
                <p className="text-2xl font-bold text-green-600">R$ {summary.total_income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                <ArrowDownLeft size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Saídas Totais</p>
                <p className="text-2xl font-bold text-red-600">R$ {summary.total_expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
           </div>
        </div>
        <div className="bg-consultoria-green p-6 rounded-xl shadow-lg border border-consultoria-green text-white">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 text-consultoria-gold rounded-lg flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium">Saldo em Caixa</p>
                <p className="text-2xl font-bold text-white">R$ {summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 uppercase text-xs tracking-wider">Últimos Lançamentos</h3>
          <button className="text-gray-400 hover:text-gray-600"><Filter size={20} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(rec.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{rec.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase">
                      {rec.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${rec.type === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>
                    {rec.type === 'Entrada' ? '+' : '-'} R$ {rec.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => downloadReceipt(rec.id)} title="Recibo" className="p-2 text-gray-400 hover:text-consultoria-green hover:bg-green-50 rounded-lg"><Download size={18} /></button>
                       <button onClick={async () => { if(confirm('Excluir?')) { await api.delete(`/finance/records/${rec.id}`); fetchData(); } }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {records.length === 0 && (
            <div className="text-center py-12 text-gray-400">Nenhum registro financeiro encontrado.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-consultoria-green p-6 text-white">
              <h3 className="text-xl font-bold">Novo Lançamento</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex gap-4 p-1 bg-gray-100 rounded-lg mb-6">
                <button
                  type="button"
                  onClick={() => setNewRecord({...newRecord, type: 'Entrada'})}
                  className={`flex-1 py-2 rounded-md font-bold text-sm transition ${newRecord.type === 'Entrada' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
                >Entrada</button>
                <button
                  type="button"
                  onClick={() => setNewRecord({...newRecord, type: 'Saída'})}
                  className={`flex-1 py-2 rounded-md font-bold text-sm transition ${newRecord.type === 'Saída' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}
                >Saída</button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                  placeholder="Ex: Recebimento CAR Fazenda..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                  <input
                    type="number" step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={newRecord.amount}
                    onChange={(e) => setNewRecord({...newRecord, amount: e.target.value as any})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-consultoria-green"
                    value={newRecord.category}
                    onChange={(e) => setNewRecord({...newRecord, category: e.target.value})}
                  >
                    <option>Geral</option>
                    <option>Serviços</option>
                    <option>Consultoria</option>
                    <option>Transporte</option>
                    <option>Impostos</option>
                    <option>Salários</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition">Cancelar</button>
                <button type="submit" className="bg-consultoria-green text-white px-8 py-2 rounded-lg font-bold shadow-lg hover:bg-opacity-90 transition">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
