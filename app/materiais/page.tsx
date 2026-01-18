'use client';

import { useEffect, useState } from 'react';
import { listarMateriais, deletarMaterial, Material } from "../../src/services/materiaisService"
import Link from 'next/link';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { useAuth } from '../../src/contexts/AuthContext';

function MateriaisContent() {
  const { user, signOut } = useAuth();
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarMateriais();
  }, []);

  const carregarMateriais = async () => {
    setCarregando(true);
    const dados = await listarMateriais();
    setMateriais(dados);
    setCarregando(false);
  };

  const handleDeletar = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este material?')) {
      const resultado = await deletarMaterial(id);
      if (resultado.success) {
        carregarMateriais();
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando materiais...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20 sm:p-8 bg-gray-50">
      {/* Header com info do usuário */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-3">
          {user?.photoURL && (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'Usuário'}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">{user?.displayName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Sair
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Materiais</h1>
        <Link 
          href="/materiais/novo"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          + Novo Material
        </Link>
      </div>

      {materiais.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 mb-4">Nenhum material cadastrado ainda</p>
          <Link 
            href="/materiais/novo"
            className="text-purple-600 hover:underline"
          >
            Cadastrar primeiro material
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materiais.map((material) => (
            <div 
              key={material.id} 
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{material.nome}</h3>
              <p className="text-sm text-gray-600 mb-1">Tipo: {material.tipo}</p>
              <p className="text-sm text-gray-600 mb-1">
                Quantidade: {material.quantidade} {material.unidade}
              </p>
              <p className="text-sm font-medium text-green-600 mb-3">
                R$ {material.precoUnitario.toFixed(2)}/{material.unidade}
              </p>
              
              {material.observacoes && (
                <p className="text-xs text-gray-500 mb-3 italic">
                  {material.observacoes}
                </p>
              )}

              <div className="flex gap-2 mt-4">
                <button className="flex-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors">
                  Editar
                </button>
                <button 
                  onClick={() => handleDeletar(material.id!)}
                  className="flex-1 text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded hover:bg-red-100 transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MateriaisPage() {
  return (
    <ProtectedRoute>
      <MateriaisContent />
    </ProtectedRoute>
  );
}
