import { EPOSPrintRecAdjustmentTypeEnum } from '../enums/epos-print-rec-adjustment-type.enum';

export interface EPOSPrintRecSubtotalAdjustment {
  operator: string;
  adjustmentType: EPOSPrintRecAdjustmentTypeEnum;
  description: string;
  amount: number;
}
