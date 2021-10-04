import { EPOSFiscalPrinterModeEnum } from './enums/epos-fiscal-printer-mode.enum';
import { EPOSPaymentTypeEnum } from './enums/epos-payment-type.enum';
import { EPOSPrintRecSubtotalOptionEnum } from './enums/epos-print-rec-subtotal-option.enum';
import { EPOSPrintRecItem } from './models/epos-print-rec-item';
import { EPOSPrintRecSubtotalAdjustment } from './models/epos-subtotal-adjustment';
import {
  setXmlParameters,
  getPrintRecTotalIndexByPaymentType,
  SEND_AVAILABLE_COMMANDS,
  getDepartmentByTaxrateCode,
} from './utils/epos-utils';
import { Builder } from 'xml2js';
import axios from 'axios';
import { EPOSFiscalPrintReceiptResponse } from './models/epos-fiscal-print-receipt-response';
import { EPOSPrintZReportResponse } from './models/epos-print-z-report-response';
import { ErrorResponse } from '../common/error-response.interface';
import {
  parseEPOSCancelFiscalReceiptXmlResponse,
  parseEPOSFiscalPrintXmlResponse,
  parseEPOSPrintZReportXmlResponse,
} from './utils/epos-parser';
import { EPOSCancelFiscalReceiptResponse } from './models/epos-cancel-fiscal-receipt-response';
import { FiscalPrinter } from '../common/fiscal-printer.interface';
import { EPOSPrintRecItemAdjustment } from './models/epos-print-rec-item-adjustment';
import * as moment from 'moment';
import { IEPOSPrintFiscalReceiptInput } from './models/epos-print-fiscal-receipt-input';

export class EPOSFiscalPrinter implements FiscalPrinter {
  public requestUrl: string;
  public operator: string;
  public mode: EPOSFiscalPrinterModeEnum;
  constructor(
    fiscalPrinterAddress: string,
    mode: EPOSFiscalPrinterModeEnum = EPOSFiscalPrinterModeEnum.TEST,
    timeout: number = 5000,
    operator: string = '1',
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
    options: IEPOSPrintFiscalReceiptInput,
  ): Promise<EPOSFiscalPrintReceiptResponse | ErrorResponse> {
    try {
      const printRecItem = options.items.map((item) => ({
        $: {
          operator: this.operator,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          department: getDepartmentByTaxrateCode(item.taxrateCode),
          justification: item.justification,
        },
      }));

      let printRecItemAdjustment = null;
      if (options.itemAdjustments) {
        printRecItemAdjustment = options.itemAdjustments.map((item) => ({
          $: {
            operator: this.operator,
            adjustmentType: item.adjustmentType,
            description: item.description,
            amount: item.amount,
            department: getDepartmentByTaxrateCode(item.taxrateCode),
            justification: item.justification,
          },
        }));
      }

      let printRecSubtotalAdjustment = null;
      if (options.subtotalAdjustment) {
        printRecSubtotalAdjustment = {
          $: {
            operator: this.operator,
            adjustmentType: options.subtotalAdjustment.adjustmentType,
            description: options.subtotalAdjustment.description,
            amount: options.subtotalAdjustment.amount,
          },
        };
      }

      let printRecMessage = null;
      if (options.footerMessages) {
        printRecMessage = options.footerMessages.map((item, i) => ({
          $: {
            operator: this.operator,
            message: item.message,
            messageType: item.messageType,
            font: item.font,
            index: (i + 1).toString(),
          },
        }));
      }

      const computedIndex = options.index || getPrintRecTotalIndexByPaymentType(options.paymentType);

      const body = {
        printerFiscalReceipt: {
          beginFiscalReceipt: {
            $: {
              operator: this.operator,
            },
          },
          printRecItem,
          ...(printRecItemAdjustment && { printRecItemAdjustment }),
          ...(printRecSubtotalAdjustment && { printRecSubtotalAdjustment }),
          printRecSubtotal: {
            $: {
              operator: this.operator,
              option: options.subtotalOption || '1',
            },
          },
          printRecTotal: {
            $: {
              operator: this.operator,
              description: options.paymentDescription,
              payment: options.payment || '0',
              paymentType: options.paymentType,
              index: computedIndex,
              justification: '1',
            },
          },
          ...(printRecMessage && { printRecMessage }),
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
   * @param documentNumber number of fiscalReceiptNumber (zRep-counter eg. 0134-0001)
   * @param date Payment Date
   * @param fiscalPrinterSerialNumber
   */
  async cancelFiscalReceipt(
    documentNumber: string,
    date: Date,
    fiscalPrinterSerialNumber: string,
  ): Promise<EPOSCancelFiscalReceiptResponse | ErrorResponse> {
    try {
      if (fiscalPrinterSerialNumber.length !== 11) {
        throw new Error('invalid serial number');
      }

      const splittedDocumentNumber = documentNumber.split('-');
      if (!splittedDocumentNumber || splittedDocumentNumber.length !== 2) {
        throw new Error('invalid document number format');
      }

      const zRepNumber = splittedDocumentNumber[0];
      const dailyCounterNumber = splittedDocumentNumber[1];

      const dateString = moment(date).format('DDMMYYYY');

      const message = `VOID ${zRepNumber} ${dailyCounterNumber} ${dateString} ${fiscalPrinterSerialNumber}`;

      const body = {
        printerFiscalReceipt: {
          printRecMessage: {
            $: {
              operator: this.operator,
              messageType: '4',
              message,
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
