import { EPOSPrintRecItemAdjustmentTypeEnum } from '../enums';

export interface IPrintRecItemAdjustment {
  description: string;
  amount: number;
  adjustmentType: EPOSPrintRecItemAdjustmentTypeEnum;
  taxRateCode: string;
  justification?: string;
}

export class EPOSPrintRecItemAdjustment {
  constructor(printRecItemAdjustmentObj?: IPrintRecItemAdjustment) {
    this.description = printRecItemAdjustmentObj?.description || 'Generico';
    this.amount = printRecItemAdjustmentObj?.amount || 0;
    this.adjustmentType =
      printRecItemAdjustmentObj?.adjustmentType || EPOSPrintRecItemAdjustmentTypeEnum.DISCOUNT_ON_LAST_SALE;
    this.taxrateCode = printRecItemAdjustmentObj?.taxRateCode || '';
    this.justification = printRecItemAdjustmentObj?.justification || '1';
  }
  description: string;
  amount: number;
  adjustmentType: EPOSPrintRecItemAdjustmentTypeEnum;
  taxrateCode: string;
  justification: string;
}
