import React, { useState, useRef } from 'react';
import { FolderPlus, Folder, FileText, FileVideo, ImageIcon, UploadCloud, MoreVertical, X } from 'lucide-react';

// Mock data types
interface ContentFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'text';
  format: string;
  theme: string;
  description: string;
  thumbnailUrl?: string;
  filePath: string;
  uploadedAt: string;
  size: number;
}

interface ContentFolder {
  id: string;
  name: string;
  files: ContentFile[];
  createdAt: string;
}

// Mock initial data
const initialFoldersData: ContentFolder[] = [
  {
    id: 'folder-1',
    name: 'Banners Promocionais',
    createdAt: '2024-05-10T10:00:00Z',
    files: [
      {
        id: 'file-1-1',
        name: 'Banner Esportes - Grande',
        type: 'image',
        format: 'PNG',
        theme: 'Esportes',
        description: 'Banner chamativo para divulgar apostas esportivas.',
        thumbnailUrl: 'https://via.placeholder.com/300x200/008080/FFFFFF?Text=Banner+Esportes',
        filePath: '/mock/banner_esportes_grande.png',
        uploadedAt: '2024-05-10T10:05:00Z',
        size: 1200000,
      },
      {
        id: 'file-1-2',
        name: 'Video Tutorial Cadastro',
        type: 'video',
        format: 'MP4',
        theme: 'Tutorial',
        description: 'Tutorial rápido mostrando como se cadastrar na plataforma.',
        thumbnailUrl: 'https://via.placeholder.com/300x200/0000FF/FFFFFF?Text=Video+Cadastro',
        filePath: '/mock/tutorial_cadastro.mp4',
        uploadedAt: '2024-05-11T11:00:00Z',
        size: 55000000,
      },
    ],
  },
  {
    id: 'folder-2',
    name: 'Guias e Documentos',
    createdAt: '2024-05-12T14:30:00Z',
    files: [
      {
        id: 'file-2-1',
        name: 'Guia Completo Afiliado',
        type: 'document',
        format: 'PDF',
        theme: 'Geral',
        description: 'Guia PDF com todas as regras e dicas do programa.',
        filePath: '/mock/guia_afiliado.pdf',
        uploadedAt: '2024-05-12T14:35:00Z',
        size: 2500000,
      },
      {
        id: 'file-2-2',
        name: 'Texto Boas Vindas WhatsApp',
        type: 'text',
        format: 'TXT',
        theme: 'Comunicação',
        description: 'Mensagem de boas-vindas para novos indicados via WhatsApp.',
        filePath: '/mock/boas_vindas_whatsapp.txt',
        uploadedAt: '2024-05-13T09:15:00Z',
        size: 1024,
      },
    ],
  },
];

const FILE_TYPE_OPTIONS = ['image', 'video', 'document', 'text'];
const FILE_THEME_OPTIONS = ['Esportes', 'Casino', 'Tutorial', 'Promoção', 'Geral', 'Comunicação'];
const FILE_FORMAT_OPTIONS = ['JPG', 'PNG', 'MP4', 'PDF', 'TXT', 'DOCX'];

