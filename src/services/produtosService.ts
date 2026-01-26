import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';

// Material usado no produto (snapshot do momento do cálculo)
export interface MaterialUsado {
  materialId: string;
  nome: string;
  tipoMedicao: 'unidade' | 'comprimento' | 'area';
  
  // Quantidade usada
  quantidadeUsada?: number; // Para unidade
  comprimentoUsado?: number; // Para comprimento (cm)
  larguraUsada?: number; // Para area (cm)
  alturaUsada?: number; // Para area (cm)
  
  // Preço no momento do cálculo (snapshot)
  precoPorUnidadeBase: number; // Preço unitário do material no momento
  custoTotal: number; // Custo total desse material no produto
}

export interface Produto {
  id?: string;
  nome: string;
  
  // Materiais usados (snapshot)
  materiais: MaterialUsado[];
  
  // Tempo de produção
  tempoProducaoMinutos: number;
  
  // Custos calculados
  custoMateriais: number;
  custoMaoDeObra: number;
  custoTotal: number; // materiais + mão de obra
  
  // Configurações usadas no cálculo (snapshot)
  valorPorHora: number;
  margemLucro: number; // Porcentagem
  
  // Preço final
  precoFinal: number;
  
  // Metadata
  usuarioId: string;
  criadoEm: Date | Timestamp;
  atualizadoEm: Date | Timestamp;
}

const COLLECTION_NAME = 'produtos';

// Criar novo produto no histórico
export const salvarProduto = async (produto: Omit<Produto, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...produto,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    return { success: false, error };
  }
};

// Listar produtos do usuário
export const listarProdutos = async (usuarioId: string): Promise<Produto[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('usuarioId', '==', usuarioId),
      orderBy('criadoEm', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const produtos: Produto[] = [];
    querySnapshot.forEach((doc) => {
      produtos.push({ 
        id: doc.id, 
        ...doc.data() 
      } as Produto);
    });
    
    return produtos;
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return [];
  }
};

// Atualizar produto
export const atualizarProduto = async (id: string, dados: Partial<Produto>) => {
  try {
    const produtoRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(produtoRef, {
      ...dados,
      atualizadoEm: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return { success: false, error };
  }
};

// Deletar produto
export const deletarProduto = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return { success: false, error };
  }
};

// Calcular custo de um material usado
export const calcularCustoMaterial = (material: MaterialUsado): number => {
  const { tipoMedicao, precoPorUnidadeBase } = material;
  
  switch (tipoMedicao) {
    case 'unidade':
      return precoPorUnidadeBase * (material.quantidadeUsada || 0);
    
    case 'comprimento':
      return precoPorUnidadeBase * (material.comprimentoUsado || 0);
    
    case 'area':
      const area = (material.larguraUsada || 0) * (material.alturaUsada || 0);
      return precoPorUnidadeBase * area;
    
    default:
      return 0;
  }
};
