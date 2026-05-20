import React from 'react';
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';

export const Notifications: React.FC = () => {
  const notifications = [
    { id: 1, type: 'urgent', title: 'Vencimento de CCIR', message: 'A propriedade Fazenda Santa Maria tem o CCIR vencendo em 5 dias.', time: '2 horas atrás' },
    { id: 2, type: 'info', title: 'Novo Serviço', message: 'Um novo serviço de Georreferenciamento foi aberto para João da Silva.', time: '5 horas atrás' },
    { id: 3, type: 'success', title: 'Pagamento Confirmado', message: 'Recebimento de R$ 2.500,00 confirmado (Consultoria Ambiental).', time: '1 dia atrás' },
    { id: 4, type: 'warning', title: 'Pendência CAR', message: 'Aguardando documentos para finalização do CAR de Sítio Alvorada.', time: '2 dias atrás' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h3 className="text-xl font-bold text-2f-green mb-6">Central de Notificações</h3>
      {notifications.map(notif => (
        <div key={notif.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-start hover:bg-gray-50 transition-colors">
          <div className={`p-2 rounded-lg ${
            notif.type === 'urgent' ? 'bg-red-100 text-red-600' :
            notif.type === 'success' ? 'bg-green-100 text-green-600' :
            notif.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
          }`}>
            {notif.type === 'urgent' ? <AlertTriangle size={20}/> :
             notif.type === 'success' ? <CheckCircle size={20}/> :
             notif.type === 'warning' ? <AlertTriangle size={20}/> : <Info size={20}/>}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-bold text-gray-800">{notif.title}</h4>
              <span className="text-[10px] text-gray-400 font-medium uppercase">{notif.time}</span>
            </div>
            <p className="text-sm text-gray-600">{notif.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
