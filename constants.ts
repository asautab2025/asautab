
import { AppealData } from './types';

export const INITIAL_DATA: AppealData = {
  organo: '',
  expediente: '',
  fullName: '',
  dni: '',
  address: '',
  infringement: '',
  fact: '',
  allegationType: 'ESCRITO DE ALEGACIONES',
  signPlace: '',
  signDate: new Date().toISOString().split('T')[0],
};

export const MOCK_PDF_URL = "";
