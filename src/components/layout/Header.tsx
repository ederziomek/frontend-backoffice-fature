import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-6 bg-cinza-claro shadow-md">
      <div className="flex items-center">
        {/* Logo - Placeholder for now */}
        <div className="mr-4 text-xl font-bold text-azul-ciano font-sora">
          Fature100x
        </div>
      </div>
      <div className="flex items-center">
        <span className="mr-4 text-sm text-branco font-inter">Usuário Admin</span>
        <button className="px-4 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md font-inter hover:bg-opacity-80" style={{fontWeight: 900, fontSize: '12px', borderRadius: '5px', padding: '8px 12px'}}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
