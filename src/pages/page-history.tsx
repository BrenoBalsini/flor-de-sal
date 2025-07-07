import useLocalStorageState from "use-local-storage-state";
import { type HistoryEntry } from "../types";
import { Trash2 } from "lucide-react";

export default function PageHistory() {
  const [history, setHistory] = useLocalStorageState<HistoryEntry[]>('calculation-history', {
    defaultValue: [],
  });

  function handleClearHistory() {
    const isConfirmed = window.confirm(
      "Você tem certeza que deseja apagar todo o histórico de cálculos? Esta ação não pode ser desfeita."
    );

    if (isConfirmed) {
      setHistory([]);
    }
  }

  function formatDisplayDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-wine-base">Histórico de Cálculos</h1>
          <p className="mt-2 text-gray-300">
            Consulte aqui os preços de produtos que você já calculou.
          </p>
        </div>
        {history && history.length > 0 && (
           <button 
            onClick={handleClearHistory}
            className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-200"
          >
            <Trash2 size={16}/>
            Limpar Histórico
          </button>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        {history && history.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {history.map((entry) => (
              <li key={entry.id} className="p-6">
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <p className="text-lg font-semibold text-gray-400">{entry.productName}</p>
                    <p className="text-sm text-gray-300">
                      Calculado em: {formatDisplayDate(entry.date)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center justify-end">
                     <p className="text-xl font-bold text-wine-base sm:text-2xl">
                       R$ {entry.result.finalPrice.toFixed(2)}
                     </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-400">Nenhum cálculo salvo</h3>
            <p className="mt-1 text-gray-300">
              Quando você calcular o preço de um produto na calculadora, ele aparecerá aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}