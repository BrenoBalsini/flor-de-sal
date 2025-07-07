export type MaterialBase = {
  id: string;
  name: string;
  purchasePrice: number;
  purchaseDate: string;
  purchaseSource: string;
};

export type MaterialByArea = MaterialBase & {
  unitType: 'area';
  purchaseWidth: number;
  purchaseHeight: number;
};

export type MaterialByLength = MaterialBase & {
  unitType: 'linear';
  purchaseLength: number;
};

export type MaterialByUnit = MaterialBase & {
  unitType: 'unidade';
  purchaseQuantity: number;
};

export type Material = MaterialByArea | MaterialByLength | MaterialByUnit;

export type MaterialFormData = Omit<Material, 'id' | 'purchasePrice' | 'purchaseWidth' | 'purchaseHeight' | 'purchaseLength' | 'purchaseQuantity'> & {
  purchasePrice: string;
  purchaseWidth?: string;
  purchaseHeight?: string;
  purchaseLength?: string;
  purchaseQuantity?: string;
};

export type SettingsData = {
  hourlyRate: string;
  dailyHours: string;
  profitMargin: string;
};

export type HistoryEntry = {
  id: string;
  productName: string;
  result: {
    materialCost: number;
    timeCost: number;
    totalCost: number;
    profit: number;
    finalPrice: number;
  };
  date: string;
}