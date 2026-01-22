import { db } from '../lib/firebase';
import { 
  doc, 
  setDoc, 
  getDoc,
  Timestamp 
} from 'firebase/firestore';

export interface Configuracoes {
  usuarioId: string;
  
  // Mão de obra
  valorPorHora: number; // Valor que o artesão quer ganhar por hora
  
  // Margem de lucro
  margemLucro: number; // Porcentagem (ex: 50 = 50%)
  
  criadoEm: Date | Timestamp;
  atualizadoEm: Date | Timestamp;
}

const COLLECTION_NAME = 'configuracoes';

// Valores padrão
export const configuracoesPadrao: Omit<Configuracoes, 'usuarioId' | 'criadoEm' | 'atualizadoEm'> = {
  valorPorHora: 20, // R$ 20/hora
  margemLucro: 50 // 50% de lucro
};

// Salvar ou atualizar configurações
export const salvarConfiguracoes = async (usuarioId: string, config: Partial<Configuracoes>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, usuarioId);
    
    await setDoc(docRef, {
      ...config,
      usuarioId,
      atualizadoEm: Timestamp.now(),
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return { success: false, error };
  }
};

// Buscar configurações do usuário
export const buscarConfiguracoes = async (usuarioId: string): Promise<Configuracoes | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, usuarioId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as Configuracoes;
    }
    
    // Se não existir, cria com valores padrão
    const novasConfigs: Configuracoes = {
      ...configuracoesPadrao,
      usuarioId,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    };
    
    await setDoc(docRef, novasConfigs);
    return novasConfigs;
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return null;
  }
};

// Calcular valor por minuto
export const calcularValorPorMinuto = (valorPorHora: number): number => {
  return valorPorHora / 60;
};
