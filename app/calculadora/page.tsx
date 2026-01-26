'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import Layout from '../../src/components/Layout';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { listarMateriais, Material } from '../../src/services/materiaisService';
import { buscarConfiguracoes, Configuracoes, calcularValorPorMinuto } from '../../src/services/configuracoesService';
import { salvarProduto, MaterialUsado, calcularCustoMaterial } from '../../src/services/produtosService';
import { Calculator, Plus, Trash2, Edit2, Clock, Save, TrendingUp, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

function CalculadoraContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [config, setConfig] = useState<Configuracoes | null>(null);
  
  // Dados do produto
  const [nomeProduto, setNomeProduto] = useState('');
  const [materiaisUsados, setMateriaisUsados] = useState<MaterialUsado[]>([]);
  const [tempoProducao, setTempoProducao] = useState(0);
  const [margemLucroCustom, setMargemLucroCustom] = useState<number | null>(null);
  
  // Estado do formulário de adicionar material
  const [mostrarFormMaterial, setMostrarFormMaterial] = useState(false);
  const [materialSelecionado, setMaterialSelecionado] = useState<Material | null>(null);
  const [quantidadeUsada, setQuantidadeUsada] = useState(0);
  const [comprimentoUsado, setComprimentoUsado] = useState(0);
  const [larguraUsada, setLarguraUsada] = useState(0);
  const [alturaUsada, setAlturaUsada] = useState(0);
  
  // Edição
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  
  // Resultado
  const [calculado, setCalculado] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user]);

  const carregarDados = async () => {
    if (!user?.uid) return;
    
    setCarregando(true);
    const [materiaisData, configData] = await Promise.all([
      listarMateriais(user.uid),
      buscarConfiguracoes(user.uid)
    ]);
    
    setMateriais(materiaisData);
    setConfig(configData);
    setCarregando(false);
  };

  const handleSelecionarMaterial = (materialId: string) => {
    const material = materiais.find(m => m.id === materialId);
    if (material) {
      setMaterialSelecionado(material);
      setQuantidadeUsada(0);
      setComprimentoUsado(0);
      setLarguraUsada(0);
      setAlturaUsada(0);
    }
  };

  const handleAdicionarMaterial = () => {
    if (!materialSelecionado) return;
    
    const materialUsado: MaterialUsado = {
      materialId: materialSelecionado.id!,
      nome: materialSelecionado.nome,
      tipoMedicao: materialSelecionado.tipoMedicao,
      precoPorUnidadeBase: materialSelecionado.precoPorUnidadeBase,
      custoTotal: 0
    };
    
    // Adiciona as quantidades baseado no tipo
    if (materialSelecionado.tipoMedicao === 'unidade') {
      materialUsado.quantidadeUsada = quantidadeUsada;
    } else if (materialSelecionado.tipoMedicao === 'comprimento') {
      materialUsado.comprimentoUsado = comprimentoUsado;
    } else if (materialSelecionado.tipoMedicao === 'area') {
      materialUsado.larguraUsada = larguraUsada;
      materialUsado.alturaUsada = alturaUsada;
    }
    
    // Calcula o custo
    materialUsado.custoTotal = calcularCustoMaterial(materialUsado);
    
    // Adiciona ou atualiza
    if (editandoIndex !== null) {
      const novosMateriaisUsados = [...materiaisUsados];
      novosMateriaisUsados[editandoIndex] = materialUsado;
      setMateriaisUsados(novosMateriaisUsados);
      setEditandoIndex(null);
    } else {
      setMateriaisUsados([...materiaisUsados, materialUsado]);
    }
    
    // Reset
    setMostrarFormMaterial(false);
    setMaterialSelecionado(null);
    setQuantidadeUsada(0);
    setComprimentoUsado(0);
    setLarguraUsada(0);
    setAlturaUsada(0);
  };

  const handleEditarMaterial = (index: number) => {
    const material = materiaisUsados[index];
    const materialOriginal = materiais.find(m => m.id === material.materialId);
    
    if (materialOriginal) {
      setMaterialSelecionado(materialOriginal);
      setQuantidadeUsada(material.quantidadeUsada || 0);
      setComprimentoUsado(material.comprimentoUsado || 0);
      setLarguraUsada(material.larguraUsada || 0);
      setAlturaUsada(material.alturaUsada || 0);
      setEditandoIndex(index);
      setMostrarFormMaterial(true);
    }
  };

  const handleRemoverMaterial = (index: number) => {
    setMateriaisUsados(materiaisUsados.filter((_, i) => i !== index));
  };

  const calcularPreco = () => {
    if (!config) return;
    
    setCalculado(true);
  };

  const handleSalvarNoHistorico = async () => {
    if (!config || !user?.uid) return;
    
    setSalvando(true);
    
    const custoMateriais = materiaisUsados.reduce((acc, m) => acc + m.custoTotal, 0);
    const valorPorMinuto = calcularValorPorMinuto(config.valorPorHora);
    const custoMaoDeObra = valorPorMinuto * tempoProducao;
    const custoTotal = custoMateriais + custoMaoDeObra;
    const margemFinal = margemLucroCustom !== null ? margemLucroCustom : config.margemLucro;
    const precoFinal = custoTotal * (1 + margemFinal / 100);
    
    const resultado = await salvarProduto({
      nome: nomeProduto,
      materiais: materiaisUsados,
      tempoProducaoMinutos: tempoProducao,
      custoMateriais,
      custoMaoDeObra,
      custoTotal,
      valorPorHora: config.valorPorHora,
      margemLucro: margemFinal,
      precoFinal,
      usuarioId: user.uid
    });
    
    if (resultado.success) {
      alert('Produto salvo no histórico! ✅');
      router.push('/historico');
    } else {
      alert('Erro ao salvar produto');
    }
    
    setSalvando(false);
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
          <p style={{ color: '#6B7280' }}>Carregando calculadora...</p>
        </div>
      </div>
    );
  }

  // Cálculos
  const custoMateriais = materiaisUsados.reduce((acc, m) => acc + m.custoTotal, 0);
  const valorPorMinuto = calcularValorPorMinuto(config.valorPorHora);
  const custoMaoDeObra = valorPorMinuto * tempoProducao;
  const custoTotal = custoMateriais + custoMaoDeObra;
  const margemFinal = margemLucroCustom !== null ? margemLucroCustom : config.margemLucro;
  const precoFinal = custoTotal * (1 + margemFinal / 100);

  const formatarQuantidade = (material: MaterialUsado) => {
    if (material.tipoMedicao === 'unidade') {
      return `${material.quantidadeUsada} un`;
    } else if (material.tipoMedicao === 'comprimento') {
      return `${material.comprimentoUsado} cm`;
    } else {
      return `${material.larguraUsada}cm × ${material.alturaUsada}cm`;
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Calculator size={32} color="#00FFCC" />
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              Calculadora
            </h1>
          </div>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
            Calcule o preço ideal para seus produtos artesanais
          </p>
        </div>

        {/* Nome do Produto */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Nome do Produto *
          </label>
          <input
            type="text"
            value={nomeProduto}
            onChange={(e) => setNomeProduto(e.target.value)}
            placeholder="Ex: Bolsa de crochê azul"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '2px solid #D1D5DB',
              borderRadius: '10px',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#00FFCC'}
            onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
          />
        </div>

        {/* Materiais Usados */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} color="#00FFCC" />
              Materiais Utilizados
            </h2>
            <button
              onClick={() => {
                setMostrarFormMaterial(true);
                setEditandoIndex(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: '#00FFCC',
                color: '#111827',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Plus size={18} />
              Adicionar
            </button>
          </div>

          {/* Lista de materiais */}
          {materiaisUsados.length === 0 ? (
            <div style={{
              padding: '32px',
              textAlign: 'center',
              border: '2px dashed #E5E7EB',
              borderRadius: '10px',
              color: '#9CA3AF'
            }}>
              <Package size={48} strokeWidth={1.5} style={{ margin: '0 auto 12px' }} />
              <p style={{ margin: 0 }}>Nenhum material adicionado</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {materiaisUsados.map((material, index) => (
                <div key={index} style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                      {material.nome}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                      {formatarQuantidade(material)} • <strong style={{ color: '#059669' }}>R$ {material.custoTotal.toFixed(2)}</strong>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleEditarMaterial(index)}
                      style={{
                        padding: '6px',
                        backgroundColor: '#F3F4F6',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Edit2 size={16} color="#6B7280" />
                    </button>
                    <button
                      onClick={() => handleRemoverMaterial(index)}
                      style={{
                        padding: '6px',
                        backgroundColor: '#FEE2E2',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 size={16} color="#DC2626" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Adicionar Material */}
        {mostrarFormMaterial && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>
                {editandoIndex !== null ? 'Editar Material' : 'Adicionar Material'}
              </h3>

              {/* Selecionar material */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Selecione o material
                </label>
                <select
                  value={materialSelecionado?.id || ''}
                  onChange={(e) => handleSelecionarMaterial(e.target.value)}
                  disabled={editandoIndex !== null}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: editandoIndex !== null ? '#F3F4F6' : 'white'
                  }}
                >
                  <option value="">Selecione...</option>
                  {materiais.map(material => (
                    <option key={material.id} value={material.id}>
                      {material.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campos específicos por tipo */}
              {materialSelecionado && (
                <>
                  {materialSelecionado.tipoMedicao === 'unidade' && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                        Quantidade utilizada
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={quantidadeUsada}
                        onChange={(e) => setQuantidadeUsada(parseFloat(e.target.value) || 0)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  )}

                  {materialSelecionado.tipoMedicao === 'comprimento' && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                        Comprimento utilizado (cm)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={comprimentoUsado}
                        onChange={(e) => setComprimentoUsado(parseFloat(e.target.value) || 0)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  )}

                  {materialSelecionado.tipoMedicao === 'area' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                          Largura (cm)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={larguraUsada}
                          onChange={(e) => setLarguraUsada(parseFloat(e.target.value) || 0)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                          Altura (cm)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={alturaUsada}
                          onChange={(e) => setAlturaUsada(parseFloat(e.target.value) || 0)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Botões */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  onClick={() => {
                    setMostrarFormMaterial(false);
                    setMaterialSelecionado(null);
                    setEditandoIndex(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: 'white',
                    color: '#374151',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdicionarMaterial}
                  disabled={!materialSelecionado}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    backgroundColor: materialSelecionado ? '#00FFCC' : '#9CA3AF',
                    color: '#111827',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: materialSelecionado ? 'pointer' : 'not-allowed'
                  }}
                >
                  {editandoIndex !== null ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tempo de Produção */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            <Clock size={18} color="#00FFCC" />
            Tempo de produção (minutos)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={tempoProducao}
            onChange={(e) => setTempoProducao(parseFloat(e.target.value) || 0)}
            placeholder="Ex: 120"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '2px solid #D1D5DB',
              borderRadius: '10px',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#00FFCC'}
            onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
          />
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '8px 0 0 0' }}>
           💡 {tempoProducao >= 60 ? `${Math.floor(tempoProducao / 60)}h${tempoProducao % 60 > 0 ? `${tempoProducao % 60}min` : ''}` : `${tempoProducao} minuto(s)`}
          </p>
        </div>

        {/* Botão Calcular */}
        {!calculado && (
          <button
            onClick={calcularPreco}
            disabled={!nomeProduto || materiaisUsados.length === 0 || tempoProducao === 0}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: (!nomeProduto || materiaisUsados.length === 0 || tempoProducao === 0) ? '#9CA3AF' : '#00FFCC',
              color: '#111827',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (!nomeProduto || materiaisUsados.length === 0 || tempoProducao === 0) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}
          >
            <Calculator size={20} />
            Calcular Preço
          </button>
        )}

        {/* Resultado */}
        {calculado && (
          <>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '2px solid #00FFCC',
              padding: '24px',
              marginBottom: '20px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 20px 0' }}>
                📊 Resultado do Cálculo
              </h2>

              {/* Breakdown */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Custo dos materiais:</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>R$ {custoMateriais.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Mão de obra ({tempoProducao} min):</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>R$ {custoMaoDeObra.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Custo total:</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>R$ {custoTotal.toFixed(2)}</span>
                </div>
                
                {/* Margem de lucro editável */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Margem de lucro:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      step="1"
                      value={margemLucroCustom !== null ? margemLucroCustom : config.margemLucro}
                      onChange={(e) => setMargemLucroCustom(parseFloat(e.target.value) || 0)}
                      style={{
                        width: '70px',
                        padding: '6px 8px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        textAlign: 'right'
                      }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>%</span>
                  </div>
                </div>
              </div>

              {/* Preço Final */}
              <div style={{
                backgroundColor: '#ECFDF5',
                border: '2px solid #10B981',
                borderRadius: '10px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '14px', color: '#047857', margin: '0 0 8px 0', fontWeight: '500' }}>
                  Preço Final Sugerido
                </p>
                <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                  R$ {precoFinal.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Botões de ação */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCalculado(false)}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '12px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✏️ Editar Cálculo
              </button>
              <button
                onClick={handleSalvarNoHistorico}
                disabled={salvando}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '12px',
                  backgroundColor: salvando ? '#9CA3AF' : '#00FFCC',
                  color: '#111827',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: salvando ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Save size={18} />
                {salvando ? 'Salvando...' : 'Salvar no Histórico'}
              </button>
            </div>
          </>
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
          max-width: 800px;
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

export default function CalculadoraPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <CalculadoraContent />
      </Layout>
    </ProtectedRoute>
  );
}
