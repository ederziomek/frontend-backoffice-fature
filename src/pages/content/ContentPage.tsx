import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'; // Removed DialogClose
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'; // Removed DropdownMenuCheckboxItem, DropdownMenuLabel
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderPlus, Folder, FileText, FileVideo, ImageIcon, UploadCloud, MoreVertical, Trash2, Edit3, Download, Eye, ArrowUpDown } from 'lucide-react'; // Removed Search, Filter
import { useToast } from "@/components/ui/use-toast";

// Mock data types
interface ContentFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'text';
  format: string; // e.g., JPG, MP4, PDF, TXT
  theme: string;
  description: string;
  thumbnailUrl?: string; // for images/videos
  filePath: string; // mock path for download
  uploadedAt: string;
  size: number; // in bytes
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
        size: 1200000, // 1.2MB
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
        size: 55000000, // 55MB
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
        size: 2500000, // 2.5MB
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
        size: 1024, // 1KB
      },
    ],
  },
];

const FILE_TYPE_OPTIONS = ['image', 'video', 'document', 'text'];
const FILE_THEME_OPTIONS = ['Esportes', 'Casino', 'Tutorial', 'Promoção', 'Geral', 'Comunicação'];
const FILE_FORMAT_OPTIONS = ['JPG', 'PNG', 'MP4', 'PDF', 'TXT', 'DOCX'];

