import React, { useState, useEffect } from 'react';
import api from './api';
import { Sprout, Leaf, Activity, ClipboardList } from 'lucide-react';

export const Agriculture: React.FC = () => {
  const [crops, setCrops] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    fetchCrops();
    fetchProperties();
  }, []);

  const fetchCrops = async () => {
    const res = await api.get('/agriculture/crops');
    setCrops(res.data);
  };

  const fetchProperties = async () => {
    const res = await api.get('/properties/');
    setProperties(res.data);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-2f-green mb-4 flex items-center gap-2">
            <Sprout size={20}/> Controle de Culturas
          </h3>
          <div className="space-y-4">
            {crops.length === 0 ? <p className="text-gray-500 italic">Nenhuma cultura cadastrada.</p> :
              crops.map(crop => (
                <div key={crop.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800">{crop.culture_type}</p>
                    <p className="text-xs text-gray-500">{properties.find(p => p.id === crop.property_id)?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-2f-green">{crop.area} ha</p>
                    <p className="text-[10px] text-gray-400">Est. Prod: {crop.production_estimate}t</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-2f-green mb-4 flex items-center gap-2">
            <ClipboardList size={20}/> Planejamento Agrícola
          </h3>
          <div className="space-y-3">
             <div className="p-3 border-l-4 border-2f-gold bg-2f-gold/5 rounded">
                <p className="text-sm font-bold">Manejo de Pragas - Cacau</p>
                <p className="text-xs text-gray-500">Fazenda Boa Esperança - 20/06/2024</p>
             </div>
             <div className="p-3 border-l-4 border-2f-green bg-2f-green/5 rounded">
                <p className="text-sm font-bold">Colheita - Açaí</p>
                <p className="text-xs text-gray-500">Sítio Alvorada - 15/07/2024</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Environmental: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    fetchRecords();
    fetchProperties();
  }, []);

  const fetchRecords = async () => {
    const res = await api.get('/environmental/records');
    setRecords(res.data);
  };

  const fetchProperties = async () => {
    const res = await api.get('/properties/');
    setProperties(res.data);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-2f-green mb-6 flex items-center gap-2">
          <Leaf size={20}/> Licenciamento e Monitoramento Ambiental
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-4 font-semibold text-sm text-gray-600">Propriedade</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-600">Tipo de Licença</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-600">Vencimento</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id} className="border-b border-gray-50">
                  <td className="py-3 px-4 text-sm">{properties.find(p => p.id === record.property_id)?.name}</td>
                  <td className="py-3 px-4 text-sm font-medium">{record.license_type}</td>
                  <td className="py-3 px-4 text-sm">{new Date(record.expiration_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm font-bold text-2f-gold">{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
