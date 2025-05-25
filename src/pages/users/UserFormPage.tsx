import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Mock data for profiles and permissions
const profiles = ['Admin Master', 'Gerente', 'Atendimento'];
const modulesPermissions = {
  'Gerenciamento de Afiliados': [
    'Visualizar Afiliados',
    'Editar Afiliados',
    'Aprovar Novos Afiliados',
    'Bloquear Afiliados',
  ],
  'Configurações Financeiras': [
    'Visualizar Configurações',
    'Editar Configurações de Pagamento',
    'Gerenciar Taxas',
  ],
  'Relatórios': [
    'Visualizar Relatórios de Ganhos',
    'Visualizar Relatórios de Acesso',
    'Exportar Relatórios',
  ],
  'Gerenciamento de Usuários Backoffice': [
    'Visualizar Usuários Backoffice',
    'Criar Usuários Backoffice',
    'Editar Usuários Backoffice',
    'Mudar Status Usuários Backoffice',
  ]
  // Add more modules and permissions as needed
};

// Mock user data for editing - in a real app, this would come from an API
const mockExistingUsers = [
  { id: '1', name: 'Carlos Silva', email: 'carlos.silva@example.com', profile: 'Admin Master', permissions: {'Gerenciamento de Afiliados': ['Visualizar Afiliados', 'Editar Afiliados']} },
  { id: '2', name: 'Ana Pereira', email: 'ana.pereira@example.com', profile: 'Gerente', permissions: {} },
];

const UserFormPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(userId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profile, setProfile] = useState<string>(profiles[0]);
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (isEditing && userId) {
      const userToEdit = mockExistingUsers.find(u => u.id === userId);
      if (userToEdit) {
        setName(userToEdit.name);
        setEmail(userToEdit.email);
        setProfile(userToEdit.profile);
        setSelectedPermissions((userToEdit.permissions as Record<string, string[]>) || {});
      }
    }
  }, [isEditing, userId]);

  const handlePermissionChange = (module: string, permission: string) => {
    setSelectedPermissions(prev => {
      const modulePermissions = prev[module] ? [...prev[module]] : [];
      if (modulePermissions.includes(permission)) {
        return { ...prev, [module]: modulePermissions.filter(p => p !== permission) };
      }
      return { ...prev, [module]: [...modulePermissions, permission] };
    });
  };

  const handleSelectAllModulePermissions = (module: string, allModulePermissions: string[]) => {
    setSelectedPermissions(prev => {
      const currentModulePermissions = prev[module] || [];
      if (currentModulePermissions.length === allModulePermissions.length) {
        // If all are selected, deselect all
        const newPermissions = { ...prev };
        delete newPermissions[module];
        return newPermissions;
      }
      // Otherwise, select all
      return { ...prev, [module]: [...allModulePermissions] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission logic
    if (password !== confirmPassword && (password || confirmPassword)) {
      alert('As senhas não coincidem!');
      return;
    }
    console.log('Form submitted (mock):', { name, email, profile, password: password ? '******' : '', permissions: selectedPermissions });
    alert(isEditing ? 'Usuário atualizado com sucesso (mock)!' : 'Usuário criado com sucesso (mock)!');
    navigate('/users');
  };

  return (
    <div className="p-4 bg-cinza-claro rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-branco mb-6 font-sora">
        {isEditing ? `Editar Usuário: ${name}` : 'Criar Novo Usuário'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isEditing} // Not editable on edit, as per user confirmation
            className={`w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm ${isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <label htmlFor="profile" className="block text-sm font-medium text-gray-300 mb-1">Perfil</label>
          <select 
            id="profile" 
            value={profile} 
            onChange={(e) => setProfile(e.target.value)} 
            required
            className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm"
          >
            {profiles.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Senha {isEditing ? '(Deixe em branco para não alterar)' : ''}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!isEditing}
            className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm"
          />
        </div>

        {(password || !isEditing) && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={!isEditing || Boolean(password)}
              className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm"
            />
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-branco font-sora border-b border-gray-700 pb-2">Permissões</h3>
          {Object.entries(modulesPermissions).map(([moduleName, permissionsList]) => (
            <div key={moduleName} className="p-3 bg-cinza-escuro rounded">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-200">{moduleName}</h4>
                <label className="flex items-center text-xs text-gray-400 cursor-pointer">
                  <input 
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano mr-2"
                    checked={(selectedPermissions[moduleName] || []).length === permissionsList.length && permissionsList.length > 0}
                    onChange={() => handleSelectAllModulePermissions(moduleName, permissionsList)}
                  />
                  Selecionar Todas do Módulo
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {permissionsList.map(permission => (
                  <label key={permission} className="flex items-center text-sm text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-4 w-4 text-azul-ciano bg-gray-700 border-gray-600 rounded focus:ring-azul-ciano mr-2"
                      checked={(selectedPermissions[moduleName] || []).includes(permission)}
                      onChange={() => handlePermissionChange(moduleName, permission)}
                    />
                    {permission}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Link 
            to="/users"
            className="px-6 py-2 text-sm font-medium text-azul-ciano bg-cinza-escuro rounded-md hover:bg-gray-700 border border-azul-ciano"
          >
            Cancelar
          </Link>
          <button 
            type="submit" 
            className="px-6 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
            style={{fontWeight: 900, fontSize: '12px', borderRadius: '5px', padding: '8px 24px'}}
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserFormPage;

