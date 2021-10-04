import { EPOSPaymentTypeEnum, EPOSPrintRecSubtotalOptionEnum } from '../enums';
import { EPOSPrintRecItem } from './epos-print-rec-item';
import { EPOSPrintRecItemAdjustment } from './epos-print-rec-item-adjustment';
import { EPOSPrintRecMessage } from './epos-print-rec-message';
import { EPOSPrintRecSubtotalAdjustment } from './epos-subtotal-adjustment';

export interface IEPOSPrintFiscalReceiptInput {
  items: EPOSPrintRecItem[];
  paymentType: EPOSPaymentTypeEnum;
  paymentDescription: string;
  itemAdjustments?: EPOSPrintRecItemAdjustment[];
  index?: string;
  subtotalAdjustment?: EPOSPrintRecSubtotalAdjustment;
  subtotalOption?: EPOSPrintRecSubtotalOptionEnum;
  payment?: number;
  footerMessages?: EPOSPrintRecMessage[];
}

export class EPOSPrintFiscalReceiptInput {
  constructor(printFiscalReceiptInputObj?: IEPOSPrintFiscalReceiptInput) {
    this.items = printFiscalReceiptInputObj?.items || [];
    this.paymentType = printFiscalReceiptInputObj?.paymentType || EPOSPaymentTypeEnum.CASH;
    this.paymentDescription = printFiscalReceiptInputObj?.paymentDescription || 'PAGAMENTO EUR';
    this.itemAdjustments = printFiscalReceiptInputObj?.itemAdjustments || [];
    this.index = printFiscalReceiptInputObj?.index || '';
    this.subtotalAdjustment = printFiscalReceiptInputObj?.subtotalAdjustment || undefined;
    this.subtotalOption = printFiscalReceiptInputObj?.subtotalOption || EPOSPrintRecSubtotalOptionEnum.ONLY_PRINT;
    this.payment = printFiscalReceiptInputObj?.payment || 0;
    this.footerMessages = printFiscalReceiptInputObj?.footerMessages || [];
  }
  items: EPOSPrintRecItem[];
  paymentType: EPOSPaymentTypeEnum;
  paymentDescription: string;
  itemAdjustments?: EPOSPrintRecItemAdjustment[];
  index?: string;
  subtotalAdjustment?: EPOSPrintRecSubtotalAdjustment;
  subtotalOption?: EPOSPrintRecSubtotalOptionEnum;
  payment?: number;
  footerMessages?: EPOSPrintRecMessage[];
}
