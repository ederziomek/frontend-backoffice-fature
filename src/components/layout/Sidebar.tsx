import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Users, UserSquare, Settings, DollarSign, FolderKanban, Shield, X, Monitor, Database, Brain } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Verificar se é dispositivo móvel na montagem e em redimensionamentos
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar inicialmente
    checkMobile();
    
    // Adicionar listener para redimensionamento com throttling
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Limpar listener ao desmontar
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Adicionar/remover classe no body para prevenir scroll quando o menu está aberto em mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isOpen, isMobile]);

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
      label: 'Usuários',
      activeColor: 'text-branco',
    },
    {
      href: '/#/affiliates',
      icon: <UserSquare className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Afiliados',
      activeColor: 'text-branco',
    },
    {
      href: '/#/settings',
      icon: <Settings className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Configurações',
      activeColor: 'text-branco',
    },
    {
      href: '/#/financial',
      icon: <DollarSign className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Financeiro',
      activeColor: 'text-branco',
    },
    {
      href: '/#/security',
      icon: <Shield className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Segurança',
      activeColor: 'text-branco',
    },
    {
      href: '/#/content',
      icon: <FolderKanban className="w-5 h-5 mr-3 text-azul-ciano" />,
      label: 'Marketing',
      activeColor: 'text-branco',
    },
    // Novos itens de menu para os sistemas integrados
    {
      href: '/#/system-monitor',
      icon: <Monitor className="w-5 h-5 mr-3 text-green-400" />,
      label: 'Monitor Sistema',
      activeColor: 'text-branco',
    },
    {
      href: '/#/config-manager',
      icon: <Database className="w-5 h-5 mr-3 text-blue-400" />,
      label: 'Config Service',
      activeColor: 'text-branco',
    },
    {
      href: '/#/cpa-advanced',
      icon: <Shield className="w-5 h-5 mr-3 text-orange-400" />,
      label: 'CPA Avançado',
      activeColor: 'text-branco',
    },
    {
      href: '/#/gamification-ai',
      icon: <Brain className="w-5 h-5 mr-3 text-purple-400" />,
      label: 'Gamificação IA',
      activeColor: 'text-branco',
    },
  ];

  // Obter o caminho atual para destacar o item de menu ativo
  const currentPath = window.location.hash;
  
  // Extrair a parte principal da rota (ex: /#/users/edit/123 -> users)
  const getMainPath = (path: string) => {
    // Remover o /# inicial
    const cleanPath = path.replace(/^\/#\//, '');
    // Pegar apenas a primeira parte do caminho (antes da próxima /)
    return cleanPath.split('/')[0];
  };
  
  const currentMainPath = getMainPath(currentPath);

  // Estilos para o sidebar
  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: '4rem', // 64px
    left: 0,
    width: isMobile ? '80%' : '16rem', // 80% em mobile, 256px em desktop
    maxWidth: '16rem', // 256px
    height: 'calc(100vh - 4rem)',
    backgroundColor: '#212a31', // bg-cinza-claro
    color: '#ffffff', // text-branco
    zIndex: 40,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
    transition: 'transform 0.3s ease-in-out',
    transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
    overflowY: 'auto',
    padding: '1rem', // 16px
  };

  // Estilos para o overlay
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 30,
  };

  return (
    <>
      {/* Overlay para fechar o menu ao clicar fora - visível apenas em mobile quando o menu está aberto */}
      {isMobile && isOpen && (
        <div 
          style={overlayStyle}
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        {/* Botão de fechar visível apenas em dispositivos móveis */}
        {isMobile && (
          <button 
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white hover:bg-cinza-escuro rounded-full"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        )}
        
        <nav className="mt-6 md:mt-0">
          <ul>
            {menuItems.map((item, index) => {
              // Verificar se este item corresponde à rota atual
              const isActive = getMainPath(item.href) === currentMainPath;
              
              return (
                <li key={index} className="mt-2">
                  <a
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-cinza-escuro ${
                      isActive ? 'bg-cinza-medio text-azul-ciano font-semibold' : item.activeColor
                    }`}
                    onClick={() => {
                      // Em dispositivos móveis, fechar o menu ao clicar em um item
                      if (isMobile) {
                        onClose();
                      }
                    }}
                  >
                    {React.cloneElement(item.icon, { 
                      className: `w-5 h-5 mr-3 ${isActive ? 'text-azul-ciano' : 'text-azul-ciano'}` 
                    })}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
