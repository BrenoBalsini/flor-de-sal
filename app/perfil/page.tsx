'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import Layout from '../../src/components/Layout';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import {
  buscarConfiguracoes,
  salvarConfiguracoes,
  Configuracoes,
  calcularValorPorMinuto
} from '../../src/services/configuracoesService';
import { Settings, DollarSign, Save, Info, TrendingUp, Clock } from 'lucide-react';

function PerfilContent() {
  const { user, signOut } = useAuth();
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  
  const [config, setConfig] = useState<Configuracoes | null>(null);

  useEffect(() => {
    if (user) {
      carregarConfiguracoes();
    }
  }, [user]);

  const carregarConfiguracoes = async () => {
    if (!user?.uid) return;
    
    setCarregando(true);
    const dados = await buscarConfiguracoes(user.uid);
    setConfig(dados);
    setCarregando(false);
  };

  const handleChange = (campo: string, valor: any) => {
    if (!config) return;
    
    setConfig({
      ...config,
      [campo]: parseFloat(valor) || 0
    });
  };

  const handleSalvar = async () => {
    if (!config || !user?.uid) return;
    
    setSalvando(true);
    const resultado = await salvarConfiguracoes(user.uid, config);
    
    if (resultado.success) {
      alert('Configurações salvas com sucesso! ✅');
    } else {
      alert('Erro ao salvar configurações');
    }
    
    setSalvando(false);
  };

  const handleSignOut = async () => {
    if (confirm('Deseja sair da sua conta?')) {
      try {
        await signOut();
      } catch (error) {
        console.error('Erro ao sair:', error);
      }
    }
  };

  if (carregando || !config) {
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
          <p style={{ color: '#6B7280' }}>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  const valorPorMinuto = calcularValorPorMinuto(config.valorPorHora);

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Settings size={32} color="#00FFCC" />
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              Configurações
            </h1>
          </div>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
            Configure os valores para calcular o preço dos seus produtos
          </p>
        </div>

        {/* Card de Info */}
        <div style={{
          backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Info size={20} color="#3B82F6" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '14px', color: '#1E40AF', margin: '0 0 8px 0', fontWeight: '600' }}>
                Como funciona o cálculo?
              </p>
              <p style={{ fontSize: '13px', color: '#1E3A8A', margin: 0, lineHeight: '1.5' }}>
                <strong>Preço Final</strong> = (Custo dos Materiais + Mão de Obra) × (1 + Margem de Lucro %)
              </p>
            </div>
          </div>
        </div>

        {/* Perfil do Usuário */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            👤 Seu Perfil
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            {user?.photoURL && (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'Usuário'}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '3px solid #00FFCC'
                }}
              />
            )}
            <div>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                {user?.displayName}
              </p>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
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
              transition: 'all 0.2s'
            }}
          >
            🚪 Sair da Conta
          </button>
        </div>

        {/* Configurações de Precificação */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={20} color="#00FFCC" />
            Precificação
          </h2>

          {/* Valor por Hora */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              <Clock size={18} color="#6B7280" />
              Valor da sua hora de trabalho (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={config.valorPorHora}
              onChange={(e) => handleChange('valorPorHora', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #D1D5DB',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00FFCC';
                e.target.style.backgroundColor = '#F0FDFA';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D1D5DB';
                e.target.style.backgroundColor = 'white';
              }}
            />
            <div style={{
              backgroundColor: '#F0FDFA',
              border: '1px solid #6EE7B7',
              borderRadius: '8px',
              padding: '10px 12px',
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Info size={16} color="#059669" />
              <p style={{ fontSize: '13px', color: '#047857', margin: 0 }}>
                Isso equivale a <strong>R$ {valorPorMinuto.toFixed(2)}/minuto</strong>
              </p>
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '8px 0 0 0', lineHeight: '1.5' }}>
              💡 Dica: Considere suas habilidades, experiência e o valor do mercado local
            </p>
          </div>

          {/* Margem de Lucro */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              <TrendingUp size={18} color="#6B7280" />
              Margem de lucro (%)
            </label>
            <input
              type="number"
              min="0"
              max="500"
              step="1"
              value={config.margemLucro}
              onChange={(e) => handleChange('margemLucro', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #D1D5DB',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00FFCC';
                e.target.style.backgroundColor = '#F0FDFA';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D1D5DB';
                e.target.style.backgroundColor = 'white';
              }}
            />
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '8px 0 0 0', lineHeight: '1.5' }}>
              💡 Margem recomendada: <strong>30% a 100%</strong> (produtos artesanais geralmente usam 50-80%)
            </p>
          </div>

          {/* Exemplo de cálculo */}
          <div style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FCD34D',
            borderRadius: '10px',
            padding: '16px',
            marginTop: '20px'
          }}>
            <p style={{ fontSize: '14px', color: '#92400E', fontWeight: '600', margin: '0 0 10px 0' }}>
              📊 Exemplo de cálculo:
            </p>
            <div style={{ fontSize: '13px', color: '#78350F', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 6px 0' }}>
                • Materiais: R$ 10,00
              </p>
              <p style={{ margin: '0 0 6px 0' }}>
                • Tempo: 1 hora = R$ {config.valorPorHora.toFixed(2)}
              </p>
              <p style={{ margin: '0 0 6px 0' }}>
                • Custo total: R$ {(10 + config.valorPorHora).toFixed(2)}
              </p>
              <p style={{ margin: '0 0 6px 0' }}>
                • Margem de {config.margemLucro}%
              </p>
              <p style={{ margin: '6px 0 0 0', fontWeight: '700', fontSize: '14px', color: '#059669' }}>
                ✅ Preço final: R$ {((10 + config.valorPorHora) * (1 + config.margemLucro / 100)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Botão Salvar */}
        <button
          onClick={handleSalvar}
          disabled={salvando}
          style={{
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            backgroundColor: salvando ? '#9CA3AF' : '#00FFCC',
            color: '#111827',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: salvando ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            margin: '0 auto'
          }}
          onMouseEnter={(e) => {
            if (!salvando) {
              e.currentTarget.style.backgroundColor = '#00E6B8';
              e.currentTarget.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (!salvando) {
              e.currentTarget.style.backgroundColor = '#00FFCC';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          <Save size={20} />
          {salvando ? 'Salvando...' : 'Salvar Configurações'}
        </button>
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
          max-width: 700px;
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

export default function PerfilPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <PerfilContent />
      </Layout>
    </ProtectedRoute>
  );
}
