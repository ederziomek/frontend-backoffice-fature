import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockAffiliates, Affiliate } from '../../components/affiliates/AffiliateTable'; // Assuming mockAffiliates is exported for editing

// Helper to generate a unique ID for new affiliates (mock)
const generateNewAffiliateId = () => {
  const lastId = mockAffiliates.length > 0 ? parseInt(mockAffiliates[mockAffiliates.length - 1].id.replace('AF', '')) : 0;
  return `AF${(lastId + 1).toString().padStart(3, '0')}`;
};

const AffiliateFormPage: React.FC = () => {
  const { affiliateId } = useParams<{ affiliateId: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(affiliateId);

  const [formData, setFormData] = useState<Partial<Affiliate>>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    // dataNascimento: '', // React handles date inputs a bit differently, will use string
    cnpj: '',
    companyName: '', // Assuming 'nome da empresa' maps to companyName
    address: '', // Placeholder for a more complex address object/fields
    bankDetails: '', // Placeholder for bank details
    upline: '',
    category: 'Jogador', // Default category
    status: 'Ativo', // Default status as per user feedback
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  useEffect(() => {
    if (isEditing && affiliateId) {
      const affiliateToEdit = mockAffiliates.find(aff => aff.id === affiliateId);
      if (affiliateToEdit) {
        setFormData(affiliateToEdit);
        // Assuming dataNascimento is not directly in Affiliate type, or needs specific handling
        // For mock, if it were stored, it would be set here.
        // setDataNascimento(affiliateToEdit.dataNascimento || ''); 
      }
    }
  }, [isEditing, affiliateId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataNascimento(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing && password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    // Mock submission logic
    const submissionData = {
      ...formData,
      id: isEditing ? affiliateId : generateNewAffiliateId(),
      registrationDate: isEditing ? formData.registrationDate : new Date().toISOString().split('T')[0],
      // dataNascimento: dataNascimento, // Include if needed
    };

    if (isEditing) {
      const index = mockAffiliates.findIndex(aff => aff.id === affiliateId);
      if (index !== -1) {
        mockAffiliates[index] = submissionData as Affiliate;
      }
    } else {
      mockAffiliates.push(submissionData as Affiliate);
    }
    
    console.log('Form submitted (mock):', submissionData);
    alert(isEditing ? 'Afiliado atualizado com sucesso (mock)!' : 'Afiliado criado com sucesso (mock)!');
    navigate('/affiliates');
  };

  return (
    <div className="p-4 bg-cinza-claro rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-branco mb-6 font-sora">
        {isEditing ? `Editar Afiliado: ${formData.name || ''}` : 'Cadastrar Novo Afiliado'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome Completo (obrigatório) */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome Completo *</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm" />
        </div>

        {/* E-mail (obrigatório, único) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">E-mail *</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm" />
        </div>

        {/* Telefone (obrigatório) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Telefone *</label>
          <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm" />
        </div>

        {/* CPF (obrigatório, único) */}
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-300 mb-1">CPF *</label>
          <input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleChange} required className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm" placeholder="000.000.000-00" />
        </div>

        {/* Data de Nascimento (obrigatório) */}
        <div>
          <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-300 mb-1">Data de Nascimento *</label>
          <input type="date" name="dataNascimento" id="dataNascimento" value={dataNascimento} onChange={handleDateChange} required className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm" />
        </div>

        {/* CNPJ (obrigatório) */}
        <div>
          <label htmlFor="cnpj" className="block text-sm font-medium text-gray-300 mb-1">CNPJ *</label>
          <input type="text" name="cnpj" id="cnpj" value={formData.cnpj} onChange={handleChange} required className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm" placeholder="00.000.000/0000-00" />
        </div>

        {/* Nome da Empresa (obrigatório) */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-1">Nome da Empresa *</label>
          <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange} required className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm" />
        </div>
        
        {/* Senha (obrigatório na criação) */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Senha {isEditing ? '(Deixe em branco para não alterar)' : '*'}</label>
          <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!isEditing} className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm" />
        </div>

        {/* Confirmar Senha (obrigatório na criação ou se senha for alterada) */} 
        {(!isEditing || password) && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirmar Senha *</label>
            <input type="password" name="confirmPassword" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required={!isEditing || Boolean(password)} className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm" />
          </div>
        )}

        {/* Upline (opcional, campo para buscar e selecionar um afiliado existente como upline) */}
        <div>
          <label htmlFor="upline" className="block text-sm font-medium text-gray-300 mb-1">Upline (ID do Afiliado)</label>
          <input type="text" name="upline" id="upline" value={formData.upline} onChange={handleChange} className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm" placeholder="Ex: AF001" />
        </div>

        {/* Categoria/Level Inicial (dropdown para selecionar, se aplicável no momento do cadastro manual) */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Categoria/Level</label>
          <select name="category" id="category" value={formData.category} onChange={handleChange} className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm">
            <option value="Jogador">Jogador</option>
            <option value="Iniciante">Iniciante</option>
            <option value="Afiliado">Afiliado</option>
            <option value="Profissional">Profissional</option>
            {/* Add more categories as needed */}
          </select>
        </div>

        {isEditing && (
             <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm">
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Bloqueado">Bloqueado</option>
                    <option value="Pendente">Pendente</option>
                </select>
            </div>
        )}

        {/* Endereço Completo (CEP com busca automática de endereço, Rua, Número, Complemento, Bairro, Cidade, Estado) - Simplified for now */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">Endereço (Simplificado)</label>
          <textarea name="address" id="address" value={formData.address} onChange={handleChange} rows={3} className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm" placeholder="Rua, Número, Bairro, Cidade, Estado, CEP"></textarea>
        </div>

        {/* Dados Bancários para Pagamento de Comissões (Banco, Agência, Conta, Tipo de Conta, Nome do Titular, CPF/CNPJ do Titular) - Simplified for now */}
        <div>
          <label htmlFor="bankDetails" className="block text-sm font-medium text-gray-300 mb-1">Dados Bancários (Simplificado)</label>
          <textarea name="bankDetails" id="bankDetails" value={formData.bankDetails} onChange={handleChange} rows={3} className="w-full p-2 rounded bg-cinza-escuro border border-gray-700 focus:border-azul-ciano outline-none text-sm" placeholder="Banco, Agência, Conta, Tipo, Titular, CPF/CNPJ Titular"></textarea>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Link 
            to="/affiliates"
            className="px-6 py-2 text-sm font-medium text-azul-ciano bg-cinza-escuro rounded-md hover:bg-gray-700 border border-azul-ciano"
          >
            Cancelar
          </Link>
          <button 
            type="submit" 
            className="px-6 py-2 text-sm font-bold text-branco bg-azul-ciano rounded-md hover:bg-opacity-80"
            style={{fontWeight: 900, fontSize: '12px', borderRadius: '5px', padding: '8px 24px'}}
          >
            {isEditing ? 'Atualizar Afiliado' : 'Criar Afiliado'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AffiliateFormPage;

