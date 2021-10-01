import { EPOSPrintRecAdjustmentTypeEnum } from '../enums/epos-print-rec-adjustment-type.enum';

export interface ISubtotalAdjustment {
  adjustmentType: EPOSPrintRecAdjustmentTypeEnum;
  description: string;
  amount: number;
}

export class EPOSPrintRecSubtotalAdjustment {
  constructor(subtotalAdjustmentObj?: ISubtotalAdjustment) {
    this.adjustmentType =
      subtotalAdjustmentObj?.adjustmentType ||
      EPOSPrintRecAdjustmentTypeEnum.DISCOUNT_ON_SUBTOTAL_WITH_SUBTOTAL_PRINTED;
    this.description = subtotalAdjustmentObj?.description || '';
    this.amount = subtotalAdjustmentObj?.amount || 0;
  }
  adjustmentType: EPOSPrintRecAdjustmentTypeEnum;
  description: string;
  amount: number;
}
