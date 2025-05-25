import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Eye, MoreVertical } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  status: 'Ativo' | 'Inativo' | 'Pendente' | 'Bloqueado';
  category: string; // e.g., Jogador, Iniciante, Afiliado, Profissional
  registrationDate: string;
  upline?: string; // Name or ID of the upline affiliate
  address?: string; // Added for form data
  bankDetails?: string; // Added for form data
  companyName?: string; // Added for form data
  cnpj?: string; // Added for form data
  // Additional fields for detailed view or other functionalities can be added here
}

// Mock data for the affiliate list - make it mutable for status change simulation
export let mockAffiliates: Affiliate[] = [
  {
    id: 'AF001',
    name: 'Roberto Carlos Braga',
    email: 'rcbraga@example.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    status: 'Ativo',
    category: 'Profissional',
    registrationDate: '2023-01-10',
    upline: 'AF000Mestre',
  },
  {
    id: 'AF002',
    name: 'Maria da Silva Sauro',
    email: 'mdssauro@example.com',
    phone: '(21) 91234-5678',
    cpf: '987.654.321-11',
    status: 'Inativo',
    category: 'Iniciante',
    registrationDate: '2023-03-15',
  },
  {
    id: 'AF003',
    name: 'João Kleber Arantes',
    email: 'jkarantes@example.com',
    phone: '(31) 95555-5555',
    cpf: '111.222.333-44',
    status: 'Bloqueado',
    category: 'Jogador',
    registrationDate: '2023-05-20',
    upline: 'AF001',
  },
  {
    id: 'AF004',
    name: 'Ana Banana Montana',
    email: 'abmontana@example.com',
    phone: '(41) 94321-8765',
    cpf: '222.333.444-55',
    status: 'Ativo',
    category: 'Afiliado',
    registrationDate: '2023-07-01',
    upline: 'AF002',
  },
  {
    id: 'AF005',
    name: 'Pedro Pedreira Rocha',
    email: 'pprocaha@example.com',
    phone: '(51) 96789-1234',
    cpf: '555.666.777-88',
    status: 'Pendente',
    category: 'Jogador',
    registrationDate: '2023-09-25',
  },
];

interface AffiliateTableProps {
  // Props for pagination, sorting, filtering will be added later
  // For now, it will use the internal mockAffiliates and allow status changes
}

