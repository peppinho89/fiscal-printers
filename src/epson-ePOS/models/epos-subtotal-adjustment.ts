import { EPOSPrintRecAdjustmentTypeEnum } from '../enums/epos-print-rec-adjustment-type.enum';

export interface ISubtotalAdjustment {
  operator: string;
  adjustmentType: EPOSPrintRecAdjustmentTypeEnum;
  description: string;
  amount: number;
}

export class EPOSPrintRecSubtotalAdjustment {
  constructor(subtotalAdjustmentObj?: ISubtotalAdjustment) {
    this.operator = subtotalAdjustmentObj?.operator || '';
    this.adjustmentType =
      subtotalAdjustmentObj?.adjustmentType ||
      EPOSPrintRecAdjustmentTypeEnum.DISCOUNT_ON_SUBTOTAL_WITH_SUBTOTAL_PRINTED;
    this.description = subtotalAdjustmentObj?.description || '';
    this.amount = subtotalAdjustmentObj?.amount || 0;
  }
  operator: string;
  adjustmentType: EPOSPrintRecAdjustmentTypeEnum;
  description: string;
  amount: number;
}
