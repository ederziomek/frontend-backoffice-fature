import React, { useState } from 'react';
// import { Button } from '@/components/ui/button'; // Unused import
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Edit2, PlusCircle, Trash2 } from 'lucide-react'; // Unused imports

interface PaymentMethod {
  id: string;
  name: string;
  status: 'Ativo' | 'Inativo';
  exampleFields: { label: string; value: string }[];
  // fee?: string; // Omitted for mock simplicity
  // minLimit?: number; // Omitted for mock simplicity
  // maxLimit?: number; // Omitted for mock simplicity
}

const mockMethods: PaymentMethod[] = [
  {
    id: 'pm1',
    name: 'PIX',
    status: 'Ativo',
    exampleFields: [
      { label: 'Tipo de Chave Exemplo', value: 'CPF' },
      { label: 'Chave PIX Exemplo', value: '***.123.456-**' },
    ],
  },
  {
    id: 'pm2',
    name: 'Transferência Bancária (TED/DOC)',
    status: 'Ativo',
    exampleFields: [
      { label: 'Banco Exemplo', value: '001 - Banco do Brasil' },
      { label: 'Agência Exemplo', value: '1234-5' },
      { label: 'Conta Corrente Exemplo', value: '98765-4' },
    ],
  },
  {
    id: 'pm3',
    name: 'Carteira Digital XPTO',
    status: 'Inativo',
    exampleFields: [
      { label: 'ID Usuário Carteira Exemplo', value: 'user@xpto.com' },
    ],
  },
];

const PaymentMethodsPage: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>(mockMethods);

  const toggleStatus = (id: string) => {
    setMethods(prevMethods =>
      prevMethods.map(method =>
        method.id === id
          ? { ...method, status: method.status === 'Ativo' ? 'Inativo' : 'Ativo' }
          : method
      )
    );
    alert(`Status do método ${id} alterado (mock).`);
  };

  // Add/Edit functionality is not required for this mock as per user feedback
  // const handleAddMethod = () => alert('Adicionar novo método (mock).');
  // const handleEditMethod = (id: string) => alert(`Editar método ${id} (mock).`);

  return (
    <div className="p-1 md:p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-branco font-sora">Configurar Métodos de Pagamento</h1>
        {/* Button to add new method - Omitted as per user's simplification for mock
        <Button onClick={handleAddMethod} className="bg-azul-ciano hover:bg-azul-ciano/80 text-branco">
          <PlusCircle size={18} className="mr-2" /> Adicionar Novo Método
        </Button>
        */}
      </div>

      <p className="text-sm text-gray-400 mb-4">
        Visualize os métodos de pagamento disponíveis e seus status. A adição e edição complexas foram simplificadas para este mockup, exibindo apenas exemplos fixos.
      </p>

      <div className="bg-cinza-escuro rounded-lg shadow-md overflow-x-auto">
        <Table className="text-branco">
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-700/20">
              <TableHead className="text-azul-ciano">Nome do Método</TableHead>
              <TableHead className="text-azul-ciano">Campos de Exemplo (Solicitados ao Afiliado)</TableHead>
              <TableHead className="text-azul-ciano text-center">Status</TableHead>
              <TableHead className="text-azul-ciano text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.map(method => (
              <TableRow key={method.id} className="border-gray-700 hover:bg-gray-700/30">
                <TableCell className="font-medium">{method.name}</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside text-xs space-y-0.5">
                    {method.exampleFields.map(field => (
                      <li key={field.label}><span className="font-semibold">{field.label}:</span> {field.value}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${method.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {method.status}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={method.status === 'Ativo'}
                    onCheckedChange={() => toggleStatus(method.id)}
                    className="data-[state=checked]:bg-azul-ciano data-[state=unchecked]:bg-gray-600"
                  />
                  {/* Edit button - Omitted as per user's simplification for mock
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300 ml-2" onClick={() => handleEditMethod(method.id)}>
                    <Edit2 size={16} />
                  </Button> 
                  */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;

