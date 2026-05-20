import React from 'react';
import {
  LayoutDashboard,
  Users,
  Map,
  Briefcase,
  DollarSign,
  Sprout,
  Leaf,
  Bell,
  LogOut,
  Settings,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'clients', icon: Users, label: 'Clientes' },
    { id: 'properties', icon: Map, label: 'Propriedades' },
    { id: 'services', icon: Briefcase, label: 'Serviços' },
    { id: 'financial', icon: DollarSign, label: 'Financeiro' },
    { id: 'agriculture', icon: Sprout, label: 'Agrícola' },
    { id: 'environmental', icon: Leaf, label: 'Ambiental' },
    { id: 'notifications', icon: Bell, label: 'Notificações' },
    { id: 'signature', icon: ShieldCheck, label: 'Assinatura' },
  ];

  return (
    <div className="w-64 bg-2f-black text-white min-h-screen flex flex-col border-r border-2f-gold/30">
      <div className="p-6 flex items-center gap-3 border-b border-2f-gold/20">
        <div className="w-10 h-10 bg-2f-green rounded-full flex items-center justify-center border border-2f-gold">
          <span className="text-2f-gold font-bold text-xl">2F</span>
        </div>
        <div>
          <h2 className="font-bold text-lg text-2f-gold">2F Consultoria</h2>
        </div>
      </div>

      <nav className="flex-grow mt-6 px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
              activeTab === item.id
                ? 'bg-2f-green text-2f-gold border-l-4 border-2f-gold'
                : 'hover:bg-2f-green/20 text-gray-400'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-2f-gold/20">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
          <Settings size={20} />
          <span>Configurações</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};
