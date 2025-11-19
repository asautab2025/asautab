
export interface AppealData {
  organo: string; // (1) Órgano al que se dirige
  expediente: string; // EXPTE. Nº
  fullName: string;
  dni: string;
  address: string;
  infringement: string; // (2) Infracción de...
  fact: string; // (3) Consistente en...
  allegationType: string; // (4) Escrito de...
  signPlace: string;
  signDate: string;
}

export interface ExtractedData {
  organo?: string;
  expediente?: string;
  infringement?: string;
  fact?: string;
  notificationDate?: string;
}

export enum AppStatus {
  IDLE,
  ANALYZING,
  GENERATING,
  SUCCESS,
  ERROR
}
