import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Map as MapIcon,
  Briefcase,
  DollarSign,
  FileText,
  LogOut,
  Settings
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/clients', icon: <Users size={20} />, label: 'Clientes' },
    { to: '/properties', icon: <MapIcon size={20} />, label: 'Propriedades' },
    { to: '/services', icon: <Briefcase size={20} />, label: 'Serviços' },
    { to: '/finance', icon: <DollarSign size={20} />, label: 'Financeiro' },
    { to: '/documents', icon: <FileText size={20} />, label: 'Documentos' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-consultoria-green text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-consultoria-green font-bold italic">2F</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">2F Consultoria</h1>
            <p className="text-[10px] text-consultoria-gold uppercase tracking-wider font-semibold">Sistemas</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive ? 'bg-consultoria-gold text-consultoria-green font-bold' : 'hover:bg-white/10'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="px-4 py-2 text-xs text-white/50">
            Logado como: <span className="text-white font-medium block">{user?.full_name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-300 transition"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-gray-800 uppercase tracking-tight">Sistema de Gestão Integrada</h2>
          <div className="flex items-center gap-4">
             <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Settings size={20} /></button>
             <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
               {user?.username?.[0].toUpperCase()}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>

        <footer className="h-10 bg-white border-t border-gray-200 flex items-center justify-center text-[10px] text-gray-400">
          Francisco Rebouças Junior – Téc. em Agrimensura, Meio Ambiente e Agricultura – CFT 00348436203 – (93) 99185-3915
        </footer>
      </div>
    </div>
  );
};

export default Layout;
