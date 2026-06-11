import React from 'react';
import { FileText, Download, Briefcase, DollarSign, FileCheck, ClipboardList } from 'lucide-react';

const Documents: React.FC = () => {
  const docTypes = [
    { title: 'Relatórios Técnicos', desc: 'Gerados a partir da Gestão de Serviços', icon: Briefcase, color: 'text-blue-600', link: '/services' },
    { title: 'Recibos Financeiros', desc: 'Gerados a partir do Controle Financeiro', icon: DollarSign, color: 'text-green-600', link: '/finance' },
    { title: 'Contratos e Propostas', desc: 'Disponíveis em breve no cadastro de clientes', icon: FileText, color: 'text-consultoria-gold', link: '/clients' },
    { title: 'Ordens de Serviço', desc: 'Emissão automática por projeto', icon: ClipboardList, color: 'text-purple-600', link: '/services' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Emissão de Documentos</h1>
        <p className="text-gray-500">Central de documentos técnicos e administrativos da 2F Consultoria.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docTypes.map((doc, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-5 hover:shadow-md transition group">
            <div className={`p-4 rounded-xl bg-gray-50 group-hover:bg-white transition ${doc.color}`}>
              <doc.icon size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-1">{doc.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{doc.desc}</p>
              <a
                href={doc.link}
                className="text-consultoria-green font-bold text-sm flex items-center gap-1 hover:underline"
              >
                Acessar Módulo <FileCheck size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-consultoria-green/5 border border-consultoria-green/20 p-8 rounded-2xl">
        <h3 className="text-lg font-bold text-consultoria-green mb-2">Dica de Produtividade</h3>
        <p className="text-gray-600">
          O sistema da 2F Consultoria gera documentos automaticamente utilizando os dados cadastrados nos módulos.
          Certifique-se de que as informações do cliente e da propriedade estão atualizadas antes de emitir um relatório técnico.
        </p>
      </div>
    </div>
  );
};

export default Documents;
