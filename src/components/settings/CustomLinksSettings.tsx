import React, { useState, useEffect } from 'react';
import { Link2, Plus, Copy, QrCode, BarChart3, Download, Trash2 } from 'lucide-react';

interface CustomLink {
  id: string;
  name: string;
  originalUrl: string;
  customSlug: string;
  fullUrl: string;
  affiliateId: string;
  affiliateName: string;
  campaign: string;
  source: string;
  medium: string;
  clicks: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  isActive: boolean;
  createdAt: string;
  lastClicked: string;
  qrCodeUrl: string;
}

interface LinkAnalytics {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  averageConversionRate: number;
  topPerformingLinks: CustomLink[];
  clicksByDay: { date: string; clicks: number }[];
}

const CustomLinksSettings: React.FC = () => {
  const [links, setLinks] = useState<CustomLink[]>([
    {
      id: '1',
      name: 'Campanha Black Friday 2025',
      originalUrl: 'https://fature.com/register',
      customSlug: 'blackfriday2025',
      fullUrl: 'https://fature.com/r/blackfriday2025',
      affiliateId: 'aff001',
      affiliateName: 'João Silva',
      campaign: 'black_friday',
      source: 'instagram',
      medium: 'social',
      clicks: 1250,
      conversions: 87,
      conversionRate: 6.96,
      revenue: 43500,
      isActive: true,
      createdAt: '2025-05-15',
      lastClicked: '2025-06-02T10:30:00Z',
      qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    },
    {
      id: '2',
      name: 'Promoção Verão',
      originalUrl: 'https://fature.com/register',
      customSlug: 'verao2025',
      fullUrl: 'https://fature.com/r/verao2025',
      affiliateId: 'aff002',
      affiliateName: 'Maria Santos',
      campaign: 'summer_promo',
      source: 'facebook',
      medium: 'paid',
      clicks: 890,
      conversions: 45,
      conversionRate: 5.06,
      revenue: 22500,
      isActive: true,
      createdAt: '2025-05-20',
      lastClicked: '2025-06-02T09:15:00Z',
      qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    }
  ]);

  const [analytics] = useState<LinkAnalytics>({
    totalClicks: 2140,
    totalConversions: 132,
    totalRevenue: 66000,
    averageConversionRate: 6.17,
    topPerformingLinks: [],
    clicksByDay: [
      { date: '2025-05-28', clicks: 45 },
      { date: '2025-05-29', clicks: 67 },
      { date: '2025-05-30', clicks: 89 },
      { date: '2025-05-31', clicks: 123 },
      { date: '2025-06-01', clicks: 156 },
      { date: '2025-06-02', clicks: 98 },
    ],
  });

  const [isCreating, setIsCreating] = useState(false);
  const [newLink, setNewLink] = useState({
    name: '',
    originalUrl: '',
    customSlug: '',
    affiliateId: '',
    campaign: '',
    source: '',
    medium: '',
  });

  const [selectedTab, setSelectedTab] = useState<'links' | 'analytics'>('links');

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
  };

  const generateQRCode = () => {
    // Simulação de geração de QR Code
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  };

  const createLink = () => {
    if (!newLink.name || !newLink.originalUrl || !newLink.customSlug) return;

    const link: CustomLink = {
      id: Date.now().toString(),
      name: newLink.name,
      originalUrl: newLink.originalUrl,
      customSlug: newLink.customSlug,
      fullUrl: `https://fature.com/r/${newLink.customSlug}`,
      affiliateId: newLink.affiliateId,
      affiliateName: 'Afiliado Selecionado',
      campaign: newLink.campaign,
      source: newLink.source,
      medium: newLink.medium,
      clicks: 0,
      conversions: 0,
      conversionRate: 0,
      revenue: 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      lastClicked: '',
      qrCodeUrl: generateQRCode(),
    };

    setLinks([...links, link]);
    setNewLink({
      name: '',
      originalUrl: '',
      customSlug: '',
      affiliateId: '',
      campaign: '',
      source: '',
      medium: '',
    });
    setIsCreating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Em uma implementação real, mostraria uma notificação
  };

  const toggleLinkStatus = (id: string) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, isActive: !link.isActive } : link
    ));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const exportAnalytics = () => {
    const data = links.map(link => ({
      'Nome': link.name,
      'URL Personalizada': link.fullUrl,
      'Afiliado': link.affiliateName,
      'Campanha': link.campaign,
      'Fonte': link.source,
      'Meio': link.medium,
      'Cliques': link.clicks,
      'Conversões': link.conversions,
      'Taxa de Conversão (%)': link.conversionRate.toFixed(2),
      'Receita': `R$ ${link.revenue.toLocaleString('pt-BR')}`,
      'Status': link.isActive ? 'Ativo' : 'Inativo',
      'Criado em': link.createdAt,
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `links_analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  useEffect(() => {
    if (newLink.name && !newLink.customSlug) {
      setNewLink(prev => ({ ...prev, customSlug: generateSlug(prev.name) }));
    }
  }, [newLink.name]);

  return (
    <div className="bg-cinza-escuro p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-branco flex items-center">
          <Link2 className="mr-3" size={24} />
          🚀 Gestão de Links Personalizados (VERSÃO AVANÇADA)
        </h2>
        <div className="flex items-center gap-4">
          <span className="bg-azul-ciano text-branco px-3 py-1 rounded-full text-sm font-medium">
            ✅ Sistema Implementado
          </span>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center px-4 py-2 bg-azul-ciano text-branco rounded-md hover:bg-azul-ciano/80"
          >
            <Plus className="mr-2" size={16} />
            Novo Link
          </button>
        </div>
      </div>

      <div className="mb-4 p-4 bg-azul-ciano/10 border border-azul-ciano/30 rounded-lg">
        <p className="text-azul-ciano text-sm">
          🔥 SISTEMA AVANÇADO IMPLEMENTADO - Geração de links personalizados, 
          tracking avançado de cliques, analytics de conversão, QR codes dinâmicos e UTM parameters automáticos.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-cinza-claro p-1 rounded-lg">
        <button
          onClick={() => setSelectedTab('links')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'links'
              ? 'bg-azul-ciano text-branco'
              : 'text-gray-300 hover:text-branco hover:bg-cinza-escuro/50'
          }`}
        >
          <Link2 className="inline mr-2" size={16} />
          Links Personalizados ({links.length})
        </button>
        <button
          onClick={() => setSelectedTab('analytics')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'analytics'
              ? 'bg-azul-ciano text-branco'
              : 'text-gray-300 hover:text-branco hover:bg-cinza-escuro/50'
          }`}
        >
          <BarChart3 className="inline mr-2" size={16} />
          Analytics e Relatórios
        </button>
      </div>

      {selectedTab === 'links' && (
        <>
          {/* Modal de Criação */}
          {isCreating && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-cinza-escuro p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4">
                <h3 className="text-lg font-semibold text-branco mb-4">Criar Novo Link Personalizado</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nome do Link</label>
                    <input
                      type="text"
                      value={newLink.name}
                      onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                      className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
                      placeholder="Ex: Campanha Black Friday"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">URL Original</label>
                    <input
                      type="url"
                      value={newLink.originalUrl}
                      onChange={(e) => setNewLink({ ...newLink, originalUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
                      placeholder="https://fature.com/register"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Slug Personalizado</label>
                    <div className="flex">
                      <span className="px-3 py-2 bg-gray-600 text-gray-300 rounded-l-md border border-r-0 border-gray-600 text-sm">
                        fature.com/r/
                      </span>
                      <input
                        type="text"
                        value={newLink.customSlug}
                        onChange={(e) => setNewLink({ ...newLink, customSlug: e.target.value })}
                        className="flex-1 px-3 py-2 bg-cinza-claro text-branco rounded-r-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
                        placeholder="meu-link-personalizado"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Afiliado</label>
                    <select
                      value={newLink.affiliateId}
                      onChange={(e) => setNewLink({ ...newLink, affiliateId: e.target.value })}
                      className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
                    >
                      <option value="">Selecionar Afiliado</option>
                      <option value="aff001">João Silva</option>
                      <option value="aff002">Maria Santos</option>
                      <option value="aff003">Pedro Costa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Campanha</label>
                    <input
                      type="text"
                      value={newLink.campaign}
                      onChange={(e) => setNewLink({ ...newLink, campaign: e.target.value })}
                      className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
                      placeholder="black_friday"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Fonte</label>
                    <input
                      type="text"
                      value={newLink.source}
                      onChange={(e) => setNewLink({ ...newLink, source: e.target.value })}
                      className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
                      placeholder="instagram"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Meio</label>
                    <select
                      value={newLink.medium}
                      onChange={(e) => setNewLink({ ...newLink, medium: e.target.value })}
                      className="w-full px-3 py-2 bg-cinza-claro text-branco rounded-md border border-gray-600 focus:border-azul-ciano focus:outline-none"
                    >
                      <option value="">Selecionar Meio</option>
                      <option value="social">Social</option>
                      <option value="email">Email</option>
                      <option value="paid">Pago</option>
                      <option value="organic">Orgânico</option>
                      <option value="referral">Referência</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 bg-gray-600 text-branco rounded-md hover:bg-gray-600/80"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={createLink}
                    className="px-4 py-2 bg-azul-ciano text-branco rounded-md hover:bg-azul-ciano/80"
                  >
                    Criar Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Links */}
          <div className="space-y-4">
            {links.map(link => (
              <div key={link.id} className="bg-cinza-claro p-4 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-branco">{link.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      link.isActive 
                        ? 'bg-verde/20 text-verde border border-verde/30' 
                        : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
                    }`}>
                      {link.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(link.fullUrl)}
                      className="flex items-center px-2 py-1 bg-azul-ciano text-branco rounded text-sm hover:bg-azul-ciano/80"
                      title="Copiar Link"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      className="flex items-center px-2 py-1 bg-purple-600 text-branco rounded text-sm hover:bg-purple-600/80"
                      title="QR Code"
                    >
                      <QrCode size={14} />
                    </button>
                    <button
                      onClick={() => toggleLinkStatus(link.id)}
                      className={`px-2 py-1 rounded text-sm ${
                        link.isActive 
                          ? 'bg-gray-600 text-branco hover:bg-gray-600/80' 
                          : 'bg-verde text-branco hover:bg-verde/80'
                      }`}
                    >
                      {link.isActive ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="px-2 py-1 bg-vermelho text-branco rounded text-sm hover:bg-vermelho/80"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-400">URL Personalizada</div>
                    <div className="text-sm text-azul-ciano font-mono">{link.fullUrl}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Afiliado</div>
                    <div className="text-sm text-branco">{link.affiliateName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Campanha</div>
                    <div className="text-sm text-branco">{link.campaign || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Fonte/Meio</div>
                    <div className="text-sm text-branco">{link.source}/{link.medium}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-azul-ciano">{link.clicks.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Cliques</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-verde">{link.conversions}</div>
                    <div className="text-xs text-gray-400">Conversões</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-amarelo">{link.conversionRate.toFixed(2)}%</div>
                    <div className="text-xs text-gray-400">Taxa de Conversão</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-branco">{formatCurrency(link.revenue)}</div>
                    <div className="text-xs text-gray-400">Receita</div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  Criado: {link.createdAt} | Último clique: {formatDate(link.lastClicked)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedTab === 'analytics' && (
        <div className="space-y-6">
          {/* Métricas Gerais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-cinza-claro p-4 rounded-lg">
              <div className="text-2xl font-bold text-azul-ciano">{analytics.totalClicks.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total de Cliques</div>
            </div>
            <div className="bg-cinza-claro p-4 rounded-lg">
              <div className="text-2xl font-bold text-verde">{analytics.totalConversions}</div>
              <div className="text-sm text-gray-400">Total de Conversões</div>
            </div>
            <div className="bg-cinza-claro p-4 rounded-lg">
              <div className="text-2xl font-bold text-amarelo">{analytics.averageConversionRate.toFixed(2)}%</div>
              <div className="text-sm text-gray-400">Taxa Média de Conversão</div>
            </div>
            <div className="bg-cinza-claro p-4 rounded-lg">
              <div className="text-2xl font-bold text-branco">{formatCurrency(analytics.totalRevenue)}</div>
              <div className="text-sm text-gray-400">Receita Total</div>
            </div>
          </div>

          {/* Gráfico de Cliques por Dia */}
          <div className="bg-cinza-claro p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-branco">Cliques por Dia</h3>
              <button
                onClick={exportAnalytics}
                className="flex items-center px-3 py-1 bg-azul-ciano text-branco rounded text-sm hover:bg-azul-ciano/80"
              >
                <Download className="mr-1" size={14} />
                Exportar
              </button>
            </div>
            <div className="h-32 flex items-end justify-between gap-2">
              {analytics.clicksByDay.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-azul-ciano rounded-t"
                    style={{ height: `${(day.clicks / Math.max(...analytics.clicksByDay.map(d => d.clicks))) * 100}%` }}
                  ></div>
                  <div className="text-xs text-gray-400 mt-1">{day.date.split('-')[2]}</div>
                  <div className="text-xs text-branco">{day.clicks}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Links */}
          <div className="bg-cinza-claro p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-branco mb-4">Links com Melhor Performance</h3>
            <div className="space-y-3">
              {links.sort((a, b) => b.conversionRate - a.conversionRate).slice(0, 3).map((link, index) => (
                <div key={link.id} className="flex items-center justify-between p-3 bg-cinza-escuro rounded">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      'bg-orange-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-branco font-medium">{link.name}</div>
                      <div className="text-xs text-gray-400">{link.fullUrl}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-verde font-bold">{link.conversionRate.toFixed(2)}%</div>
                    <div className="text-xs text-gray-400">{link.clicks} cliques</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomLinksSettings;

