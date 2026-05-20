import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Login } from './Login';
import { Dashboard } from './Dashboard';
import { Clients } from './Clients';
import { Properties } from './Properties';
import { Services } from './Services';
import { Financial } from './Financial';
import { Agriculture, Environmental } from './AgroEnv';
import { Notifications } from './Notifications';
import { DigitalSignature } from './DigitalSignature';
import { Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return <div className="bg-2f-black min-h-screen text-white flex items-center justify-center">Carregando...</div>;

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-2f-black' : 'bg-gray-100'} transition-colors duration-300`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="flex-grow overflow-y-auto">
        <header className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} h-16 shadow-sm flex items-center justify-between px-8 border-b transition-colors`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-2f-gold' : 'text-2f-green'} uppercase tracking-wider`}>
            {activeTab === 'dashboard' ? 'Dashboard' :
             activeTab === 'clients' ? 'Gestão de Clientes' :
             activeTab === 'properties' ? 'Propriedades Rurais' :
             activeTab === 'services' ? 'Módulo de Serviços' :
             activeTab === 'financial' ? 'Controle Financeiro' :
             activeTab === 'agriculture' ? 'Módulo Agrícola' :
             activeTab === 'environmental' ? 'Módulo Ambiental' :
             activeTab === 'signature' ? 'Assinatura Digital' : 'Notificações'}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${isDarkMode ? 'text-2f-gold hover:bg-zinc-800' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bem-vindo, <span className={`font-bold ${isDarkMode ? 'text-2f-gold' : 'text-2f-green'}`}>{user.username}</span></span>
            <div className="w-8 h-8 bg-2f-gold rounded-full flex items-center justify-center text-white font-bold border border-white/20">
              {user.username[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className={`p-8 ${isDarkMode ? 'text-zinc-300' : 'text-black'}`}>
          <div className={`${isDarkMode ? 'dark:bg-zinc-900/50 dark:p-6 dark:rounded-2xl dark:border dark:border-zinc-800' : ''}`}>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'clients' && <Clients />}
            {activeTab === 'properties' && <Properties />}
            {activeTab === 'services' && <Services />}
            {activeTab === 'financial' && <Financial />}
            {activeTab === 'agriculture' && <Agriculture />}
            {activeTab === 'environmental' && <Environmental />}
            {activeTab === 'notifications' && <Notifications />}
            {activeTab === 'signature' && <DigitalSignature />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
