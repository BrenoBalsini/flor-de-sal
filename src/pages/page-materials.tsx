import { useState } from "react";
import useLocalStorageState from 'use-local-storage-state';
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import MaterialForm from "../components/core-components/materials-form";
import { type Material, type MaterialFormData } from "../types";

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function PageMaterials() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [materials, setMaterials] = useLocalStorageState<Material[]>('materials', {
    defaultValue: []
  });

  function handleOpenForm() { setIsFormOpen(true); }
  function handleCloseForm() { setIsFormOpen(false); }

  function handleAddMaterial(formData: MaterialFormData) {
    const commonData = {
      id: crypto.randomUUID(),
      name: formData.name,
      purchasePrice: parseFloat(formData.purchasePrice.replace(',', '.')) || 0,
      purchaseDate: formData.purchaseDate,
      purchaseSource: formData.purchaseSource,
    };

    let newMaterial: Material;

    switch (formData.unitType) {
      case 'area':
        newMaterial = {
          ...commonData,
          unitType: 'area',
          purchaseWidth: parseFloat(formData.purchaseWidth || '0') || 0,
          purchaseHeight: parseFloat(formData.purchaseHeight || '0') || 0,
        };
        break;
      case 'linear':
        newMaterial = {
          ...commonData,
          unitType: 'linear',
          purchaseLength: parseFloat(formData.purchaseLength || '0') || 0,
        };
        break;
      case 'unidade':
        newMaterial = {
          ...commonData,
          unitType: 'unidade',
          purchaseQuantity: parseInt(formData.purchaseQuantity || '1', 10) || 1,
        };
        break;
      default:
        console.error("Tipo de unidade desconhecido:", formData.unitType);
        return; 
    }

    setMaterials(currentMaterials => [...currentMaterials, newMaterial]);
    handleCloseForm();
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-wine-base">Meus Materiais</h1>
            <p className="mt-2 text-gray-300">
              Cadastre e gerencie os insumos que você usa para criar seus produtos.
            </p>
          </div>
          <button onClick={handleOpenForm} className="flex items-center gap-2 rounded-lg bg-rose-base px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-dark">
            <PlusCircle size={18} />
            Cadastrar Material
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          {materials.length === 0 ? (
            <p className="p-6 text-center text-gray-400">
              Nenhum material cadastrado ainda. Clique em "Cadastrar Material" para começar!
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {materials.map(material => (
                <li key={material.id} className="flex items-center justify-between p-4 hover:bg-gray-100/50">
                  <div>
                    <p className="font-semibold text-gray-400">{material.name}</p>
                    <p className="text-sm text-gray-300">
                      {formatCurrency(material.purchasePrice)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"><Pencil size={16}/></button>
                    <button className="rounded p-1.5 text-gray-400 hover:bg-rose-light hover:text-rose-dark"><Trash2 size={16}/></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <MaterialForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleAddMaterial}
      />
    </>
  );
}