const AffiliateTable: React.FC<AffiliateTableProps> = () => {
  const navigate = useNavigate();
  const [affiliates, setAffiliates] = useState<Affiliate[]>(mockAffiliates);
  const [affiliateToChangeStatus, setAffiliateToChangeStatus] = useState<Affiliate | null>(null);
  const [newStatus, setNewStatus] = useState<'Ativo' | 'Inativo' | 'Bloqueado' | 'Pendente' | null>(null);

  const handleViewDetails = (affiliateId: string) => {
    navigate(`/affiliates/detail/${affiliateId}`);
  };

  const handleEdit = (affiliateId: string) => {
    navigate(`/affiliates/edit/${affiliateId}`);
  };

  const openChangeStatusModal = (affiliate: Affiliate, targetStatus: 'Ativo' | 'Inativo' | 'Bloqueado' | 'Pendente') => {
    setAffiliateToChangeStatus(affiliate);
    setNewStatus(targetStatus);
  };

  const confirmChangeStatus = () => {
    if (affiliateToChangeStatus && newStatus) {
      const updatedAffiliates = affiliates.map(aff => 
        aff.id === affiliateToChangeStatus.id 
          ? { ...aff, status: newStatus } 
          : aff
      );
      setAffiliates(updatedAffiliates);
      mockAffiliates = updatedAffiliates; // Update the global mock data for persistence across navigations (simple mock)
      console.log(`Status changed for affiliate: ${affiliateToChangeStatus.id} to ${newStatus}`);
      setAffiliateToChangeStatus(null);
      setNewStatus(null);
      alert(`Status do afiliado ${affiliateToChangeStatus.name} alterado para ${newStatus} (mock)!`);
    }
  };

  const getStatusColor = (status: Affiliate['status']) => {
    switch (status) {
      case 'Ativo': return 'bg-green-700 text-green-100';
      case 'Inativo': return 'bg-gray-600 text-gray-100';
      case 'Pendente': return 'bg-yellow-600 text-yellow-100';
      case 'Bloqueado': return 'bg-red-700 text-red-100';
      default: return 'bg-gray-500 text-gray-100';
    }
  };

  return (
    <>
      <div className="overflow-x-auto bg-cinza-claro shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left text-branco">
          <thead className="bg-gray-700 text-xs uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 cursor-pointer hover:bg-gray-600">ID</th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-600">Nome</th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-600">E-mail</th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-600">Telefone</th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-600">CPF</th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-600">Status</th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-600">Categoria</th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-600">Data Cadastro</th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-600">Upline</th>
              <th scope="col" className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {affiliates.map((affiliate) => (
              <tr key={affiliate.id} className="border-b border-gray-700 hover:bg-cinza-escuro">
                <td className="px-4 py-4 font-mono text-xs">{affiliate.id}</td>
                <td className="px-6 py-4 font-medium whitespace-nowrap">{affiliate.name}</td>
                <td className="px-6 py-4">{affiliate.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{affiliate.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{affiliate.cpf}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(affiliate.status)}`}
                  >
                    {affiliate.status}
                  </span>
                </td>
                <td className="px-6 py-4">{affiliate.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{affiliate.registrationDate}</td>
                <td className="px-6 py-4">{affiliate.upline || 'N/A'}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <button onClick={() => handleViewDetails(affiliate.id)} className="p-1 text-azul-ciano hover:text-opacity-80" title="Ver Detalhes">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => handleEdit(affiliate.id)} className="p-1 text-azul-ciano hover:text-opacity-80 ml-2" title="Editar">
                    <Edit2 size={18} />
                  </button>
                  {/* Dropdown for status change */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <button className="p-1 text-azul-ciano hover:text-opacity-80 ml-2" title="Mudar Status">
                         <MoreVertical size={18}/>
                       </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-cinza-claro border-gray-700 text-branco">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-azul-ciano">Mudar Status de: {affiliate.name}</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                                Selecione o novo status para o afiliado.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-col space-y-2 my-4">
                            {(['Ativo', 'Inativo', 'Bloqueado', 'Pendente'] as const).map(stat => (
                                affiliate.status !== stat && (
                                    <button 
                                        key={stat} 
                                        onClick={() => openChangeStatusModal(affiliate, stat)} 
                                        className="w-full text-left p-2 rounded hover:bg-cinza-escuro text-branco"
                                    >
                                        Marcar como {stat}
                                    </button>
                                )
                            ))}
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-600 hover:bg-gray-500 text-branco border-gray-500">Fechar</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mock Pagination Controls - TODO: Implement actual pagination logic */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700">
          <span className="text-sm text-gray-400">
            Exibindo <span className="font-semibold text-branco">1</span>-<span className="font-semibold text-branco">{affiliates.length}</span> de <span className="font-semibold text-branco">{affiliates.length}</span> resultados
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button className="flex items-center justify-center px-3 h-8 text-sm font-medium text-branco bg-gray-800 rounded-l hover:bg-gray-900 disabled:opacity-50" disabled>
              Anterior
            </button>
            <button className="flex items-center justify-center px-3 h-8 text-sm font-medium text-branco bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 disabled:opacity-50" disabled>
              Próximo
            </button>
          </div>
        </div>
      </div>

      {affiliateToChangeStatus && newStatus && (
        <AlertDialog open={!!affiliateToChangeStatus} onOpenChange={() => { setAffiliateToChangeStatus(null); setNewStatus(null); }}>
          <AlertDialogContent className="bg-cinza-claro border-gray-700 text-branco">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-azul-ciano">Confirmar Alteração de Status</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Você tem certeza que deseja alterar o status de "{affiliateToChangeStatus.name}" de "{affiliateToChangeStatus.status}" para "{newStatus}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => { setAffiliateToChangeStatus(null); setNewStatus(null); }} className="bg-gray-600 hover:bg-gray-500 text-branco border-gray-500">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmChangeStatus} className="bg-azul-ciano hover:bg-opacity-80 text-branco">
                Confirmar Alteração
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default AffiliateTable;

