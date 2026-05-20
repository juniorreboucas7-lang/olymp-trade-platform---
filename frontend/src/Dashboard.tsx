import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  TrendingUp,
  Users,
  Map as MapIcon,
  Briefcase,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

const data = [
  { name: 'Jan', faturamento: 4000, custos: 2400 },
  { name: 'Fev', faturamento: 3000, custos: 1398 },
  { name: 'Mar', faturamento: 2000, custos: 9800 },
  { name: 'Abr', faturamento: 2780, custos: 3908 },
  { name: 'Mai', faturamento: 1890, custos: 4800 },
  { name: 'Jun', faturamento: 2390, custos: 3800 },
];

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-2f-gold flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      {trend && <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><TrendingUp size={12}/> +{trend}% este mês</p>}
    </div>
    <div className={`p-3 rounded-full ${color} text-white`}>
      <Icon size={24} />
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Serviços Ativos" value="24" icon={Briefcase} color="bg-2f-green" trend="12" />
        <StatCard title="Total de Clientes" value="156" icon={Users} color="bg-2f-green" />
        <StatCard title="Faturamento Mensal" value="R$ 45.200" icon={DollarSign} color="bg-2f-gold" trend="8" />
        <StatCard title="Propriedades" value="89" icon={MapIcon} color="bg-2f-black" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-2f-green mb-6">Faturamento vs Custos</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="faturamento" fill="#004d00" radius={[4, 4, 0, 0]} />
                <Bar dataKey="custos" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-2f-green mb-6">Evolução de Projetos</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorFav" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004d00" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#004d00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area type="monotone" dataKey="faturamento" stroke="#004d00" fillOpacity={1} fill="url(#colorFav)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-2f-green mb-4 flex items-center gap-2">
          <AlertTriangle className="text-2f-gold" size={20} />
          Alertas e Vencimentos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-4 font-semibold text-sm text-gray-600">Descrição</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-600">Cliente</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-600">Vencimento</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { desc: 'Vencimento CCIR', client: 'Fazenda Santa Maria', date: '25/05/2024', status: 'Urgente', color: 'text-red-500' },
                { desc: 'Pendência CAR', client: 'João da Silva', date: '01/06/2024', status: 'Pendente', color: 'text-2f-gold' },
                { desc: 'Contrato Vencendo', client: 'Agropecuária Vale', date: '15/06/2024', status: 'Atenção', color: 'text-2f-gold' },
              ].map((item, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm">{item.desc}</td>
                  <td className="py-3 px-4 text-sm">{item.client}</td>
                  <td className="py-3 px-4 text-sm font-medium">{item.date}</td>
                  <td className={`py-3 px-4 text-sm font-bold ${item.color}`}>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
