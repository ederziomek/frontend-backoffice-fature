import React, { useState } from 'react';
import { Mail, Plus, Edit, Trash2, Eye, Save, X, Copy } from 'lucide-react';

interface TemplateVariable {
  name: string;
  description: string;
  example: string;
}

interface TemplateCondition {
  field: string;
  operator: string;
  value: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'inactivity_warning' | 'reactivation_success' | 'commission_reduction' | 'welcome' | 'achievement';
  content: {
    title: string;
    body: string;
    variables: TemplateVariable[];
  };
  conditions: TemplateCondition[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const defaultVariables: TemplateVariable[] = [
  { name: '{{affiliate_name}}', description: 'Nome do afiliado', example: 'João Silva' },
  { name: '{{category}}', description: 'Categoria do afiliado', example: 'Profissional' },
  { name: '{{days_inactive}}', description: 'Dias de inatividade', example: '15' },
  { name: '{{commission_rate}}', description: 'Taxa de comissão atual', example: '5%' },
  { name: '{{required_referrals}}', description: 'Indicações necessárias', example: '3' },
  { name: '{{reactivation_deadline}}', description: 'Prazo para reativação', example: '30 dias' },
];

const templateTypes = [
  { value: 'inactivity_warning', label: 'Aviso de Inatividade' },
  { value: 'reactivation_success', label: 'Reativação Bem-sucedida' },
  { value: 'commission_reduction', label: 'Redução de Comissão' },
  { value: 'welcome', label: 'Boas-vindas' },
  { value: 'achievement', label: 'Conquista/Meta' },
];

const conditionFields = [
  { value: 'category', label: 'Categoria' },
  { value: 'level', label: 'Nível' },
  { value: 'days_inactive', label: 'Dias Inativo' },
  { value: 'commission_rate', label: 'Taxa de Comissão' },
];

const conditionOperators = [
  { value: 'equals', label: 'Igual a' },
  { value: 'not_equals', label: 'Diferente de' },
  { value: 'greater_than', label: 'Maior que' },
  { value: 'less_than', label: 'Menor que' },
  { value: 'contains', label: 'Contém' },
];

const NotificationTemplatesSettings: React.FC = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Aviso de Inatividade - Padrão',
      type: 'inactivity_warning',
      content: {
        title: 'Atenção {{affiliate_name}} - Sua conta está inativa',
        body: 'Olá {{affiliate_name}}, notamos que você está inativo há {{days_inactive}} dias. Para manter sua taxa de comissão de {{commission_rate}}, você precisa fazer {{required_referrals}} indicações em até {{reactivation_deadline}}.',
        variables: defaultVariables,
      },
      conditions: [
        { field: 'category', operator: 'equals', value: 'Profissional' }
      ],
      isActive: true,
      createdAt: '2025-06-01',
      updatedAt: '2025-06-02',
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState({
    affiliate_name: 'João Silva',
    category: 'Profissional',
    days_inactive: '15',
    commission_rate: '5%',
    required_referrals: '3',
    reactivation_deadline: '30 dias',
  });

  const handleCreateTemplate = () => {
    const newTemplate: NotificationTemplate = {
      id: Date.now().toString(),
      name: 'Novo Template',
      type: 'inactivity_warning',
      content: {
        title: 'Título do template',
        body: 'Corpo da mensagem...',
        variables: defaultVariables,
      },
      conditions: [],
      isActive: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setEditingTemplate(newTemplate);
    setIsEditing(true);
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate({ ...template });
    setIsEditing(true);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    const updatedTemplate = {
      ...editingTemplate,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (templates.find(t => t.id === editingTemplate.id)) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? updatedTemplate : t));
    } else {
      setTemplates([...templates, updatedTemplate]);
    }

    setIsEditing(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive, updatedAt: new Date().toISOString().split('T')[0] } : t
    ));
  };

  const addCondition = () => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      conditions: [...editingTemplate.conditions, { field: 'category', operator: 'equals', value: '' }]
    });
  };

  const removeCondition = (index: number) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      conditions: editingTemplate.conditions.filter((_, i) => i !== index)
    });
  };

  const updateCondition = (index: number, field: keyof TemplateCondition, value: string) => {
    if (!editingTemplate) return;
    const newConditions = [...editingTemplate.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setEditingTemplate({
      ...editingTemplate,
      conditions: newConditions
    });
  };

  const insertVariable = (variable: string) => {
    if (!editingTemplate) return;
    // Simula inserção no cursor - em uma implementação real, seria mais sofisticado
    setEditingTemplate({
      ...editingTemplate,
      content: {
        ...editingTemplate.content,
        body: editingTemplate.content.body + ' ' + variable
      }
    });
  };

  const renderPreview = (text: string) => {
    let preview = text;
    Object.entries(previewData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return preview;
  };

  if (isEditing && editingTemplate) {
    return (
      <div className="bg-cinza-escuro p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-branco flex items-center">
            <Mail className="mr-3" size={24} />
            {editingTemplate.id ? 'Editar Template' : 'Criar Novo Template'}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center px-4 py-2 bg-azul-ciano text-branco rounded-md hover:bg-azul-ciano/80"
            >
              <Eye className="mr-2" size={16} />
              {showPreview ? 'Ocultar' : 'Preview'}
            </button>
            <button
              onClick={handleSaveTemplate}
              className="flex items-center px-4 py-2 bg-verde text-branco rounded-md hover:bg-verde/80"
            >
              <Save className="mr-2" size={16} />
              Salvar
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingTemplate(null);
              }}
              className="flex items-center px-4 py-2 bg-vermelho text-branco rounded-md hover:bg-vermelho/80"
            >
              <X className="mr-2" size={16} />
              Cancelar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome do Template</label>
              <input
                type="text"
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
              <select
                value={editingTemplate.type}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
              >
                {templateTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
              <input
                type="text"
                value={editingTemplate.content.title}
                onChange={(e) => setEditingTemplate({
                  ...editingTemplate,
                  content: { ...editingTemplate.content, title: e.target.value }
                })}
                className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Corpo da Mensagem</label>
              <textarea
                value={editingTemplate.content.body}
                onChange={(e) => setEditingTemplate({
                  ...editingTemplate,
                  content: { ...editingTemplate.content, body: e.target.value }
                })}
                rows={6}
                className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
              />
            </div>

            {/* Variáveis Disponíveis */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Variáveis Disponíveis</label>
              <div className="grid grid-cols-2 gap-2">
                {defaultVariables.map(variable => (
                  <button
                    key={variable.name}
                    onClick={() => insertVariable(variable.name)}
                    className="flex items-center px-2 py-1 bg-cinza-claro text-branco rounded text-xs hover:bg-azul-ciano/20 border border-gray-600"
                    title={variable.description}
                  >
                    <Copy className="mr-1" size={12} />
                    {variable.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Condições */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Condições</label>
                <button
                  onClick={addCondition}
                  className="flex items-center px-2 py-1 bg-azul-ciano text-branco rounded text-xs hover:bg-azul-ciano/80"
                >
                  <Plus className="mr-1" size={12} />
                  Adicionar
                </button>
              </div>
              {editingTemplate.conditions.map((condition, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={condition.field}
                    onChange={(e) => updateCondition(index, 'field', e.target.value)}
                    className="flex-1 px-2 py-1 bg-cinza-claro text-branco rounded text-sm border border-gray-600"
                  >
                    {conditionFields.map(field => (
                      <option key={field.value} value={field.value}>{field.label}</option>
                    ))}
                  </select>
                  <select
                    value={condition.operator}
                    onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                    className="flex-1 px-2 py-1 bg-cinza-claro text-branco rounded text-sm border border-gray-600"
                  >
                    {conditionOperators.map(op => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                    className="flex-1 px-2 py-1 bg-cinza-claro text-branco rounded text-sm border border-gray-600"
                    placeholder="Valor"
                  />
                  <button
                    onClick={() => removeCondition(index)}
                    className="px-2 py-1 bg-vermelho text-branco rounded text-sm hover:bg-vermelho/80"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-branco">Preview</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Dados de Teste</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(previewData).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-gray-400">{key}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setPreviewData({ ...previewData, [key]: e.target.value })}
                        className="w-full px-2 py-1 bg-cinza-claro text-branco rounded border border-gray-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-cinza-claro p-4 rounded-lg border border-gray-600">
                <h4 className="font-semibold text-branco mb-2">
                  {renderPreview(editingTemplate.content.title)}
                </h4>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {renderPreview(editingTemplate.content.body)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cinza-escuro p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-branco flex items-center">
          <Mail className="mr-3" size={24} />
          🚀 Templates de Notificação Dinâmicos (VERSÃO AVANÇADA)
        </h2>
        <div className="flex items-center gap-4">
          <span className="bg-azul-ciano text-branco px-3 py-1 rounded-full text-sm font-medium">
            ✅ Sistema Implementado
          </span>
          <button
            onClick={handleCreateTemplate}
            className="flex items-center px-4 py-2 bg-azul-ciano text-branco rounded-md hover:bg-azul-ciano/80"
          >
            <Plus className="mr-2" size={16} />
            Novo Template
          </button>
        </div>
      </div>

      <div className="mb-4 p-4 bg-azul-ciano/10 border border-azul-ciano/30 rounded-lg">
        <p className="text-azul-ciano text-sm">
          🔥 SISTEMA AVANÇADO IMPLEMENTADO - Editor visual de templates com variáveis dinâmicas, 
          condições personalizáveis e preview em tempo real para notificações de afiliados.
        </p>
      </div>

      <div className="space-y-4">
        {templates.map(template => (
          <div key={template.id} className="bg-cinza-claro p-4 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-branco">{template.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  template.isActive 
                    ? 'bg-verde/20 text-verde border border-verde/30' 
                    : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
                }`}>
                  {template.isActive ? 'Ativo' : 'Inativo'}
                </span>
                <span className="px-2 py-1 bg-azul-ciano/20 text-azul-ciano rounded text-xs border border-azul-ciano/30">
                  {templateTypes.find(t => t.value === template.type)?.label}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleActive(template.id)}
                  className={`px-3 py-1 rounded text-sm ${
                    template.isActive 
                      ? 'bg-gray-600 text-branco hover:bg-gray-600/80' 
                      : 'bg-verde text-branco hover:bg-verde/80'
                  }`}
                >
                  {template.isActive ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="flex items-center px-3 py-1 bg-azul-ciano text-branco rounded text-sm hover:bg-azul-ciano/80"
                >
                  <Edit className="mr-1" size={12} />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="flex items-center px-3 py-1 bg-vermelho text-branco rounded text-sm hover:bg-vermelho/80"
                >
                  <Trash2 className="mr-1" size={12} />
                  Excluir
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-300 mb-2">
              <strong>Título:</strong> {template.content.title}
            </div>
            
            <div className="text-sm text-gray-300 mb-3">
              <strong>Mensagem:</strong> {template.content.body.substring(0, 150)}
              {template.content.body.length > 150 && '...'}
            </div>

            {template.conditions.length > 0 && (
              <div className="text-xs text-gray-400">
                <strong>Condições:</strong> {template.conditions.length} configurada(s)
              </div>
            )}

            <div className="text-xs text-gray-500 mt-2">
              Criado: {template.createdAt} | Atualizado: {template.updatedAt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationTemplatesSettings;

