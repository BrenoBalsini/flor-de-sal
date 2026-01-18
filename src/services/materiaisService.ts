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
  Timestamp 
} from 'firebase/firestore';

export interface Material {
  id?: string;
  nome: string;
  tipo: string;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
  fornecedor?: string;
  observacoes?: string;
  criadoEm: Date | Timestamp;
  atualizadoEm: Date | Timestamp;
}

// Tipo para CRIAR material (sem id, criadoEm e atualizadoEm)
export type CriarMaterialInput = Omit<Material, 'id' | 'criadoEm' | 'atualizadoEm'>;

const COLLECTION_NAME = 'materiais';

// Criar novo material - CORRIGIDO
export const criarMaterial = async (material: CriarMaterialInput) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...material,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Erro ao criar material:', error);
    return { success: false, error };
  }
};

// Listar todos os materiais
export const listarMateriais = async (): Promise<Material[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
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
export const atualizarMaterial = async (id: string, dados: Partial<Material>) => {
  try {
    const materialRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(materialRef, {
      ...dados,
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
