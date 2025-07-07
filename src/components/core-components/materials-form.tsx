import { X } from "lucide-react";
import { useState, type MouseEvent, type FormEvent, type ChangeEvent } from "react";
import Input from "../ui/input";
import Label from "../ui/label";
import { type MaterialFormData } from "../../types";

type MaterialFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MaterialFormData) => void;
};

const initialState: MaterialFormData = {
  name: '',
  purchasePrice: '',
  purchaseDate: '',
  purchaseSource: '',
  unitType: 'unidade',
  purchaseWidth: '',
  purchaseHeight: '',
  purchaseLength: '',
  purchaseQuantity: '1',
};

export default function MaterialForm({ isOpen, onClose, onSubmit }: MaterialFormProps) {
  const [formData, setFormData] = useState<MaterialFormData>(initialState);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value: rawValue } = e.target;
    let value = rawValue;

    if (name === 'purchasePrice') {
      value = value.replace(/[^0-9,]/g, '');
      const parts = value.split(',');
      if (parts[1]) {
        parts[1] = parts[1].substring(0, 2);
      }
      value = parts.slice(0, 2).join(',');
    }

    if (['purchaseWidth', 'purchaseHeight', 'purchaseLength', 'purchaseQuantity'].includes(name)) {
      value = value.replace(/[^0-9]/g, '');
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialState);
  }

  if (!isOpen) {
    return null;
  }

  function handlePanelClick(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-10 flex items-center justify-center bg-gray-400/50"
    >
      <div 
        onClick={handlePanelClick}
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-wine-base">Cadastrar Novo Material</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Nome do Material</Label>
            <Input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="purchasePrice">Preço de Compra Total (R$)</Label>
            <Input id="purchasePrice" type="text" inputMode="decimal" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} required />
          </div>
          
          <div>
            <Label htmlFor="unitType">Tipo de Medida</Label>
            <select 
              id="unitType" 
              name="unitType" 
              value={formData.unitType} 
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm transition-colors focus:border-rose-light focus:ring focus:ring-rose-light focus:ring-opacity-50"
            >
              <option value="unidade">Por Unidade (ex: botão, zíper)</option>
              <option value="linear">Por Comprimento (ex: fita, elástico)</option>
              <option value="area">Por Área (ex: tecido, entretela)</option>
            </select>
          </div>

          {formData.unitType === 'unidade' && (
            <div className="rounded-md border p-4">
              <h3 className="text-sm font-medium text-gray-400">Quantidade Comprada</h3>
              <div>
                <Label htmlFor="purchaseQuantity">Quantas unidades vieram? (ex: 10, 50)</Label>
                <Input id="purchaseQuantity" type="text" inputMode="numeric" name="purchaseQuantity" value={formData.purchaseQuantity} onChange={handleChange} />
              </div>
            </div>
          )}

          {formData.unitType === 'area' && (
            <div className="grid grid-cols-2 gap-4 rounded-md border p-4">
              <h3 className="col-span-2 text-sm font-medium text-gray-400">Dimensões do Material Comprado</h3>
              <div>
                <Label htmlFor="purchaseWidth">Largura (cm)</Label>
                <Input id="purchaseWidth" type="text" inputMode="numeric" name="purchaseWidth" value={formData.purchaseWidth} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="purchaseHeight">Altura/Comprimento (cm)</Label>
                <Input id="purchaseHeight" type="text" inputMode="numeric" name="purchaseHeight" value={formData.purchaseHeight} onChange={handleChange} />
              </div>
            </div>
          )}

          {formData.unitType === 'linear' && (
            <div className="rounded-md border p-4">
              <h3 className="text-sm font-medium text-gray-400">Dimensão do Material Comprado</h3>
              <div>
                <Label htmlFor="purchaseLength">Comprimento (cm)</Label>
                <Input id="purchaseLength" type="text" inputMode="numeric" name="purchaseLength" value={formData.purchaseLength} onChange={handleChange} />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-400 hover:bg-gray-200">
              Cancelar
            </button>
            <button type="submit" className="rounded-lg bg-rose-base px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-dark">
              Salvar Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}