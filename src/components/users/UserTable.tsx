import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Edit2, ToggleLeft, ToggleRight } from "lucide-react";
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
} from "@/components/ui/alert-dialog"; // Assuming shadcn/ui path

interface User {
  id: string;
  name: string;
  email: string;
  profile: 'Admin Master' | 'Gerente' | 'Atendimento';
  status: 'Ativo' | 'Inativo';
  creationDate: string;
}

// Mock data for the user list - make it mutable for status change simulation
let mockUsers: User[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos.silva@example.com',
    profile: 'Admin Master',
    status: 'Ativo',
    creationDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Ana Pereira',
    email: 'ana.pereira@example.com',
    profile: 'Gerente',
    status: 'Ativo',
    creationDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'João Costa',
    email: 'joao.costa@example.com',
    profile: 'Atendimento',
    status: 'Inativo',
    creationDate: '2024-03-10',
  },
  {
    id: '4',
    name: 'Mariana Santos',
    email: 'mariana.santos@example.com',
    profile: 'Atendimento',
    status: 'Ativo',
    creationDate: '2024-04-05',
  },
  {
    id: '5',
    name: 'Pedro Almeida',
    email: 'pedro.almeida@example.com',
    profile: 'Gerente',
    status: 'Ativo',
    creationDate: '2023-12-01',
  },
];

interface UserTableProps {
  onUsersUpdate: (updatedUsers: User[]) => void;
}

const UserTable: React.FC<UserTableProps> = ({ onUsersUpdate }) => {
  const navigate = useNavigate();
  const [userToChangeStatus, setUserToChangeStatus] = useState<User | null>(null);

  const handleEdit = (userId: string) => {
    navigate(`/users/edit/${userId}`);
  };

  const prepareDialogForUser = (user: User) => {
    setUserToChangeStatus(user);
  };

  const confirmChangeStatus = () => {
    if (userToChangeStatus) {
      mockUsers = mockUsers.map(u =>
        u.id === userToChangeStatus.id
          ? { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' }
          : u
      );
      onUsersUpdate([...mockUsers]);
      console.log(`Status changed for user: ${userToChangeStatus.id} to ${userToChangeStatus.status === 'Ativo' ? 'Inativo' : 'Ativo'}`);
      alert(`Status do usuário ${userToChangeStatus.name} alterado com sucesso! (mock)`);
      setUserToChangeStatus(null); // Limpa o usuário após a ação, o modal fechará por AlertDialogAction
    }
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      setUserToChangeStatus(null); // Limpa o estado se o modal for fechado por outros meios (Esc, clique fora)
    }
  };

  return (
    <AlertDialog onOpenChange={handleModalOpenChange}>
      <div className="overflow-x-auto bg-cinza-claro shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left text-branco">
          <thead className="bg-gray-700 text-xs uppercase">
            <tr>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-600">Nome</th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-600">E-mail</th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-600">Perfil</th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-600">Status</th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-600">Data de Criação</th>
              <th scope="col" className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-700 hover:bg-cinza-escuro">
                <td className="px-6 py-4 font-medium whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.profile}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Ativo' ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">{user.creationDate}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => handleEdit(user.id)} className="p-1 text-azul-ciano hover:text-opacity-80" title="Editar">
                    <Edit2 size={18} />
                  </button>
                  <AlertDialogTrigger asChild>
                    <button onClick={() => prepareDialogForUser(user)} className="p-1 text-azul-ciano hover:text-opacity-80 ml-2" title={user.status === 'Ativo' ? 'Desativar' : 'Ativar'}>
                      {user.status === 'Ativo' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                  </AlertDialogTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mock Pagination Controls */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700">
          <span className="text-sm text-gray-400">
            Exibindo <span className="font-semibold text-branco">1</span>-<span className="font-semibold text-branco">{mockUsers.length}</span> de <span className="font-semibold text-branco">{mockUsers.length}</span> resultados
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

      {/* AlertDialogContent é renderizado como filho direto de AlertDialog (Root) ou dentro de AlertDialogPortal */} 
      {/* O alert-dialog.tsx já estrutura Content com Portal e Overlay */}
      <AlertDialogContent className="bg-cinza-claro border-gray-700 text-branco">
        {userToChangeStatus ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-azul-ciano">Confirmar Alteração de Status</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Você tem certeza que deseja {userToChangeStatus.status === 'Ativo' ? 'DESATIVAR' : 'ATIVAR'} o usuário "{userToChangeStatus.name}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-600 hover:bg-gray-500 text-branco border-gray-500">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmChangeStatus} className="bg-azul-ciano hover:bg-opacity-80 text-branco">
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          null // Ou um estado de carregamento/vazio se o modal puder abrir sem userToChangeStatus
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserTable;

