// @ts-ignore
export interface FiscalPrinter {
  printFiscalReceipt: (...args: any[]) => Promise<any>;
  cancelFiscalReceipt: (...args: any[]) => Promise<any>;
  dailyClosure: (...args: any[]) => Promise<any>;
}
