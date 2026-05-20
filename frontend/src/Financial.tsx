import React, { useState, useEffect } from 'react';
import api from './api';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Financial: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, net_profit: 0 });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Income',
    category: 'Consultoria',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    is_paid: true
  });

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    const [recordsRes, summaryRes] = await Promise.all([
      api.get('/financial/'),
      api.get('/financial/summary')
    ]);
    setRecords(recordsRes.data);
    setSummary(summaryRes.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/financial/', formData);
    setShowForm(false);
    fetchFinancialData();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-green-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full"><TrendingUp size={24}/></div>
            <div>
              <p className="text-sm text-gray-500">Total Receitas</p>
              <h3 className="text-2xl font-bold text-gray-800">R$ {summary.total_income?.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-red-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-full"><TrendingDown size={24}/></div>
            <div>
              <p className="text-sm text-gray-500">Total Despesas</p>
              <h3 className="text-2xl font-bold text-gray-800">R$ {summary.total_expense?.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-2f-gold">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-2f-gold/10 text-2f-gold rounded-full"><DollarSign size={24}/></div>
            <div>
              <p className="text-sm text-gray-500">Lucro Líquido</p>
              <h3 className="text-2xl font-bold text-gray-800">R$ {summary.net_profit?.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-700">Fluxo de Caixa</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-2f-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 border-b-2 border-2f-gold"
        >
          <Plus size={20} />
          Lançamento Financeiro
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Data</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Descrição</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Categoria</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Valor</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Tipo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                  <Calendar size={14}/> {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.description}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{record.category}</td>
                <td className={`px-6 py-4 text-sm font-bold ${record.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                  {record.type === 'Income' ? '+' : '-'} R$ {record.amount?.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${record.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {record.type === 'Income' ? 'Entrada' : 'Saída'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-[500px] shadow-2xl">
            <h3 className="text-xl font-bold text-2f-green mb-6">Novo Lançamento</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    className="w-full p-2 border rounded text-black"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Income">Entrada (Receita)</option>
                    <option value="Expense">Saída (Despesa)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full p-2 border rounded text-black"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded text-black"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  className="w-full p-2 border rounded text-black"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Consultoria">Consultoria</option>
                  <option value="Topografia">Topografia</option>
                  <option value="Ambiental">Ambiental</option>
                  <option value="Operacional">Custo Operacional</option>
                  <option value="Impostos">Impostos</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500">Cancelar</button>
                <button type="submit" className="bg-2f-green text-white px-6 py-2 rounded-lg font-bold border-b-2 border-2f-gold">Confirmar Lançamento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
