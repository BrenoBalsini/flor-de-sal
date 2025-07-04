import { X } from "lucide-react";
import {
  useState,
  type MouseEvent,
  type FormEvent,
  type ChangeEvent,
} from "react";
import Input from "../ui/input";
import Label from "../ui/label";
import { type MaterialFormData } from "../../pages/page-materials";

type MaterialFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MaterialFormData) => void;
};

const initialState: MaterialFormData = {
  name: "",
  purchasePrice: "",
  purchaseDate: "",
  purchaseSource: "",
  unit: "un",
};

export default function MaterialForm({
  isOpen,
  onClose,
  onSubmit,
}: MaterialFormProps) {
  const [formData, setFormData] = useState<MaterialFormData>(initialState);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value: rawValue } = e.target;
    let value = rawValue;

    if (name === "purchasePrice") {
      value = value.replace(/[^0-9,]/g, "");

      const parts = value.split(",");

      if (parts[0] !== undefined) {
        if (parts[1]) {
          parts[1] = parts[1].substring(0, 2);
        }
        value = parts.slice(0, 2).join(",");
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.purchasePrice) {
      alert("Por favor, preencha o nome e o preço do material.");
      return;
    }
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
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-wine-base">
            Cadastrar Novo Material
          </h2>
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
            <Input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="purchasePrice">Preço de Compra (R$)</Label>
            <Input
              id="purchasePrice"
              type="text"
              inputMode="decimal"
              name="purchasePrice"
              placeholder="19,90"
              value={formData.purchasePrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-400 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-rose-base px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-dark"
            >
              Salvar Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
