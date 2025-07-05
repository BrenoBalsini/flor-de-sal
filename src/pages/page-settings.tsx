import { type ChangeEvent } from "react";
import useLocalStorageState from "use-local-storage-state";
import Input from "../components/ui/input";
import Label from "../components/ui/label";
import { type SettingsData } from "../types";

const initialSettings: SettingsData = {
  hourlyRate: '24,00',
  dailyHours: '8',
  profitMargin: '70',
};

export default function PageSettings() {
  const [settings, setSettings] = useLocalStorageState<SettingsData>('app-settings', {
    defaultValue: initialSettings,
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value: rawValue } = e.target;
    let value = rawValue;

    if (name === 'hourlyRate') {
      value = value.replace(/[^0-9,]/g, '');
      const parts = value.split(',');
      if (parts[1]) {
        parts[1] = parts[1].substring(0, 2);
      }
      value = parts.slice(0, 2).join(',');
    }

    if (name === 'dailyHours' || name === 'profitMargin') {
      value = value.replace(/[^0-9]/g, '');
    }

    setSettings(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-wine-base">
          Configurações de Precificação
        </h1>
        <p className="mt-2 text-gray-300">
          Defina seus custos e margens para que a calculadora funcione com precisão.
        </p>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <form className="max-w-md space-y-6">
          
          <div>
            <Label htmlFor="hourlyRate">Preço da sua hora de trabalho (R$)</Label>
            <Input 
              id="hourlyRate"
              type="text"
              inputMode="decimal"
              name="hourlyRate"
              value={settings.hourlyRate}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="dailyHours">Horas trabalhadas por dia</Label>
            <Input 
              id="dailyHours"
              type="text"
              inputMode="numeric"
              name="dailyHours"
              value={settings.dailyHours}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="profitMargin">Margem de lucro desejada (%)</Label>
            <Input 
              id="profitMargin"
              type="text"
              inputMode="numeric"
              name="profitMargin"
              value={settings.profitMargin}
              onChange={handleChange}
            />
          </div>

        </form>
      </div>
    </div>
  );
}