const ContentManagement: React.FC = () => {
  const [folders, setFolders] = useState<ContentFolder[]>(initialFoldersData);
  const [selectedFolder, setSelectedFolder] = useState<ContentFolder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileSearchTerm, setFileSearchTerm] = useState("");

  // Dialog states
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [isUploadFileDialogOpen, setIsUploadFileDialogOpen] = useState(false);
  const [newFile, setNewFile] = useState<{ name: string; type: ContentFile['type']; format: string; theme: string; description: string; fileObject: File | null }>({ name: '', type: 'image', format: 'PNG', theme: 'Geral', description: '', fileObject: null });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and Sort states for files
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTheme, setFilterTheme] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('uploadedAt_desc');

  const showToast = (title: string, description: string, type: 'success' | 'error' = 'success') => {
    // Simple toast implementation
    console.log(`${type.toUpperCase()}: ${title} - ${description}`);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() === "") {
      showToast("Erro", "O nome da pasta não pode ser vazio.", 'error');
      return;
    }
    const newFolderData: ContentFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      files: [],
      createdAt: new Date().toISOString(),
    };
    setFolders([newFolderData, ...folders]);
    setNewFolderName("");
    setIsNewFolderDialogOpen(false);
    showToast("Sucesso", `Pasta "${newFolderName}" criada.`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const maxSize = newFile.type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        showToast("Erro de Upload", `O arquivo excede o tamanho máximo permitido (${maxSize / (1024*1024)}MB).`, 'error');
        return;
      }
      setNewFile(prev => ({ ...prev, name: file.name, fileObject: file }));
    }
  };

  const handleCreateFile = () => {
    if (!selectedFolder || !newFile.fileObject || newFile.name.trim() === "") {
      showToast("Erro", "Preencha todos os campos obrigatórios e selecione um arquivo.", 'error');
      return;
    }
    const newFileData: ContentFile = {
      id: `file-${Date.now()}`,
      name: newFile.name,
      type: newFile.type,
      format: newFile.format,
      theme: newFile.theme,
      description: newFile.description,
      filePath: `/mock/${newFile.fileObject.name}`,
      uploadedAt: new Date().toISOString(),
      size: newFile.fileObject.size,
      thumbnailUrl: newFile.type === 'image' ? URL.createObjectURL(newFile.fileObject) : (newFile.type === 'video' ? 'https://via.placeholder.com/300x200/0000FF/FFFFFF?Text=Video' : undefined),
    };
    const updatedFolders = folders.map(f => 
      f.id === selectedFolder.id 
        ? { ...f, files: [newFileData, ...f.files] } 
        : f
    );
    setFolders(updatedFolders);
    setSelectedFolder(updatedFolders.find(f => f.id === selectedFolder.id) || null);
    setNewFile({ name: '', type: 'image', format: 'PNG', theme: 'Geral', description: '', fileObject: null });
    setIsUploadFileDialogOpen(false);
    showToast("Sucesso", `Arquivo "${newFileData.name}" enviado para "${selectedFolder.name}".`);
  };

  const filteredRootFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSortedAndFilteredFiles = () => {
    if (!selectedFolder) return [];
    let tempFiles = [...selectedFolder.files];

    if (filterType !== 'all') tempFiles = tempFiles.filter(f => f.type === filterType);
    if (filterTheme !== 'all') tempFiles = tempFiles.filter(f => f.theme === filterTheme);
    if (fileSearchTerm) {
        tempFiles = tempFiles.filter(file =>
            file.name.toLowerCase().includes(fileSearchTerm.toLowerCase()) ||
            file.description.toLowerCase().includes(fileSearchTerm.toLowerCase()) ||
            file.theme.toLowerCase().includes(fileSearchTerm.toLowerCase())
        );
    }

    switch (sortOrder) {
      case 'name_asc': tempFiles.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name_desc': tempFiles.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'uploadedAt_asc': tempFiles.sort((a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()); break;
      case 'uploadedAt_desc':
      default: tempFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()); break;
      case 'type_asc': tempFiles.sort((a,b) => a.type.localeCompare(b.type)); break;
      case 'type_desc': tempFiles.sort((a,b) => b.type.localeCompare(a.type)); break;
    }
    return tempFiles;
  };

  const currentFilesToDisplay = getSortedAndFilteredFiles();

  const getFileIcon = (type: ContentFile['type']) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-12 h-12 text-azul-ciano" />;
      case 'video': return <FileVideo className="w-12 h-12 text-azul-ciano" />;
      case 'document': return <FileText className="w-12 h-12 text-azul-ciano" />;
      case 'text': return <FileText className="w-12 h-12 text-azul-ciano" />;
      default: return <FileText className="w-12 h-12 text-azul-ciano" />;
    }
  };

  if (selectedFolder) {
    return (
      <div className="space-y-6 bg-cinza-escuro text-branco p-6 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <button 
              onClick={() => { setSelectedFolder(null); setFileSearchTerm(''); }} 
              className="mb-2 px-4 py-2 bg-cinza-claro text-branco rounded-md hover:bg-cinza-medio transition-colors"
            >
              ← Voltar para Pastas
            </button>
            <h2 className="text-xl font-semibold text-branco break-all">{selectedFolder.name}</h2>
          </div>
          <button
            onClick={() => setIsUploadFileDialogOpen(true)}
            className="flex items-center px-4 py-2 bg-azul-ciano text-branco rounded-md hover:bg-azul-ciano/80 transition-colors"
          >
            <UploadCloud className="mr-2 h-4 w-4" /> Upload de Arquivo
          </button>
        </div>

        {/* File filters and search */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
          <input 
            type="search" 
            placeholder="Buscar arquivos..." 
            value={fileSearchTerm} 
            onChange={(e) => setFileSearchTerm(e.target.value)} 
            className="flex-1 px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
          />
          <div className="flex gap-2">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
            >
              <option value="all">Todos os Tipos</option>
              {FILE_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
            </select>
            <select 
              value={filterTheme} 
              onChange={(e) => setFilterTheme(e.target.value)}
              className="px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
            >
              <option value="all">Todos os Temas</option>
              {FILE_THEME_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
            >
              <option value="uploadedAt_desc">Mais Recente</option>
              <option value="uploadedAt_asc">Mais Antigo</option>
              <option value="name_asc">Nome A-Z</option>
              <option value="name_desc">Nome Z-A</option>
              <option value="type_asc">Tipo A-Z</option>
              <option value="type_desc">Tipo Z-A</option>
            </select>
          </div>
        </div>

        {/* Files grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentFilesToDisplay.map(file => (
            <div key={file.id} className="bg-cinza-claro rounded-lg p-4 hover:bg-cinza-medio transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  {file.thumbnailUrl ? (
                    <img src={file.thumbnailUrl} alt={file.name} className="w-full h-32 object-cover rounded-md mb-2" />
                  ) : (
                    <div className="w-full h-32 bg-cinza-escuro rounded-md flex items-center justify-center mb-2">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>
                <div className="relative ml-2">
                  <button className="p-1 hover:bg-cinza-escuro rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <h3 className="font-medium text-branco text-sm mb-1 truncate">{file.name}</h3>
              <p className="text-xs text-gray-400 mb-2 line-clamp-2">{file.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="bg-azul-ciano/20 text-azul-ciano px-2 py-1 rounded">{file.theme}</span>
                <span>{file.format}</span>
              </div>
            </div>
          ))}
        </div>

        {currentFilesToDisplay.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhum arquivo encontrado</h3>
            <p className="text-gray-500">
              {fileSearchTerm || filterType !== 'all' || filterTheme !== 'all' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Faça upload do primeiro arquivo para esta pasta.'}
            </p>
          </div>
        )}

        {/* Upload File Dialog */}
        {isUploadFileDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-cinza-escuro p-6 rounded-lg max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-branco">Upload para "{selectedFolder.name}"</h3>
                <button 
                  onClick={() => setIsUploadFileDialogOpen(false)}
                  className="text-gray-400 hover:text-branco"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
                />
                {newFile.fileObject && (
                  <p className="text-sm text-gray-400">
                    Selecionado: {newFile.fileObject.name} ({(newFile.fileObject.size / (1024*1024)).toFixed(2)} MB)
                  </p>
                )}
                <input 
                  placeholder="Título do Arquivo" 
                  value={newFile.name} 
                  onChange={(e) => setNewFile({...newFile, name: e.target.value})} 
                  className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
                />
                <textarea 
                  placeholder="Descrição do arquivo" 
                  value={newFile.description} 
                  onChange={(e) => setNewFile({...newFile, description: e.target.value})} 
                  className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none h-20 resize-none"
                />
                <select 
                  value={newFile.type} 
                  onChange={(e) => setNewFile({...newFile, type: e.target.value as ContentFile['type']})}
                  className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
                >
                  {FILE_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
                </select>
                <select 
                  value={newFile.format} 
                  onChange={(e) => setNewFile({...newFile, format: e.target.value})}
                  className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
                >
                  {FILE_FORMAT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <select 
                  value={newFile.theme} 
                  onChange={(e) => setNewFile({...newFile, theme: e.target.value})}
                  className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
                >
                  {FILE_THEME_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="flex gap-2 mt-6">
                <button 
                  onClick={() => setIsUploadFileDialogOpen(false)}
                  className="flex-1 px-4 py-2 bg-cinza-claro text-branco rounded-md hover:bg-cinza-medio transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleCreateFile}
                  className="flex-1 px-4 py-2 bg-azul-ciano text-branco rounded-md hover:bg-azul-ciano/80 transition-colors"
                >
                  Salvar Arquivo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-cinza-escuro text-branco p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-branco">Gerenciamento de Conteúdo</h2>
          <p className="text-gray-400">Organize e gerencie materiais de marketing</p>
        </div>
        <button
          onClick={() => setIsNewFolderDialogOpen(true)}
          className="flex items-center px-4 py-2 bg-azul-ciano text-branco rounded-md hover:bg-azul-ciano/80 transition-colors"
        >
          <FolderPlus className="mr-2 h-4 w-4" /> Nova Pasta
        </button>
      </div>

      <div className="mb-4">
        <input 
          type="search" 
          placeholder="Buscar pastas..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRootFolders.map(folder => (
          <div 
            key={folder.id} 
            onClick={() => setSelectedFolder(folder)}
            className="bg-cinza-claro rounded-lg p-4 hover:bg-cinza-medio transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <Folder className="w-12 h-12 text-azul-ciano" />
              <div className="relative">
                <button className="p-1 hover:bg-cinza-escuro rounded">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            <h3 className="font-medium text-branco text-sm mb-1 truncate">{folder.name}</h3>
            <p className="text-xs text-gray-400">{folder.files.length} arquivos</p>
            <p className="text-xs text-gray-500">Criada em {new Date(folder.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
        ))}
      </div>

      {filteredRootFolders.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhuma pasta encontrada</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Tente ajustar o termo de busca.' : 'Crie sua primeira pasta para organizar o conteúdo.'}
          </p>
        </div>
      )}

      {/* New Folder Dialog */}
      {isNewFolderDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-cinza-escuro p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-branco">Nova Pasta</h3>
              <button 
                onClick={() => setIsNewFolderDialogOpen(false)}
                className="text-gray-400 hover:text-branco"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input 
                placeholder="Nome da pasta" 
                value={newFolderName} 
                onChange={(e) => setNewFolderName(e.target.value)} 
                className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => setIsNewFolderDialogOpen(false)}
                className="flex-1 px-4 py-2 bg-cinza-claro text-branco rounded-md hover:bg-cinza-medio transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateFolder}
                className="flex-1 px-4 py-2 bg-azul-ciano text-branco rounded-md hover:bg-azul-ciano/80 transition-colors"
              >
                Criar Pasta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;