const ContentPage: React.FC = () => {
  const { toast } = useToast();
  const [folders, setFolders] = useState<ContentFolder[]>(initialFoldersData);
  const [selectedFolder, setSelectedFolder] = useState<ContentFolder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileSearchTerm, setFileSearchTerm] = useState("");

  // Dialog states
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderToEdit, setFolderToEdit] = useState<ContentFolder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<ContentFolder | null>(null);

  const [isUploadFileDialogOpen, setIsUploadFileDialogOpen] = useState(false);
  const [newFile, setNewFile] = useState<{ name: string; type: ContentFile['type']; format: string; theme: string; description: string; fileObject: File | null }>({ name: '', type: 'image', format: 'PNG', theme: 'Geral', description: '', fileObject: null });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileToEdit, setFileToEdit] = useState<ContentFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<ContentFile | null>(null);

  // Filter and Sort states for files
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTheme, setFilterTheme] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('uploadedAt_desc');

  const handleCreateFolder = () => {
    if (newFolderName.trim() === "") {
      toast({ title: "Erro", description: "O nome da pasta não pode ser vazio.", variant: "destructive" });
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
    toast({ title: "Sucesso", description: `Pasta "${newFolderName}" criada.` });
  };

  const handleRenameFolder = () => {
    if (!folderToEdit || newFolderName.trim() === "") {
      toast({ title: "Erro", description: "Selecione uma pasta e forneça um novo nome.", variant: "destructive" });
      return;
    }
    setFolders(folders.map(f => f.id === folderToEdit.id ? { ...f, name: newFolderName } : f));
    toast({ title: "Sucesso", description: `Pasta "${folderToEdit.name}" renomeada para "${newFolderName}".` });
    setFolderToEdit(null);
    setNewFolderName("");
  };

  const handleDeleteFolder = () => {
    if (!folderToDelete) return;
    setFolders(folders.filter(f => f.id !== folderToDelete.id));
    toast({ title: "Sucesso", description: `Pasta "${folderToDelete.name}" excluída.` });
    setFolderToDelete(null);
    if (selectedFolder?.id === folderToDelete.id) {
        setSelectedFolder(null); // Go back to folder list if current folder is deleted
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Basic validation (can be expanded)
      const maxSize = newFile.type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for video, 10MB for others
      if (file.size > maxSize) {
        toast({ title: "Erro de Upload", description: `O arquivo excede o tamanho máximo permitido (${maxSize / (1024*1024)}MB).`, variant: "destructive" });
        return;
      }
      setNewFile(prev => ({ ...prev, name: file.name, fileObject: file }));
    }
  };

  const handleCreateFile = () => {
    if (!selectedFolder || !newFile.fileObject || newFile.name.trim() === "") {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios e selecione um arquivo.", variant: "destructive" });
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
    toast({ title: "Sucesso", description: `Arquivo "${newFileData.name}" enviado para "${selectedFolder.name}".` });
  };
  
  const handleEditFile = () => {
    if (!fileToEdit || !selectedFolder || newFile.name.trim() === "") {
        toast({ title: "Erro", description: "Preencha o nome do arquivo.", variant: "destructive" });
        return;
    }
    const updatedFiles = selectedFolder.files.map(f => 
        f.id === fileToEdit.id 
        ? { ...f, name: newFile.name, description: newFile.description, theme: newFile.theme, type: newFile.type, format: newFile.format }
        : f
    );
    const updatedFolders = folders.map(f => 
        f.id === selectedFolder.id 
        ? { ...f, files: updatedFiles }
        : f
    );
    setFolders(updatedFolders);
    setSelectedFolder(updatedFolders.find(f => f.id === selectedFolder.id) || null);
    setFileToEdit(null);
    setNewFile({ name: '', type: 'image', format: 'PNG', theme: 'Geral', description: '', fileObject: null }); // Reset form
    toast({ title: "Sucesso", description: `Arquivo "${newFile.name}" atualizado.` });
  };

  const handleDeleteFile = () => {
    if (!fileToDelete || !selectedFolder) return;
    const updatedFiles = selectedFolder.files.filter(f => f.id !== fileToDelete.id);
    const updatedFolders = folders.map(f => 
        f.id === selectedFolder.id 
        ? { ...f, files: updatedFiles }
        : f
    );
    setFolders(updatedFolders);
    setSelectedFolder(updatedFolders.find(f => f.id === selectedFolder.id) || null);
    setFileToDelete(null);
    toast({ title: "Sucesso", description: `Arquivo "${fileToDelete.name}" excluído.` });
  };


  const filteredRootFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSortedAndFilteredFiles = () => {
    if (!selectedFolder) return [];
    let tempFiles = [...selectedFolder.files];

    // Filter
    if (filterType !== 'all') tempFiles = tempFiles.filter(f => f.type === filterType);
    if (filterTheme !== 'all') tempFiles = tempFiles.filter(f => f.theme === filterTheme);
    if (filterFormat !== 'all') tempFiles = tempFiles.filter(f => f.format === filterFormat);
    if (fileSearchTerm) {
        tempFiles = tempFiles.filter(file =>
            file.name.toLowerCase().includes(fileSearchTerm.toLowerCase()) ||
            file.description.toLowerCase().includes(fileSearchTerm.toLowerCase()) ||
            file.theme.toLowerCase().includes(fileSearchTerm.toLowerCase())
        );
    }

    // Sort
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
      case 'image': return <ImageIcon className="w-12 h-12 text-gray-400" />;
      case 'video': return <FileVideo className="w-12 h-12 text-gray-400" />;
      case 'document': return <FileText className="w-12 h-12 text-gray-400" />;
      case 'text': return <FileText className="w-12 h-12 text-gray-400" />;
      default: return <FileText className="w-12 h-12 text-gray-400" />;
    }
  };

  if (selectedFolder) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Button variant="outline" onClick={() => { setSelectedFolder(null); setFileSearchTerm(''); }} className="mb-2">
              &larr; Voltar para Pastas
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold break-all">{selectedFolder.name}</h1>
          </div>
          <Dialog open={isUploadFileDialogOpen} onOpenChange={(isOpen) => {setIsUploadFileDialogOpen(isOpen); if(!isOpen) setNewFile({ name: '', type: 'image', format: 'PNG', theme: 'Geral', description: '', fileObject: null });}}>
            <DialogTrigger asChild>
              <Button>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload de Arquivo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Fazer Upload para "{selectedFolder.name}"</DialogTitle>
                <DialogDescription>
                  Selecione o arquivo e preencha os detalhes. Limites: Imagens/Docs (10MB), Vídeos (100MB).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input type="file" ref={fileInputRef} onChange={handleFileUpload} className="col-span-full" />
                {newFile.fileObject && <p className="text-sm text-muted-foreground col-span-full">Selecionado: {newFile.fileObject.name} ({(newFile.fileObject.size / (1024*1024)).toFixed(2)} MB)</p>}
                <Input placeholder="Título do Arquivo (ex: Nome do arquivo)" value={newFile.name} onChange={(e) => setNewFile({...newFile, name: e.target.value})} className="col-span-full"/>
                <Textarea placeholder="Descrição do arquivo" value={newFile.description} onChange={(e) => setNewFile({...newFile, description: e.target.value})} className="col-span-full"/>
                <Select value={newFile.type} onValueChange={(value) => setNewFile({...newFile, type: value as ContentFile['type']})}>
                    <SelectTrigger><SelectValue placeholder="Tipo de Arquivo" /></SelectTrigger>
                    <SelectContent>{FILE_TYPE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={newFile.format} onValueChange={(value) => setNewFile({...newFile, format: value})}>
                    <SelectTrigger><SelectValue placeholder="Formato do Arquivo" /></SelectTrigger>
                    <SelectContent>{FILE_FORMAT_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
                 <Select value={newFile.theme} onValueChange={(value) => setNewFile({...newFile, theme: value})}>
                    <SelectTrigger><SelectValue placeholder="Tema/Tag" /></SelectTrigger>
                    <SelectContent>{FILE_THEME_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadFileDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateFile}>Salvar Arquivo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
            <Input 
                type="search" 
                placeholder="Buscar arquivos por nome, descrição, tema..."
                value={fileSearchTerm}
                onChange={(e) => setFileSearchTerm(e.target.value)}
                className="flex-grow"
            />
            <div className="flex gap-2 overflow-x-auto md:overflow-visible">
                <Select value={filterType} onValueChange={setFilterType}><SelectTrigger className="min-w-[150px]"><SelectValue placeholder="Tipo" /></SelectTrigger><SelectContent><SelectItem value="all">Todos Tipos</SelectItem>{FILE_TYPE_OPTIONS.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}</SelectContent></Select>
                <Select value={filterTheme} onValueChange={setFilterTheme}><SelectTrigger className="min-w-[150px]"><SelectValue placeholder="Tema" /></SelectTrigger><SelectContent><SelectItem value="all">Todos Temas</SelectItem>{FILE_THEME_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                <Select value={filterFormat} onValueChange={setFilterFormat}><SelectTrigger className="min-w-[150px]"><SelectValue placeholder="Formato" /></SelectTrigger><SelectContent><SelectItem value="all">Todos Formatos</SelectItem>{FILE_FORMAT_OPTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select>
                <Select value={sortOrder} onValueChange={setSortOrder}><SelectTrigger className="min-w-[180px]"><ArrowUpDown className="mr-2 h-4 w-4" /><SelectValue placeholder="Ordenar por" /></SelectTrigger><SelectContent>
                    <SelectItem value="uploadedAt_desc">Mais Recente</SelectItem><SelectItem value="uploadedAt_asc">Mais Antigo</SelectItem>
                    <SelectItem value="name_asc">Nome (A-Z)</SelectItem><SelectItem value="name_desc">Nome (Z-A)</SelectItem>
                    <SelectItem value="type_asc">Tipo (A-Z)</SelectItem><SelectItem value="type_desc">Tipo (Z-A)</SelectItem>
                </SelectContent></Select>
            </div>
        </div>

        {currentFilesToDisplay.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhum arquivo encontrado com os filtros atuais ou a pasta está vazia.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {currentFilesToDisplay.map(file => (
              <Card key={file.id} className="flex flex-col">
                <CardHeader className="p-4">
                  {file.thumbnailUrl ? (
                    <img src={file.thumbnailUrl} alt={file.name} className="rounded-md aspect-video object-cover w-full" />
                  ) : (
                    <div className="aspect-video bg-gray-700 flex items-center justify-center rounded-md w-full">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  <CardTitle className="mt-3 text-base font-semibold truncate" title={file.name}>{file.name}</CardTitle>
                  <CardDescription className="text-xs text-gray-400 truncate">{`Tipo: ${file.type} • Tema: ${file.theme} • Formato: ${file.format}`}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                  <p className="text-xs text-gray-400 line-clamp-2" title={file.description}>{file.description || "Sem descrição."}</p>
                </CardContent>
                <CardFooter className="p-4 pt-2 flex justify-between items-center border-t border-gray-700">
                  <Button variant="outline" size="sm" onClick={() => { alert(`Simulando download de: ${file.filePath}`); /* window.open(file.filePath, '_blank'); */ }}>
                    <Download className="mr-2 h-3 w-3" /> Baixar
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => alert(`Visualizar ${file.name}`)}><Eye className="mr-2 h-4 w-4" />Visualizar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setNewFile({name: file.name, description: file.description, type: file.type, format: file.format, theme: file.theme, fileObject: null }); setFileToEdit(file); }}>
                        <Edit3 className="mr-2 h-4 w-4" />Editar Metadados
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500 hover:!text-red-500 hover:!bg-red-900/20" onClick={() => setFileToDelete(file)}>
                        <Trash2 className="mr-2 h-4 w-4" />Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Gerenciamento de Conteúdo</h1>
        <Dialog open={isNewFolderDialogOpen} onOpenChange={(isOpen) => {setIsNewFolderDialogOpen(isOpen); if(!isOpen) setNewFolderName('');}}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" /> Nova Pasta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Pasta</DialogTitle>
              <DialogDescription>Digite o nome para a nova pasta de conteúdo.</DialogDescription>
            </DialogHeader>
            <Input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Nome da Pasta" className="my-4" />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateFolder}>Criar Pasta</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Input type="search" placeholder="Buscar por pasta..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-full sm:max-w-sm" />

      {filteredRootFolders.length === 0 && searchTerm === '' ? (
        <p className="text-center text-gray-500 py-8">Nenhuma pasta de conteúdo criada ainda. Clique em 'Nova Pasta' para começar.</p>
      ) : filteredRootFolders.length === 0 && searchTerm !== '' ? (
        <p className="text-center text-gray-500 py-8">Nenhuma pasta encontrada com o termo "{searchTerm}".</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredRootFolders.map(folder => (
            <Card key={folder.id} className="cursor-pointer hover:shadow-lg transition-shadow bg-cinza-claro hover:bg-cinza-medio" onClick={() => {setSelectedFolder(folder); setSearchTerm(''); }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                <CardTitle className="text-base font-semibold truncate" title={folder.name}>{folder.name}</CardTitle>
                <Folder className="h-5 w-5 text-azul-ciano" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-gray-400">{folder.files.length} arquivo(s)</p>
                <p className="text-xs text-gray-400">Criada em: {new Date(folder.createdAt).toLocaleDateString()}</p>
              </CardContent>
              <CardFooter className="p-4 pt-2 flex justify-end border-t border-gray-700">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {e.stopPropagation(); setNewFolderName(folder.name); setFolderToEdit(folder);}}>
                        <Edit3 className="mr-2 h-4 w-4" />Renomear
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500 hover:!text-red-500 hover:!bg-red-900/20" onClick={(e) => {e.stopPropagation(); setFolderToDelete(folder);}}>
                        <Trash2 className="mr-2 h-4 w-4" />Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Folder Dialog */}
      <Dialog open={!!folderToEdit} onOpenChange={(isOpen) => {if(!isOpen) setFolderToEdit(null);}}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Renomear Pasta</DialogTitle>
              <DialogDescription>Digite o novo nome para a pasta "{folderToEdit?.name}".</DialogDescription>
            </DialogHeader>
            <Input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Novo Nome da Pasta" className="my-4" />
            <DialogFooter>
              <Button variant="outline" onClick={() => setFolderToEdit(null)}>Cancelar</Button>
              <Button onClick={handleRenameFolder}>Renomear</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Dialog */}
      <Dialog open={!!folderToDelete} onOpenChange={(isOpen) => {if(!isOpen) setFolderToDelete(null);}}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Excluir Pasta</DialogTitle>
              <DialogDescription>
                Você tem certeza que deseja excluir a pasta "{folderToDelete?.name}"? Todos os arquivos dentro dela também serão excluídos. Esta ação não poderá ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setFolderToDelete(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDeleteFolder}>Excluir Definitivamente</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit File Dialog */}
      <Dialog open={!!fileToEdit} onOpenChange={(isOpen) => {if(!isOpen) setFileToEdit(null);}}>
        <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Editar Metadados do Arquivo</DialogTitle>
              <DialogDescription>Atualize os detalhes do arquivo "{fileToEdit?.name}".</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Input placeholder="Título do Arquivo" value={newFile.name} onChange={(e) => setNewFile({...newFile, name: e.target.value})} className="col-span-full"/>
                <Textarea placeholder="Descrição do arquivo" value={newFile.description} onChange={(e) => setNewFile({...newFile, description: e.target.value})} className="col-span-full"/>
                <Select value={newFile.type} onValueChange={(value) => setNewFile({...newFile, type: value as ContentFile['type']})}>
                    <SelectTrigger><SelectValue placeholder="Tipo de Arquivo" /></SelectTrigger>
                    <SelectContent>{FILE_TYPE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={newFile.format} onValueChange={(value) => setNewFile({...newFile, format: value})}>
                    <SelectTrigger><SelectValue placeholder="Formato do Arquivo" /></SelectTrigger>
                    <SelectContent>{FILE_FORMAT_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
                 <Select value={newFile.theme} onValueChange={(value) => setNewFile({...newFile, theme: value})}>
                    <SelectTrigger><SelectValue placeholder="Tema/Tag" /></SelectTrigger>
                    <SelectContent>{FILE_THEME_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFileToEdit(null)}>Cancelar</Button>
              <Button onClick={handleEditFile}>Salvar Alterações</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete File Dialog */}
      <Dialog open={!!fileToDelete} onOpenChange={(isOpen) => {if(!isOpen) setFileToDelete(null);}}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Excluir Arquivo</DialogTitle>
              <DialogDescription>
                Você tem certeza que deseja excluir o arquivo "{fileToDelete?.name}"? Esta ação não poderá ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setFileToDelete(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDeleteFile}>Excluir Definitivamente</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ContentPage;

