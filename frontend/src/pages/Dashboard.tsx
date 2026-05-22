import React from 'react';
import {
  Users,
  Briefcase,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Clientes Ativos', value: '124', icon: <Users />, color: 'bg-blue-500' },
    { label: 'Serviços em Andamento', value: '45', icon: <Briefcase />, color: 'bg-orange-500' },
    { label: 'Concluídos (Mês)', value: '18', icon: <CheckCircle />, color: 'bg-green-500' },
    { label: 'Pendências', value: '7', icon: <AlertCircle />, color: 'bg-red-500' },
  ];

  const financialData = [
    { name: 'Jan', entrada: 4000, saida: 2400 },
    { name: 'Fev', entrada: 3000, saida: 1398 },
    { name: 'Mar', entrada: 2000, saida: 9800 },
    { name: 'Abr', entrada: 2780, saida: 3908 },
    { name: 'Mai', entrada: 1890, saida: 4800 },
    { name: 'Jun', entrada: 2390, saida: 3800 },
  ];

  const serviceTypeData = [
    { name: 'Georreferenciamento', value: 400 },
    { name: 'CAR', value: 300 },
    { name: 'Crédito Rural', value: 300 },
    { name: 'Licenciamento', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Painel Principal</h1>
        <p className="text-gray-500">Bem-vindo ao sistema de controle da 2F Consultoria.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-lg flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Fluxo de Caixa Mensal</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="entrada" fill="#004d00" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saida" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Tipos de Serviços</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {serviceTypeData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-bold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-start gap-3 border-b border-gray-50 pb-3 last:border-0">
                  <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 mt-1">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Georreferenciamento concluído - Fazenda Alvorada</p>
                    <p className="text-xs text-gray-500">Há 2 horas • Técnico: Roberto Alves</p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Resumo Financeiro</h3>
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Receita Total (Mês)</p>
                  <p className="text-2xl font-bold text-consultoria-green">R$ 45.200,00</p>
                </div>
                <TrendingUp className="text-green-500" size={32} />
             </div>
             <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Despesas Totais (Mês)</p>
                  <p className="text-2xl font-bold text-red-500">R$ 12.800,00</p>
                </div>
                <TrendingDown className="text-red-500" size={32} />
             </div>
             <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Lucro Estimado</p>
                <p className="text-3xl font-bold text-gray-800">R$ 32.400,00</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
