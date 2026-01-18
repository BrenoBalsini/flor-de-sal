'use client';

// **LISTA DE MATERIAIS**

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { criarMaterial } from "@/services/materiaisService"

export default function NovoMaterialPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    quantidade: 0,
    unidade: '',
    precoUnitario: 0,
    fornecedor: '',
    observacoes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    const resultado = await criarMaterial(formData);
    
    if (resultado.success) {
      router.push('/materiais'); // Redireciona para a lista
    } else {
      alert('Erro ao criar material');
    }
    
    setCarregando(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantidade' || name === 'precoUnitario' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Novo Material</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do Material *
            </label>
            <input
              type="text"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Tecido de algodão"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tipo *
            </label>
            <select
              name="tipo"
              required
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecione...</option>
              <option value="tecido">Tecido</option>
              <option value="linha">Linha</option>
              <option value="botao">Botão</option>
              <option value="ziper">Zíper</option>
              <option value="aviamento">Aviamento</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          {/* Quantidade e Unidade */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Quantidade *
              </label>
              <input
                type="number"
                name="quantidade"
                required
                min="0"
                step="0.01"
                value={formData.quantidade}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Unidade *
              </label>
              <select
                name="unidade"
                required
                value={formData.unidade}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione...</option>
                <option value="metro">Metro</option>
                <option value="unidade">Unidade</option>
                <option value="grama">Grama</option>
                <option value="kg">Quilograma</option>
                <option value="rolo">Rolo</option>
              </select>
            </div>
          </div>

          {/* Preço Unitário */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Preço Unitário (R$) *
            </label>
            <input
              type="number"
              name="precoUnitario"
              required
              min="0"
              step="0.01"
              value={formData.precoUnitario}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0.00"
            />
          </div>

          {/* Fornecedor */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Fornecedor
            </label>
            <input
              type="text"
              name="fornecedor"
              value={formData.fornecedor}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Loja ABC"
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Observações
            </label>
            <textarea
              name="observacoes"
              rows={3}
              value={formData.observacoes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Informações adicionais..."
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {carregando ? 'Salvando...' : 'Salvar Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
