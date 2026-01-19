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

// Tipos de medição
export type TipoMedicao = 'unidade' | 'comprimento' | 'area';

// Interface base do material
export interface Material {
  id?: string;
  nome: string;
  tipoMedicao: TipoMedicao;
  
  // Dados da compra
  precoCompra: number; // Quanto você pagou no total
  
  // Quantidade comprada (varia conforme o tipo)
  quantidadeComprada: number; // Para tipo 'unidade': número de peças
  larguraComprada?: number; // Para tipo 'area': largura em cm
  alturaComprada?: number; // Para tipo 'area': altura em cm
  comprimentoComprado?: number; // Para tipo 'comprimento': comprimento em cm
  
  // Calculado automaticamente (usado internamente na calculadora)
  precoPorUnidadeBase: number; // Custo unitário calculado (não mostrado ao usuário)
  
  fornecedor?: string;
  observacoes?: string;
  usuarioId: string; // ID do usuário dono do material
  criadoEm: Date | Timestamp;
  atualizadoEm: Date | Timestamp;
}

export type CriarMaterialInput = Omit<Material, 'id' | 'criadoEm' | 'atualizadoEm' | 'precoPorUnidadeBase'>;

const COLLECTION_NAME = 'materiais';

// Função auxiliar para calcular o preço por unidade base (uso interno)
export const calcularPrecoPorUnidadeBase = (material: CriarMaterialInput): number => {
  const { tipoMedicao, precoCompra, quantidadeComprada, larguraComprada, alturaComprada, comprimentoComprado } = material;
  
  switch (tipoMedicao) {
    case 'unidade':
      return precoCompra / quantidadeComprada;
    
    case 'comprimento':
      if (!comprimentoComprado) return 0;
      return precoCompra / comprimentoComprado;
    
    case 'area':
      if (!larguraComprada || !alturaComprada) return 0;
      const areaTotalCm2 = larguraComprada * alturaComprada;
      return precoCompra / areaTotalCm2;
    
    default:
      return 0;
  }
};

// Criar novo material
export const criarMaterial = async (material: CriarMaterialInput) => {
  try {
    const precoPorUnidadeBase = calcularPrecoPorUnidadeBase(material);
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...material,
      precoPorUnidadeBase,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Erro ao criar material:', error);
    return { success: false, error };
  }
};

// Listar materiais do usuário
export const listarMateriais = async (usuarioId: string): Promise<Material[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('usuarioId', '==', usuarioId),
      orderBy('criadoEm', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const materiais: Material[] = [];
    querySnapshot.forEach((doc) => {
      materiais.push({ 
        id: doc.id, 
        ...doc.data() 
      } as Material);
    });
    
    return materiais;
  } catch (error) {
    console.error('Erro ao listar materiais:', error);
    return [];
  }
};

// Atualizar material
export const atualizarMaterial = async (id: string, dados: Partial<CriarMaterialInput>) => {
  try {
    const materialRef = doc(db, COLLECTION_NAME, id);
    
    // Recalcula o preço por unidade base se algum dado relevante mudou
    let dadosAtualizados: any = { ...dados };
    
    // Remove campos undefined para não causar erro no Firebase
    Object.keys(dadosAtualizados).forEach(key => {
      if (dadosAtualizados[key] === undefined) {
        delete dadosAtualizados[key];
      }
    });
    
    if (dados.precoCompra || dados.quantidadeComprada || dados.larguraComprada || 
        dados.alturaComprada || dados.comprimentoComprado || dados.tipoMedicao) {
      
      // Busca o material atual
      const materialAtual = await getDocs(query(collection(db, COLLECTION_NAME)));
      const materialData = materialAtual.docs.find(d => d.id === id)?.data() as Material;
      
      if (materialData) {
        const materialCompleto = { ...materialData, ...dadosAtualizados } as CriarMaterialInput;
        dadosAtualizados.precoPorUnidadeBase = calcularPrecoPorUnidadeBase(materialCompleto);
      }
    }
    
    // Limpa campos que não são do tipo de medição atual
    if (dadosAtualizados.tipoMedicao) {
      if (dadosAtualizados.tipoMedicao === 'unidade') {
        dadosAtualizados.larguraComprada = null;
        dadosAtualizados.alturaComprada = null;
        dadosAtualizados.comprimentoComprado = null;
      } else if (dadosAtualizados.tipoMedicao === 'comprimento') {
        dadosAtualizados.larguraComprada = null;
        dadosAtualizados.alturaComprada = null;
        dadosAtualizados.quantidadeComprada = 0;
      } else if (dadosAtualizados.tipoMedicao === 'area') {
        dadosAtualizados.comprimentoComprado = null;
        dadosAtualizados.quantidadeComprada = 0;
      }
    }
    
    // Remove campos undefined novamente após as limpezas
    Object.keys(dadosAtualizados).forEach(key => {
      if (dadosAtualizados[key] === undefined) {
        delete dadosAtualizados[key];
      }
    });
    
    await updateDoc(materialRef, {
      ...dadosAtualizados,
      atualizadoEm: Timestamp.now(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar material:', error);
    return { success: false, error };
  }
};


// Deletar material
export const deletarMaterial = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar material:', error);
    return { success: false, error };
  }
};
