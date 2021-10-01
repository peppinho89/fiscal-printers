export interface IPrintRecItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRateCode: string;
  justification?: string;
}

export class EPOSPrintRecItem {
  constructor(printRecItemObj?: IPrintRecItem) {
    this.description = printRecItemObj?.description || '';
    this.quantity = printRecItemObj?.quantity || 0;
    this.unitPrice = printRecItemObj?.unitPrice || 0;
    this.taxrateCode = printRecItemObj?.taxRateCode || '';
    this.justification = printRecItemObj?.justification || '';
  }
  description: string;
  quantity: number;
  unitPrice: number;
  taxrateCode: string;
  justification: string;
}
