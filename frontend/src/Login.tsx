import React, { useState } from 'react';
import api from './api';

export const Login: React.FC<{ onLogin: (user: any) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data));
      onLogin(response.data);
    } catch (err) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-2f-black">
      <div className="bg-2f-white p-8 rounded-lg shadow-xl w-96 border-t-4 border-2f-gold">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-2f-green rounded-full flex items-center justify-center mb-2">
            <span className="text-2f-gold text-3xl font-bold">2F</span>
          </div>
          <h1 className="text-2f-green text-2xl font-bold italic">2F Consultoria</h1>
          <p className="text-gray-600 text-sm">Agrícola, Ambiental & Agrimensura</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Usuário</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-2f-green text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
            <input
              type="password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-2f-green text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-2f-green text-white font-bold py-2 px-4 rounded hover:bg-opacity-90 transition duration-200 border-b-2 border-2f-gold"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};
