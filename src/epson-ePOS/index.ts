import { EPOSFiscalPrinterModeEnum } from './enums/epos-fiscal-printer-mode.enum';
import { EPOSPaymentTypeEnum } from './enums/epos-payment-type.enum';
import { EPOSPrintRecSubtotalOptionEnum } from './enums/epos-print-rec-subtotal-option.enum';
import { EPOSPrintRecItem } from './interfaces/epos-print-rec-item.interface';
import { EPOSPrintRecSubtotalAdjustment } from './interfaces/epos-subtotal-adjustment.interface';
import { setXmlParameters, getPrintRecTotalIndexByPaymentType, SEND_AVAILABLE_COMMANDS } from './utils/epos-utils';
import { Builder, Parser } from 'xml2js';
import axios from 'axios';
import { EPOSFiscalPrintReceiptResponse } from './interfaces/epos-fiscal-print-receipt-response';
import { EPOSPrintZReportResponse } from './interfaces/epos-print-z-report-response.interface';
import { ErrorResponse } from '../common/error-response.interface';
import {
  parseEPOSCancelFiscalReceiptXmlResponse,
  parseEPOSFiscalPrintXmlResponse,
  parseEPOSPrintZReportXmlResponse,
} from './utils/epos-parser';
import { EPOSCancelFiscalReceiptResponse } from './interfaces/epos-cancel-fiscal-receipt-response.interface';
import { FiscalPrinter } from '../common/fiscal-printer.interface';

export class EPOSFiscalPrinter implements FiscalPrinter {
  public requestUrl: string;
  public operator: string;
  public mode: EPOSFiscalPrinterModeEnum;
  constructor(
    fiscalPrinterAddress: string,
    mode: EPOSFiscalPrinterModeEnum = EPOSFiscalPrinterModeEnum.TEST,
    timeout: number = 5000,
    operator: string = '01',
  ) {
    this.requestUrl = fiscalPrinterAddress;
    this.operator = operator;
    this.mode = mode;
  }

  /**
   * Description: send method to the fiscal ePOS-Printer
   * @param body Body to include in XML
   * @param command Command to send
   */
  private async send(body: any, command: any): Promise<any> {
    const config = {
      headers: { 'Content-Type': 'text/xml' },
    };

    const bodyWithAllXmlparameters = setXmlParameters(body);

    const xml = new Builder({ xmldec: { version: '1.0', encoding: 'UTF-8' } }).buildObject(bodyWithAllXmlparameters);

    if (this.mode === EPOSFiscalPrinterModeEnum.LIVE) {
      return await new Promise((resolve, reject) => {
        axios
          .post(this.requestUrl, xml, config)
          .then((res) => resolve(res.data))
          .catch((err) => reject(err));
      });
    } else {
      return await new Promise((resolve) => {
        resolve(command.fakeResponse);
      });
    }
  }

  /**
   * Description: prepare body and send the fiscal ePOS-Print XML message to print fiscal receipt
   * @param items Sold items
   * @param paymentType CASH - CHEQUE - CREDIT_CARD - TICKET
   * @param paymentDescription Payment description
   * @param index 0 - 1 - null. If null the value is based on payment type
   * @param subtotalAdjustment Subtotal Adjustment useful to handling discount on subtotal
   * @param subtotalOption PRINT_AND_SHOW_ON_DISPLAY = '0', ONLY_PRINT = '1', ONLY_SHOW_ON_DISPLAY = '2',
   * @param payment Amount paid by the customer
   */
  async printFiscalReceipt(
    items: EPOSPrintRecItem[],
    paymentType: EPOSPaymentTypeEnum,
    paymentDescription: string,
    index?: string,
    subtotalAdjustment?: EPOSPrintRecSubtotalAdjustment,
    subtotalOption?: EPOSPrintRecSubtotalOptionEnum,
    payment?: number,
  ): Promise<EPOSFiscalPrintReceiptResponse | ErrorResponse> {
    try {
      const printRecItem = items.map((item) => ({
        $: {
          operator: this.operator,
          ...item,
        },
      }));

      let printRecSubtotalAdjustment = null;
      if (subtotalAdjustment) {
        printRecSubtotalAdjustment = {
          $: {
            operator: this.operator,
            adjustmentType: subtotalAdjustment.adjustmentType,
            description: subtotalAdjustment.description,
            amount: subtotalAdjustment.amount,
          },
        };
      }

      const computedIndex = index || getPrintRecTotalIndexByPaymentType(paymentType);

      const body = {
        printerFiscalReceipt: {
          beginFiscalReceipt: {
            $: {
              operator: this.operator,
            },
          },
          printRecItem,
          ...(printRecSubtotalAdjustment && { printRecSubtotalAdjustment }),
          printRecSubtotal: {
            $: {
              operator: this.operator,
              option: subtotalOption || '1',
            },
          },
          printRecTotal: {
            $: {
              operator: this.operator,
              description: paymentDescription,
              payment: payment || '0',
              paymentType,
              computedIndex,
            },
          },
          endFiscalReceipt: {
            $: {
              operator: this.operator,
            },
          },
        },
      };

      const sendResponse = await this.send(body, SEND_AVAILABLE_COMMANDS.PRINT_FISCAL_RECEIPT);

      const result: EPOSFiscalPrintReceiptResponse = await parseEPOSFiscalPrintXmlResponse(sendResponse);

      return result;
    } catch (error) {
      return { message: JSON.stringify(error) };
    }
  }

  /**
   * Description: cancel fiscal receipt
   * @param documentNumber number of fiscalReceiptNumber
   * @param formattedDate date formatted eg. DD-MM-YYYY
   */
  async cancelFiscalReceipt(
    documentNumber: string,
    formattedDate: string,
  ): Promise<EPOSCancelFiscalReceiptResponse | ErrorResponse> {
    try {
      const body = {
        printerCommand: {
          directIO: {
            $: {
              command: SEND_AVAILABLE_COMMANDS.CANCEL_FISCAL_RECEIPT.command,
              data: SEND_AVAILABLE_COMMANDS.CANCEL_FISCAL_RECEIPT.data(documentNumber, formattedDate),
              timeout: SEND_AVAILABLE_COMMANDS.CANCEL_FISCAL_RECEIPT.timeout,
            },
          },
        },
      };

      const sendResponse = await this.send(body, SEND_AVAILABLE_COMMANDS.CANCEL_FISCAL_RECEIPT);
      const result: EPOSCancelFiscalReceiptResponse = await parseEPOSCancelFiscalReceiptXmlResponse(sendResponse);

      return result;
    } catch (error) {
      return { message: JSON.stringify(error) };
    }
  }

  /**
   * Description: Daily fiscal closure (Z report)
   */
  async dailyClosure(): Promise<EPOSPrintZReportResponse | ErrorResponse> {
    try {
      const body = {
        printerFiscalReport: {
          printZReport: {
            $: {
              operator: this.operator,
            },
          },
        },
      };

      const sendResponse = await this.send(body, SEND_AVAILABLE_COMMANDS.PRINT_Z_REPORT);

      const result: EPOSPrintZReportResponse = await parseEPOSPrintZReportXmlResponse(sendResponse);

      return result;
    } catch (error) {
      return { message: JSON.stringify(error) };
    }
  }
}
