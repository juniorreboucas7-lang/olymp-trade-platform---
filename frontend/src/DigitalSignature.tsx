import React, { useState } from 'react';
import { ShieldCheck, Upload, QrCode, FileCheck } from 'lucide-react';

export const DigitalSignature: React.FC = () => {
  const [signature, setSignature] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSignature(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-2f-green mb-2 flex items-center gap-2">
          <ShieldCheck className="text-2f-gold" size={24}/> Assinatura Digital & Eletrônica
        </h3>
        <p className="text-sm text-gray-500 mb-8">Gerencie sua assinatura digital para inclusão automática em relatórios e contratos.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><Upload size={18}/> Upload da Assinatura</h4>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-2f-gold transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {signature ? (
                <img src={signature} alt="Assinatura" className="max-h-32 mx-auto" />
              ) : (
                <div className="text-gray-400">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload size={24}/>
                  </div>
                  <p className="text-sm">Arraste sua assinatura em PNG (fundo transparente) ou clique para buscar</p>
                </div>
              )}
            </div>
            {signature && (
              <button
                onClick={() => setSignature(null)}
                className="mt-4 text-xs text-red-500 font-bold hover:underline"
              >
                Remover assinatura
              </button>
            )}
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-gray-700 flex items-center gap-2"><QrCode size={18}/> Validação por QR Code</h4>
            <div className="bg-gray-50 p-6 rounded-xl flex items-center gap-6">
               <div className="bg-white p-2 rounded shadow-sm">
                  <QrCode size={80} className="text-2f-green"/>
               </div>
               <div>
                  <p className="text-sm font-bold text-gray-800">Selo de Autenticidade</p>
                  <p className="text-xs text-gray-500">Documentos gerados pelo sistema possuem QR Code de validação única para segurança técnica.</p>
               </div>
            </div>

            <div className="p-4 bg-2f-green/5 rounded-xl border border-2f-green/20">
               <div className="flex items-center gap-3 text-2f-green mb-2">
                  <FileCheck size={20}/>
                  <span className="font-bold text-sm">Status de Certificação</span>
               </div>
               <p className="text-xs text-gray-600">Sua conta está habilitada para assinar digitalmente PRADs, Laudos e Projetos Técnicos conforme normas do CFT.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
