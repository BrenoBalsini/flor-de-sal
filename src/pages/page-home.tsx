import { useState, type ChangeEvent, useMemo, useRef, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import { type Material, type SettingsData, type HistoryEntry } from "../types";
import Label from "../components/ui/label";
import Input from "../components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { initialSettings } from "./page-settings";

type SelectedMaterial = {
  id: string;
  material: Material;
  quantity: {
    width?: number;
    height?: number;
    length?: number;
    units?: number;
  };
};

type CalculationResult = {
  materialCost: number;
  timeCost: number;
  totalCost: number;
  profit: number;
  finalPrice: number;
} | null;

export default function PageHome() {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [settings] = useLocalStorageState<SettingsData>("app-settings", {
    defaultValue: initialSettings,
  });
  const [materials] = useLocalStorageState<Material[]>("materials", {
    defaultValue: [],
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_history, setHistory] = useLocalStorageState<HistoryEntry[]>(
    "calculation-history",
    {
      defaultValue: [],
    }
  );

  const [productName, setProductName] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<
    SelectedMaterial[]
  >([]);
  const [result, setResult] = useState<CalculationResult>(null);

  const [materialConfig, setMaterialConfig] = useState({
    selectedMaterialId: "",
    widthUsed: "",
    heightUsed: "",
    lengthUsed: "",
    unitsUsed: "1",
  });

  const [materialError, setMaterialError] = useState<string | null>(null);

  const selectedMaterialObject = useMemo(() => {
    return materials.find((m) => m.id === materialConfig.selectedMaterialId);
  }, [materialConfig.selectedMaterialId, materials]);

  const isCalculateDisabled = useMemo(() => {
    return !productName || !timeSpent || selectedMaterials.length === 0;
  }, [productName, timeSpent, selectedMaterials]);

  function handleMaterialConfigChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setMaterialConfig((prev) => ({ ...prev, [name]: value }));
    if (name === "selectedMaterialId") {
      setMaterialError(null);
    }
  }

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [result]);
  
  function handleAddMaterialToProduct() {
    if (!selectedMaterialObject) {
      setMaterialError("Por favor, selecione um material para adicionar.");
      return;
    }

    setMaterialError(null);

    const newSelectedMaterial: SelectedMaterial = {
      id: crypto.randomUUID(),
      material: selectedMaterialObject,
      quantity: {
        width: parseFloat(materialConfig.widthUsed) || 0,
        height: parseFloat(materialConfig.heightUsed) || 0,
        length: parseFloat(materialConfig.lengthUsed) || 0,
        units: parseInt(materialConfig.unitsUsed, 10) || 0,
      },
    };

    setSelectedMaterials((prev) => [...prev, newSelectedMaterial]);

    setMaterialConfig({
      selectedMaterialId: "",
      widthUsed: "",
      heightUsed: "",
      lengthUsed: "",
      unitsUsed: "1",
    });
  }

  function handleRemoveMaterialFromProduct(idToRemove: string) {
    setSelectedMaterials((prev) => prev.filter((m) => m.id !== idToRemove));
  }

  function handleCalculate() {
    const hourlyRate = parseFloat(settings.hourlyRate.replace(",", ".")) || 0;
    const profitMargin = parseFloat(settings.profitMargin) || 0;
    const timeSpentInMinutes = parseInt(timeSpent, 10) || 0;

    const timeCost = (timeSpentInMinutes / 60) * hourlyRate;

    const materialCost = selectedMaterials.reduce((total, item) => {
      const material = item.material;
      let itemCost = 0;

      switch (material.unitType) {
        case "unidade":
          if (material.purchaseQuantity > 0) {
            const costPerUnit =
              material.purchasePrice / material.purchaseQuantity;
            itemCost = costPerUnit * (item.quantity.units || 0);
          }
          break;
        case "linear":
          if (material.purchaseLength > 0) {
            const costPerCm = material.purchasePrice / material.purchaseLength;
            itemCost = costPerCm * (item.quantity.length || 0);
          }
          break;
        case "area": {
          const purchaseArea = material.purchaseWidth * material.purchaseHeight;
          if (purchaseArea > 0) {
            const costPerSqrCm = material.purchasePrice / purchaseArea;
            const usedArea =
              (item.quantity.width || 0) * (item.quantity.height || 0);
            itemCost = costPerSqrCm * usedArea;
          }
          break;
        }
      }
      return total + itemCost;
    }, 0);

    const totalCost = timeCost + materialCost;
    const profitMultiplier = 1 + profitMargin / 100;
    const finalPrice = totalCost * profitMultiplier;
    const profit = finalPrice - totalCost;

    const calculationResult = {
      materialCost,
      timeCost,
      totalCost,
      profit,
      finalPrice,
    };

    setResult(calculationResult);

    const newHistoryEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      productName: productName,
      result: calculationResult,
      date: new Date().toISOString(),
    };

    setHistory((prevHistory) => [newHistoryEntry, ...prevHistory]);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Calculadora de Preço</h1>
        <p className="text-gray-300">
          Preencha os dados abaixo para encontrar o preço justo do seu produto.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-400">
              Informações do Produto
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="productName">Nome do produto</Label>
                <Input
                  id="productName"
                  name="productName"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="timeSpent">Tempo gasto (em minutos)</Label>
                <Input
                  id="timeSpent"
                  name="timeSpent"
                  type="text"
                  inputMode="numeric"
                  value={timeSpent}
                  onChange={(e) =>
                    setTimeSpent(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-400">
              Adicionar Material ao Produto
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="material-select">Selecione o Material</Label>
                <select
                  id="material-select"
                  name="selectedMaterialId"
                  value={materialConfig.selectedMaterialId}
                  onChange={handleMaterialConfigChange}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm transition-colors focus:border-rose-light focus:ring focus:ring-rose-light focus:ring-opacity-50"
                >
                  <option value="">-- Escolha um material --</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedMaterialObject?.unitType === "area" && (
                <>
                  <div>
                    <Label htmlFor="widthUsed">Largura usada (cm)</Label>
                    <Input
                      id="widthUsed"
                      name="widthUsed"
                      type="text"
                      inputMode="decimal"
                      value={materialConfig.widthUsed}
                      onChange={handleMaterialConfigChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="heightUsed">Altura usada (cm)</Label>
                    <Input
                      id="heightUsed"
                      name="heightUsed"
                      type="text"
                      inputMode="decimal"
                      value={materialConfig.heightUsed}
                      onChange={handleMaterialConfigChange}
                    />
                  </div>
                </>
              )}
              {selectedMaterialObject?.unitType === "linear" && (
                <div>
                  <Label htmlFor="lengthUsed">Comprimento usado (cm)</Label>
                  <Input
                    id="lengthUsed"
                    name="lengthUsed"
                    type="text"
                    inputMode="decimal"
                    value={materialConfig.lengthUsed}
                    onChange={handleMaterialConfigChange}
                  />
                </div>
              )}
              {selectedMaterialObject?.unitType === "unidade" && (
                <div>
                  <Label htmlFor="unitsUsed">Unidades usadas</Label>
                  <Input
                    id="unitsUsed"
                    name="unitsUsed"
                    type="text"
                    inputMode="numeric"
                    value={materialConfig.unitsUsed}
                    onChange={handleMaterialConfigChange}
                  />
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col items-end">
              <button
                onClick={handleAddMaterialToProduct}
                className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-50"
                disabled={!materialConfig.selectedMaterialId}
              >
                <PlusCircle size={18} />
                Adicionar à Lista
              </button>
              {materialError && (
                <p className="mt-2 text-sm text-rose-dark">{materialError}</p>
              )}
            </div>

            {selectedMaterials.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-base font-semibold text-gray-400">
                  Materiais no Produto:
                </h3>
                <ul className="mt-2 space-y-2">
                  {selectedMaterials.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between rounded-md bg-gray-100/80 p-2 text-sm"
                    >
                      <span>{item.material.name}</span>
                      <button
                        onClick={() => handleRemoveMaterialFromProduct(item.id)}
                        className="text-gray-400 hover:text-rose-base"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-lg border border-gray-200 bg-white p-6 space-y-4">
            <button
              onClick={handleCalculate}
              disabled={isCalculateDisabled}
              className="w-full rounded-lg bg-brand py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-rose-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              Calcular Preço Final
            </button>

            {result && (
              <div ref={resultsRef} className="space-y-2 pt-4 border-t">
                <h2 className="text-lg font-semibold text-gray-400">
                  Resultado do Cálculo
                </h2>
                <div className="space-y-1 text-sm text-gray-400">
                  <p className="flex justify-between">
                    Custo com material:{" "}
                    <span>{result.materialCost.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between">
                    Custo com tempo: <span>{result.timeCost.toFixed(2)}</span>
                  </p>
                </div>
                <hr />
                <div className="space-y-1 text-sm text-gray-400">
                  <p className="flex justify-between">
                    Preço de Custo:{" "}
                    <span>R$ {result.totalCost.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between">
                    Lucro ({settings?.profitMargin}%):{" "}
                    <span>R$ {result.profit.toFixed(2)}</span>
                  </p>
                </div>
                <hr />
                <div className="text-center">
                  <p className="text-sm text-gray-400">Preço Final Sugerido</p>
                  <p className="text-2xl font-bold text-wine-base">
                    R$ {result.finalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
