import React from 'react';
import { Link } from 'react-router-dom';
import AffiliateTable from "../../components/affiliates/AffiliateTable";
import { Plus, Search, Filter } from 'lucide-react';

const AffiliateListPage: React.FC = () => {
  // This state and handler would be used if UserTable needed to inform UserListPage of updates
  // For now, AffiliateTable manages its own mock data state internally for simplicity in this mock phase.
  // const [affiliatesData, setAffiliatesData] = useState<Affiliate[]>(/* initial mockAffiliates could be passed or fetched here */);
  // const handleAffiliatesUpdate = (updatedAffiliates: Affiliate[]) => {
  //   setAffiliatesData(updatedAffiliates);
  // };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-branco font-sora">Gerenciamento de Afiliados</h1>
        <Link
          to="/affiliates/new"
          className="px-4 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80 flex items-center"
          style={{fontWeight: 900, fontSize: '12px', borderRadius: '5px', padding: '8px 12px'}}
        >
          <Plus size={16} className="mr-2" />
          Adicionar Novo Afiliado
        </Link>
      </div>

      {/* Filters Section */}
      <div className="mb-6 p-4 bg-cinza-claro rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-2 xl:col-span-1">
            <label htmlFor="searchAffiliate" className="block text-sm font-medium text-gray-300 mb-1">Busca Abrangente</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                id="searchAffiliate"
                placeholder="ID, Nome, E-mail, CPF..." 
                className="w-full p-2 pl-10 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="filterAffiliateStatus" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select id="filterAffiliateStatus" className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm">
              <option value="">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Pendente">Pendente</option>
              <option value="Bloqueado">Bloqueado</option>
            </select>
          </div>

          <div>
            <label htmlFor="filterAffiliateCategory" className="block text-sm font-medium text-gray-300 mb-1">Categoria/Level</label>
            <select id="filterAffiliateCategory" className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm">
              <option value="">Todas as Categorias</option>
              <option value="Jogador">Jogador</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Afiliado">Afiliado</option>
              <option value="Profissional">Profissional</option>
              {/* TODO: Populate with actual categories/levels from mock data or config */}
            </select>
          </div>

          <div>
            <label htmlFor="filterAffiliateUpline" className="block text-sm font-medium text-gray-300 mb-1">Upline</label>
            <input 
              type="text" 
              id="filterAffiliateUpline"
              placeholder="ID ou Nome do Upline..." 
              className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="filterDateStart" className="block text-sm font-medium text-gray-300 mb-1">Data Cadastro (De)</label>
              <input type="date" id="filterDateStart" className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm" />
            </div>
            <div>
              <label htmlFor="filterDateEnd" className="block text-sm font-medium text-gray-300 mb-1">Data Cadastro (Até)</label>
              <input type="date" id="filterDateEnd" className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm" />
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2 justify-end">
            <button className="px-4 py-2 text-sm font-bold text-azul-ciano bg-cinza-escuro rounded-md hover:bg-opacity-80 border border-azul-ciano flex items-center">
              <Filter size={14} className="mr-2"/> Aplicar Filtros
            </button>
            <button className="px-4 py-2 text-sm text-azul-ciano hover:underline">
              Limpar Filtros
            </button>
        </div>
      </div>

      {/* Affiliate Table - Now using the actual component */}
      <AffiliateTable />

    </div>
  );
};

export default AffiliateListPage;

