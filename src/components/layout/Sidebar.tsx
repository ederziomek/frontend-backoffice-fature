import React, { useEffect } from 'react';
import { LayoutDashboard, Users, UserSquare, Settings, DollarSign, FolderKanban, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  // Adicionar/remover classe no body para prevenir scroll quando o menu está aberto em mobile
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isOpen]);

  const menuItems = [
    {
      href: '/#/dashboard',
      icon: <LayoutDashboard className="w-5 h-5 mr-3" />,
      label: 'Dashboard',
      activeColor: 'text-azul-ciano',
    },
    {
      href: '/#/users',
      icon: <Users className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Gerenciar Usuários',
      activeColor: 'text-branco',
    },
    {
      href: '/#/affiliates',
      icon: <UserSquare className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Gerenciar Afiliados',
      activeColor: 'text-branco',
    },
    {
      href: '/#/settings',
      icon: <Settings className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Gerenciar Configurações',
      activeColor: 'text-branco',
    },
    {
      href: '/#/financial',
      icon: <DollarSign className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Gerenciamento Financeiro',
      activeColor: 'text-branco',
    },
    {
      href: '/#/content',
      icon: <FolderKanban className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Gerenciamento de Conteúdo',
      activeColor: 'text-branco',
    },
  ];

  // This is a simple way to highlight, ideally use NavLink from react-router-dom
  const currentPath = window.location.hash;

  return (
    <>
      {/* Overlay para fechar o menu ao clicar fora - visível apenas em mobile quando o menu está aberto */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 ${isOpen ? 'block' : 'hidden'} md:hidden`}
        onClick={onClose}
      ></div>
      
      {/* Sidebar - em mobile fica oculto por padrão, em desktop sempre visível */}
      <aside 
        className={`sidebar fixed top-16 left-0 z-40 w-64 h-full bg-cinza-claro text-branco font-inter shadow-md ${isOpen ? 'sidebar-visible' : ''}`}
      >
        <div className="p-4">
          {/* Botão de fechar visível apenas em dispositivos móveis */}
          <button 
            className="md:hidden absolute top-2 right-2 p-1 text-gray-400 hover:text-white hover:bg-cinza-escuro rounded-full"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
          
          <nav className="mt-6 md:mt-0">
            <ul>
              {menuItems.map((item, index) => (
                <li key={index} className="mt-2">
                  <a
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-cinza-escuro ${currentPath === item.href.substring(1) ? 'bg-cinza-medio text-azul-ciano font-semibold' : item.activeColor}`}
                    onClick={() => {
                      // Em dispositivos móveis, fechar o menu ao clicar em um item
                      if (window.innerWidth < 768) {
                        onClose();
                      }
                    }}
                  >
                    {React.cloneElement(item.icon, { className: `w-5 h-5 mr-3 ${currentPath === item.href.substring(1) ? 'text-azul-ciano' : 'text-azul-ciano'}` })}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
