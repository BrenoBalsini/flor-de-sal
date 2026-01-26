'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import Layout from '../../src/components/Layout';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { listarProdutos, deletarProduto, Produto } from '../../src/services/produtosService';
import { History, Trash2, ChevronDown, ChevronUp, Package, Clock, DollarSign, TrendingUp } from 'lucide-react';

function HistoricoContent() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [produtoExpandido, setProdutoExpandido] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      carregarProdutos();
    }
  }, [user]);

  const carregarProdutos = async () => {
    if (!user?.uid) return;
    
    setCarregando(true);
    const dados = await listarProdutos(user.uid);
    setProdutos(dados);
    setCarregando(false);
  };

  const handleDeletar = async (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja deletar "${nome}" do histórico?`)) {
      const resultado = await deletarProduto(id);
      if (resultado.success) {
        carregarProdutos();
      }
    }
  };

  const toggleExpansao = (id: string) => {
    setProdutoExpandido(produtoExpandido === id ? null : id);
  };

  const formatarQuantidade = (material: any) => {
    if (material.tipoMedicao === 'unidade') {
      return `${material.quantidadeUsada} un`;
    } else if (material.tipoMedicao === 'comprimento') {
      return `${material.comprimentoUsado} cm`;
    } else {
      return `${material.larguraUsada}cm × ${material.alturaUsada}cm`;
    }
  };

  const formatarData = (timestamp: any) => {
    const data = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
          <p style={{ color: '#6B7280' }}>Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <History size={32} color="#00FFCC" />
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              Histórico
            </h1>
          </div>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
            Produtos calculados anteriormente com preços salvos
          </p>
        </div>



        {/* Lista de produtos */}
        {produtos.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '64px 32px',
            textAlign: 'center',
            border: '2px dashed #E5E7EB'
          }}>
            <History size={64} strokeWidth={1.5} style={{ color: '#9CA3AF', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              Nenhum produto no histórico
            </h3>
            <p style={{ color: '#6B7280', marginBottom: '24px' }}>
              Produtos calculados e salvos aparecerão aqui
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {produtos.map((produto) => {
              const expandido = produtoExpandido === produto.id;
              
              return (
                <div
                  key={produto.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}
                >
                  {/* Cabeçalho do card */}
                  <div
                    onClick={() => toggleExpansao(produto.id!)}
                    style={{
                      padding: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
                        {produto.nome}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Package size={14} />
                          {produto.materiais.length} {produto.materiais.length === 1 ? 'material' : 'materiais'}
                        </span>
                        <span style={{ fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} />
                          {produto.tempoProducaoMinutos} min
                        </span>
                        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                          📅 {formatarData(produto.criadoEm)}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px 0' }}>Preço</p>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                          R$ {produto.precoFinal.toFixed(2)}
                        </p>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpansao(produto.id!);
                        }}
                        style={{
                          padding: '8px',
                          backgroundColor: '#F3F4F6',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                        {expandido ? <ChevronUp size={20} color="#6B7280" /> : <ChevronDown size={20} color="#6B7280" />}
                      </button>
                    </div>
                  </div>

                  {/* Detalhes expandidos */}
                  {expandido && (
                    <div style={{
                      borderTop: '1px solid #F3F4F6',
                      padding: '20px',
                      backgroundColor: '#F9FAFB'
                    }}>
                      {/* Breakdown de custos */}
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>
                          💰 Breakdown de Custos
                        </h4>
                        <div style={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          padding: '12px',
                          border: '1px solid #E5E7EB'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ fontSize: '13px', color: '#6B7280' }}>Custo dos materiais:</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>R$ {produto.custoMateriais.toFixed(2)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ fontSize: '13px', color: '#6B7280' }}>Mão de obra ({produto.tempoProducaoMinutos} min):</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>R$ {produto.custoMaoDeObra.toFixed(2)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ fontSize: '13px', color: '#6B7280' }}>Custo total:</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>R$ {produto.custoTotal.toFixed(2)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ fontSize: '13px', color: '#6B7280' }}>Margem de lucro:</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{produto.margemLucro}%</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                            <span style={{ fontSize: '14px', color: '#059669', fontWeight: '600' }}>Preço final:</span>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#059669' }}>R$ {produto.precoFinal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Lista de materiais */}
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>
                          📦 Materiais Utilizados
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {produto.materiais.map((material, index) => (
                            <div
                              key={index}
                              style={{
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                padding: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '12px'
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                                  {material.nome}
                                </p>
                                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                                  {formatarQuantidade(material)} • Preço/unidade: R$ {material.precoPorUnidadeBase.toFixed(4)}
                                </p>
                              </div>
                              <div style={{
                                backgroundColor: '#ECFDF5',
                                padding: '6px 10px',
                                borderRadius: '6px'
                              }}>
                                <p style={{ fontSize: '13px', fontWeight: '600', color: '#059669', margin: 0 }}>
                                  R$ {material.custoTotal.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Configurações usadas */}
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>
                          ⚙️ Configurações Usadas
                        </h4>
                        <div style={{
                          backgroundColor: '#FEF3C7',
                          border: '1px solid #FDE68A',
                          borderRadius: '8px',
                          padding: '12px',
                          display: 'flex',
                          gap: '16px',
                          flexWrap: 'wrap'
                        }}>
                          <div>
                            <p style={{ fontSize: '12px', color: '#92400E', margin: '0 0 2px 0' }}>Valor/hora</p>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#78350F', margin: 0 }}>
                              R$ {produto.valorPorHora.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: '12px', color: '#92400E', margin: '0 0 2px 0' }}>Margem</p>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#78350F', margin: 0 }}>
                              {produto.margemLucro}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Botão deletar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletar(produto.id!, produto.nome);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FECACA'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                      >
                        <Trash2 size={16} />
                        Remover do Histórico
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .page-container {
          min-height: 100vh;
          background-color: #F9FAFB;
        }

        .content-wrapper {
          padding: 16px;
          max-width: 900px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .content-wrapper {
            padding: 32px 40px;
          }
        }
      `}</style>
    </div>
  );
}

export default function HistoricoPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <HistoricoContent />
      </Layout>
    </ProtectedRoute>
  );
}
