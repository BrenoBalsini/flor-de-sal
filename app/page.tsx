'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../src/contexts/AuthContext';
import Layout from '../src/components/Layout';
import ProtectedRoute from '../src/components/ProtectedRoute';
import { listarMateriais } from '../src/services/materiaisService';
import { listarProdutos } from '../src/services/produtosService';
import { buscarConfiguracoes } from '../src/services/configuracoesService';
import { Package, Calculator, History, TrendingUp, DollarSign, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [stats, setStats] = useState({
    totalMateriais: 0,
    valorInvestidoMateriais: 0,
    totalProdutos: 0,
    valorMedioProdutos: 0,
    produtoMaisCaro: null as any,
    produtoMaisBarato: null as any
  });

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user]);

  const carregarDados = async () => {
    if (!user?.uid) return;

    setCarregando(true);

    const [materiais, produtos, config] = await Promise.all([
      listarMateriais(user.uid),
      listarProdutos(user.uid),
      buscarConfiguracoes(user.uid)
    ]);

    const valorInvestido = materiais.reduce((acc, m) => acc + m.precoCompra, 0);
    const valorMedio = produtos.length > 0 
      ? produtos.reduce((acc, p) => acc + p.precoFinal, 0) / produtos.length 
      : 0;

    let maisCaro = null;
    let maisBarato = null;

    if (produtos.length > 0) {
      maisCaro = produtos.reduce((prev, current) => 
        prev.precoFinal > current.precoFinal ? prev : current
      );
      maisBarato = produtos.reduce((prev, current) => 
        prev.precoFinal < current.precoFinal ? prev : current
      );
    }

    setStats({
      totalMateriais: materiais.length,
      valorInvestidoMateriais: valorInvestido,
      totalProdutos: produtos.length,
      valorMedioProdutos: valorMedio,
      produtoMaisCaro: maisCaro,
      produtoMaisBarato: maisBarato
    });

    setCarregando(false);
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
          <p style={{ color: '#6B7280' }}>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
            Olá, {user?.displayName?.split(' ')[0]}!
          </h1>
          <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>
            Bem-vindo ao Flor de Sal
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <Link
            href="/materiais/novo"
            style={{
              background: 'linear-gradient(135deg, #00FFCC 0%, #00E6B8 100%)',
              borderRadius: '16px',
              padding: '24px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(0, 255, 204, 0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <Package size={24} color="#111827" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>
                Novo Material
              </h3>
              <p style={{ fontSize: '14px', color: '#0F172A', margin: 0 }}>
                Adicione materiais ao inventário
              </p>
            </div>
            <ArrowRight size={24} color="#111827" />
          </Link>

          <Link
            href="/calculadora"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              borderRadius: '16px',
              padding: '24px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <Calculator size={24} color="white" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>
                Calcular Preço
              </h3>
              <p style={{ fontSize: '14px', color: '#E0E7FF', margin: 0 }}>
                Precifique seus produtos
              </p>
            </div>
            <ArrowRight size={24} color="white" />
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {/* Total de Materiais */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#FEF3C7',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Package size={20} color="#F59E0B" />
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 6px 0' }}>
              Materiais Cadastrados
            </p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              {stats.totalMateriais}
            </p>
          </div>

          {/* Valor Investido */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#DCFCE7',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={20} color="#10B981" />
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 6px 0' }}>
              Investido em Materiais
            </p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', margin: 0 }}>
              R$ {stats.valorInvestidoMateriais.toFixed(2)}
            </p>
          </div>

          {/* Total de Produtos */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#E0E7FF',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <History size={20} color="#3B82F6" />
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 6px 0' }}>
              Produtos Calculados
            </p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              {stats.totalProdutos}
            </p>
          </div>

          {/* Preço Médio */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#F0FDFA',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={20} color="#00FFCC" />
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 6px 0' }}>
              Preço Médio
            </p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              {stats.totalProdutos > 0 ? `R$ ${stats.valorMedioProdutos.toFixed(2)}` : '—'}
            </p>
          </div>
        </div>

        {/* Produtos Destaque */}
        {stats.totalProdutos > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {/* Produto Mais Caro */}
            {stats.produtoMaisCaro && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '20px' }}>👑</div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6B7280', margin: 0 }}>
                    Produto Mais Caro
                  </h3>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
                  {stats.produtoMaisCaro.nome}
                </p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                  R$ {stats.produtoMaisCaro.precoFinal.toFixed(2)}
                </p>
              </div>
            )}

            {/* Produto Mais Barato */}
            {stats.produtoMaisBarato && stats.totalProdutos > 1 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '20px' }}>💎</div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6B7280', margin: 0 }}>
                    Produto Mais Barato
                  </h3>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
                  {stats.produtoMaisBarato.nome}
                </p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6', margin: 0 }}>
                  R$ {stats.produtoMaisBarato.precoFinal.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {stats.totalMateriais === 0 && stats.totalProdutos === 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '2px dashed #E5E7EB',
            padding: '48px 32px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎨</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              Comece sua jornada artesanal!
            </h3>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
              Adicione seus primeiros materiais e comece a calcular preços justos para seus produtos
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                <Package size={20} />
                Adicionar Material
              </Link>
              <Link
                href="/perfil"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  fontWeight: '600',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                ⚙️ Configurar Preços
              </Link>
            </div>
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
          max-width: 1200px;
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

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardContent />
      </Layout>
    </ProtectedRoute>
  );
}
