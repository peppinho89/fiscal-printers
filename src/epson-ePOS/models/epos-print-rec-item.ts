export interface IPrintRecItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRateCode: string;
  justification?: string;
}

export class EPOSPrintRecItem {
  constructor(printRecItemObj?: IPrintRecItem) {
    this.description = printRecItemObj?.description || 'Generico';
    this.quantity = printRecItemObj?.quantity || 0;
    this.unitPrice = printRecItemObj?.unitPrice || 0;
    this.taxrateCode = printRecItemObj?.taxRateCode || '';
    this.justification = printRecItemObj?.justification || '1';
  }
  description: string;
  quantity: number;
  unitPrice: number;
  taxrateCode: string;
  justification: string;
}
