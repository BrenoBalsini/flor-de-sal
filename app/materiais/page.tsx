'use client';

import { useEffect, useState } from 'react';
import { listarMateriais, deletarMaterial, Material } from '../../src/services/materiaisService';
import Link from 'next/link';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import Layout from '../../src/components/Layout';
import { useAuth } from '../../src/contexts/AuthContext';
import { Plus, Edit2, Trash2, PackageOpen } from 'lucide-react';

function MateriaisContent() {
  const { user } = useAuth();
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (user) {
      carregarMateriais();
    }
  }, [user]);

  const carregarMateriais = async () => {
    if (!user?.uid) return;
    
    setCarregando(true);
    const dados = await listarMateriais(user.uid);
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

  const formatarQuantidadeComprada = (material: Material) => {
    if (material.tipoMedicao === 'area' && material.larguraComprada && material.alturaComprada) {
      return `${material.larguraComprada}cm × ${material.alturaComprada}cm`;
    } else if (material.tipoMedicao === 'comprimento' && material.comprimentoComprado) {
      return `${material.comprimentoComprado} cm`;
    } else {
      return `${material.quantidadeComprada} un`;
    }
  };

  const getTipoIcone = (tipo: string) => {
    const icones: Record<string, string> = {
      unidade: '📦',
      comprimento: '📏',
      area: '🧵'
    };
    return icones[tipo] || '📦';
  };

  if (carregando) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #00FFCC',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#6B7280' }}>Carregando materiais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Desktop/Mobile Content */}
      <div className="content-wrapper">
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#111827',
              margin: 0 
            }}>
              Materiais
            </h1>
            <Link 
              href="/materiais/novo"
              className="btn-novo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#00FFCC',
                color: '#111827',
                fontWeight: '600',
                padding: '12px 20px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              <Plus size={20} strokeWidth={2.5} />
              <span className="btn-text">Novo Material</span>
            </Link>
          </div>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
            Gerencie todos os seus materiais de artesanato
          </p>
        </div>

        {/* Lista vazia ou com materiais */}
        {materiais.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '64px 32px',
            textAlign: 'center',
            border: '2px dashed #E5E7EB'
          }}>
            <PackageOpen size={64} strokeWidth={1.5} style={{ color: '#9CA3AF', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              Nenhum material cadastrado
            </h3>
            <p style={{ color: '#6B7280', marginBottom: '24px' }}>
              Comece adicionando seus primeiros materiais
            </p>
            <Link 
              href="/materiais/novo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#00FFCC',
                color: '#111827',
                fontWeight: '600',
                padding: '12px 24px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              <Plus size={20} />
              <span>Adicionar Primeiro Material</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop: Tabela */}
            <div className="desktop-table" style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 2fr 1.5fr 1fr 120px',
                gap: '16px',
                padding: '16px 20px',
                backgroundColor: '#F9FAFB',
                borderBottom: '1px solid #E5E7EB',
                fontSize: '13px',
                fontWeight: '600',
                color: '#6B7280'
              }}>
                <div></div>
                <div>Material</div>
                <div>Quantidade Comprada</div>
                <div>Preço de Compra</div>
                <div style={{ textAlign: 'center' }}>Ações</div>
              </div>

              {materiais.map((material, index) => (
                <div 
                  key={material.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 2fr 1.5fr 1fr 120px',
                    gap: '16px',
                    padding: '16px 20px',
                    borderBottom: index < materiais.length - 1 ? '1px solid #F3F4F6' : 'none',
                    alignItems: 'center',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* Ícone */}
                  <div style={{ fontSize: '24px' }}>
                    {getTipoIcone(material.tipoMedicao)}
                  </div>

                  {/* Nome e fornecedor */}
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 2px 0' }}>
                      {material.nome}
                    </p>
                    {material.fornecedor && (
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                        {material.fornecedor}
                      </p>
                    )}
                    {material.observacoes && (
                      <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0 0', fontStyle: 'italic' }}>
                        {material.observacoes}
                      </p>
                    )}
                  </div>

                  {/* Quantidade */}
                  <div style={{ fontSize: '14px', color: '#374151' }}>
                    {formatarQuantidadeComprada(material)}
                  </div>

                  {/* Preço */}
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                    R$ {material.precoCompra.toFixed(2)}
                  </div>

                  {/* Ações */}
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <Link 
                      href={`/materiais/${material.id}/editar`}
                      title="Editar"
                      style={{
                        backgroundColor: '#F3F4F6',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                    >
                      <Edit2 size={16} color="#6B7280" />
                    </Link>
                    <button 
                      onClick={() => handleDeletar(material.id!)}
                      title="Deletar"
                      style={{
                        backgroundColor: '#FEE2E2',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FECACA'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                    >
                      <Trash2 size={16} color="#DC2626" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: Cards */}
            <div className="mobile-cards" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {materiais.map((material) => (
                <div 
                  key={material.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E5E7EB'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '32px' }}>{getTipoIcone(material.tipoMedicao)}</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>
                        {material.nome}
                      </h3>
                      {material.fornecedor && (
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px 0' }}>
                          {material.fornecedor}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Detalhes */}
                  <div style={{ 
                    backgroundColor: '#F9FAFB', 
                    borderRadius: '8px', 
                    padding: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', color: '#6B7280' }}>Quantidade:</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>
                        {formatarQuantidadeComprada(material)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: '#6B7280' }}>Preço:</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                        R$ {material.precoCompra.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {material.observacoes && (
                    <p style={{ fontSize: '12px', color: '#6B7280', fontStyle: 'italic', margin: '0 0 12px 0' }}>
                      {material.observacoes}
                    </p>
                  )}

                  {/* Botões */}
                  <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
                    <Link 
                      href={`/materiais/${material.id}/editar`}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        backgroundColor: '#F3F4F6',
                        color: '#374151',
                        padding: '10px',
                        borderRadius: '10px',
                        border: 'none',
                        fontWeight: '500',
                        fontSize: '14px',
                        cursor: 'pointer',
                        textDecoration: 'none'
                      }}
                    >
                      <Edit2 size={16} />
                      Editar
                    </Link>
                    <button 
                      onClick={() => handleDeletar(material.id!)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        backgroundColor: '#FEE2E2',
                        color: '#DC2626',
                        padding: '10px',
                        borderRadius: '10px',
                        border: 'none',
                        fontWeight: '500',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Mobile First */
        .desktop-table {
          display: none;
        }

        .mobile-cards {
          display: block;
        }

        .page-container {
          min-height: 100vh;
          background-color: #F9FAFB;
        }

        .content-wrapper {
          padding: 16px;
        }

        .btn-text {
          display: none;
        }

        .btn-novo {
          padding: 10px !important;
        }

        /* Desktop - a partir de 768px */
        @media (min-width: 768px) {
          .mobile-cards {
            display: none !important;
          }

          .desktop-table {
            display: block;
          }

          .content-wrapper {
            padding: 32px 40px;
            max-width: 1400px;
          }

          .btn-text {
            display: inline;
          }

          .btn-novo {
            padding: 12px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function MateriaisPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <MateriaisContent />
      </Layout>
    </ProtectedRoute>
  );
}
