export type Material = {
  id: string;
  name: string;
  purchasePrice: number;
  purchaseDate: string;
  purchaseSource: string;
  unit: 'm' | 'cm' | 'un' | 'rolo' | 'pacote';
};

export type MaterialFormData = Omit<Material, 'id' | 'purchasePrice'> & {
  purchasePrice: string;
};

export type SettingsData = {
  hourlyRate: string;
  dailyHours: string;
  profitMargin: string;
};