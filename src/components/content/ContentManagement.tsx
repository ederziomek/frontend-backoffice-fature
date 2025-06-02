import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderPlus, Folder, FileText, FileVideo, ImageIcon, UploadCloud, MoreVertical, Trash2, Edit3, Download } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

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
  const [filterFormat] = useState<string>('all');
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
        setSelectedFolder(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const maxSize = newFile.type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
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
    setNewFile({ name: '', type: 'image', format: 'PNG', theme: 'Geral', description: '', fileObject: null });
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Button variant="outline" onClick={() => { setSelectedFolder(null); setFileSearchTerm(''); }} className="mb-2">
              &larr; Voltar para Pastas
            </Button>
            <h2 className="text-xl font-semibold break-all">{selectedFolder.name}</h2>
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
                <Button variant="outline" onClick={() => setIsUploadFileDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateFile}>Salvar Arquivo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Rest of the file management interface */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
            <Input 
                type="search" 
                placeholder="Buscar arquivos..." 
                value={fileSearchTerm} 
                onChange={(e) => setFileSearchTerm(e.target.value)} 
                className="flex-1"
            />
            <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[120px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {FILE_TYPE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filterTheme} onValueChange={setFilterTheme}>
                    <SelectTrigger className="w-[120px]"><SelectValue placeholder="Tema" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {FILE_THEME_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[140px]"><SelectValue placeholder="Ordenar" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="uploadedAt_desc">Mais Recente</SelectItem>
                        <SelectItem value="uploadedAt_asc">Mais Antigo</SelectItem>
                        <SelectItem value="name_asc">Nome A-Z</SelectItem>
                        <SelectItem value="name_desc">Nome Z-A</SelectItem>
                        <SelectItem value="type_asc">Tipo A-Z</SelectItem>
                        <SelectItem value="type_desc">Tipo Z-A</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {currentFilesToDisplay.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-500 mb-2">Nenhum arquivo encontrado</p>
              <p className="text-sm text-gray-400 text-center">
                {fileSearchTerm || filterType !== 'all' || filterTheme !== 'all' || filterFormat !== 'all' 
                  ? "Tente ajustar os filtros ou termo de busca." 
                  : "Faça upload do primeiro arquivo para esta pasta."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentFilesToDisplay.map((file) => (
              <Card key={file.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-medium truncate">{file.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {file.format} • {file.theme} • {(file.size / (1024*1024)).toFixed(2)} MB
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setFileToEdit(file);
                          setNewFile({
                            name: file.name,
                            type: file.type,
                            format: file.format,
                            theme: file.theme,
                            description: file.description,
                            fileObject: null
                          });
                        }}>
                          <Edit3 className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setFileToDelete(file)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="aspect-video bg-gray-50 rounded-md flex items-center justify-center mb-3">
                    {file.thumbnailUrl ? (
                      <img src={file.thumbnailUrl} alt={file.name} className="w-full h-full object-cover rounded-md" />
                    ) : (
                      getFileIcon(file.type)
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{file.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Enviado em {new Date(file.uploadedAt).toLocaleDateString('pt-BR')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit File Dialog */}
        <Dialog open={!!fileToEdit} onOpenChange={(isOpen) => {if(!isOpen) {setFileToEdit(null); setNewFile({ name: '', type: 'image', format: 'PNG', theme: 'Geral', description: '', fileObject: null });}}}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Editar Arquivo</DialogTitle>
              <DialogDescription>Atualize as informações do arquivo.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input placeholder="Nome do arquivo" value={newFile.name} onChange={(e) => setNewFile({...newFile, name: e.target.value})} />
              <Textarea placeholder="Descrição" value={newFile.description} onChange={(e) => setNewFile({...newFile, description: e.target.value})} />
              <Select value={newFile.type} onValueChange={(value) => setNewFile({...newFile, type: value as ContentFile['type']})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{FILE_TYPE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={newFile.format} onValueChange={(value) => setNewFile({...newFile, format: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{FILE_FORMAT_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={newFile.theme} onValueChange={(value) => setNewFile({...newFile, theme: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o arquivo "{fileToDelete?.name}"? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFileToDelete(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDeleteFile}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Gerenciamento de Conteúdo</h2>
          <p className="text-sm text-gray-600">Organize e gerencie materiais de marketing</p>
        </div>
        <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" /> Nova Pasta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Pasta</DialogTitle>
              <DialogDescription>Digite o nome da nova pasta para organizar seus arquivos.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input placeholder="Nome da pasta" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateFolder}>Criar Pasta</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input 
          type="search" 
          placeholder="Buscar pastas..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="max-w-md"
        />
      </div>

      {filteredRootFolders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-500 mb-2">
              {searchTerm ? "Nenhuma pasta encontrada" : "Nenhuma pasta criada"}
            </p>
            <p className="text-sm text-gray-400 text-center">
              {searchTerm 
                ? "Tente ajustar o termo de busca." 
                : "Crie sua primeira pasta para organizar os materiais de marketing."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRootFolders.map((folder) => (
            <Card key={folder.id} className="group hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedFolder(folder)}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium truncate">{folder.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {folder.files.length} arquivo{folder.files.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        setFolderToEdit(folder);
                        setNewFolderName(folder.name);
                      }}>
                        <Edit3 className="w-4 h-4 mr-2" /> Renomear
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        setFolderToDelete(folder);
                      }} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="aspect-square bg-gray-50 rounded-md flex items-center justify-center mb-3">
                  <Folder className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400">
                  Criada em {new Date(folder.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rename Folder Dialog */}
      <Dialog open={!!folderToEdit} onOpenChange={(isOpen) => {if(!isOpen) {setFolderToEdit(null); setNewFolderName('');}}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear Pasta</DialogTitle>
            <DialogDescription>Digite o novo nome para a pasta "{folderToEdit?.name}".</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Novo nome da pasta" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFolderToEdit(null)}>Cancelar</Button>
            <Button onClick={handleRenameFolder}>Renomear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Dialog */}
      <Dialog open={!!folderToDelete} onOpenChange={(isOpen) => {if(!isOpen) setFolderToDelete(null);}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a pasta "{folderToDelete?.name}" e todos os seus arquivos? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFolderToDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteFolder}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManagement;

