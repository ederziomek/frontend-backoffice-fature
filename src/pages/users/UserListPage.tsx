import React from 'react'; // Removido useState
import { Link } from 'react-router-dom'; // For navigation to UserFormPage
import UserTable from '../../components/users/UserTable'; // Import the UserTable component
import { Plus, Activity } from 'lucide-react';

// Define User type, can be moved to a types file
interface User { 
  id: string;
  name: string;
  email: string;
  profile: 'Admin Master' | 'Gerente' | 'Atendimento';
  status: 'Ativo' | 'Inativo';
  creationDate: string;
}

const UserListPage: React.FC = () => {
  // TODO: Implement actual filter logic and state management
  // TODO: Implement actual Add User navigation
  // const [users, setUsers] = useState<User[]>([]); // Mock state for users - Comentado para corrigir erro de build TS6133

  const handleUsersUpdate = (updatedUsers: User[]) => { 
    // setUsers(updatedUsers); // Removida chamada a setUsers pois o estado 'users' está comentado
    // Here you could also update mockUsers directly if it's used elsewhere as the source of truth
    // For this example, we'll just update the local state.
    console.log("User list updated in parent component:", updatedUsers);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-branco font-sora">Gerenciar Usuários do Backoffice</h1>
        <div className="flex gap-3">
          <Link
            to="/users/logs"
            className="px-4 py-2 text-sm font-bold text-branco bg-green-600 rounded-md hover:bg-green-700 flex items-center"
            style={{fontWeight: 900, fontSize: '12px', borderRadius: '5px', padding: '8px 12px'}}
          >
            <Activity size={16} className="mr-2" />
            Logs de Usuários
          </Link>
          <Link
            to="/users/new"
            className="px-4 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80 flex items-center"
            style={{fontWeight: 900, fontSize: '12px', borderRadius: '5px', padding: '8px 12px'}}
          >
            <Plus size={16} className="mr-2" />
            Adicionar Novo Usuário
          </Link>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="mb-6 p-4 bg-cinza-claro rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="searchNameEmail" className="block text-sm font-medium text-gray-300 mb-1">Buscar</label>
            <input 
              type="text" 
              id="searchNameEmail"
              placeholder="Nome ou E-mail..." 
              className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm"
            />
          </div>
          <div>
            <label htmlFor="filterProfile" className="block text-sm font-medium text-gray-300 mb-1">Perfil</label>
            <select id="filterProfile" className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm">
              <option value="">Todos os Perfis</option>
              <option value="Admin Master">Admin Master</option>
              <option value="Gerente">Gerente</option>
              <option value="Atendimento">Atendimento</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select id="filterStatus" className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm">
              <option value="">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          <div className="flex gap-2 justify-start md:justify-end">
            <button className="px-4 py-2 text-sm font-bold text-azul-ciano bg-cinza-escuro rounded-md hover:bg-opacity-80 border border-azul-ciano w-full md:w-auto">
              Aplicar Filtros
            </button>
            <button className="px-4 py-2 text-sm text-azul-ciano hover:underline w-full md:w-auto">
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* User Table */}
      <UserTable onUsersUpdate={handleUsersUpdate} />

    </div>
  );
};

export default UserListPage;

