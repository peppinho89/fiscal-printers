import { EPOSFiscalPrinterModeEnum } from '../epson-ePOS/enums/epos-fiscal-printer-mode.enum';
import { EPOSPaymentTypeEnum } from '../epson-ePOS/enums/epos-payment-type.enum';
import { EPOSFiscalPrinter } from '../epson-ePOS/index';
import { EPOSFiscalPrintReceiptResponse } from '../epson-ePOS/models/epos-fiscal-print-receipt-response';
import { EPOSPrintRecItem } from '../epson-ePOS/models/epos-print-rec-item';
import * as moment from 'moment';
import { EPOSPrintZReportResponse } from '../epson-ePOS/models/epos-print-z-report-response';
import { EPOSCancelFiscalReceiptResponse } from '../epson-ePOS/models/epos-cancel-fiscal-receipt-response';
import { EPOSPrintRecItemAdjustment } from '../epson-ePOS/models/epos-print-rec-item-adjustment';
import {
  EPOSFontEnum,
  EPOSPrintRecAdjustmentTypeEnum,
  EPOSPrintRecItemAdjustmentTypeEnum,
  EPOSPrintRecMessageTypeEnum,
  EPOSPrintRecSubtotalOptionEnum,
} from '../epson-ePOS/enums';
import { EPOSPrintRecMessage } from '../epson-ePOS/models/epos-print-rec-message';
import { EPOSPrintRecSubtotalAdjustment } from '../epson-ePOS/models/epos-subtotal-adjustment';

jest.setTimeout(20000);

test('Epson Fiscal Printer - Print Fiscal Receipt', async () => {
  const fp = new EPOSFiscalPrinter('', EPOSFiscalPrinterModeEnum.TEST);

  const items: EPOSPrintRecItem[] = [
    new EPOSPrintRecItem({
      description: 'Car',
      quantity: 1,
      unitPrice: 10,
      taxRateCode: 'IT-VAT-4',
      justification: '1',
    }),
    new EPOSPrintRecItem({
      description: 'Service Charge Airport Transfert',
      quantity: 1,
      unitPrice: 0,
      taxRateCode: 'IT-VAT-4',
      justification: '1',
    }),
    new EPOSPrintRecItem({
      description: 'Service Charge Airport Transfert',
      quantity: 1,
      unitPrice: 0,
      taxRateCode: 'IT-VAT-4',
      justification: '1',
    }),
    new EPOSPrintRecItem({
      description: 'Service Charge Airport Transfert',
      quantity: 1,
      unitPrice: 0,
      taxRateCode: 'IT-VAT-4',
      justification: '1',
    }),
    new EPOSPrintRecItem({
      description: 'Dinner 05/10/2021',
      quantity: 2,
      unitPrice: 15,
      taxRateCode: 'IT-VAT-4',
      justification: '1',
    }),
    new EPOSPrintRecItem({
      description: 'Night 05/10/2021',
      quantity: 1,
      unitPrice: 50,
      taxRateCode: 'IT-VAT-4',
      justification: '1',
    }),
    new EPOSPrintRecItem({
      description: 'Dinner 04/10/2021',
      quantity: 2,
      unitPrice: 15,
      taxRateCode: 'IT-VAT-4',
      justification: '1',
    }),
    new EPOSPrintRecItem({
      description: 'Night 04/10/2021',
      quantity: 1,
      unitPrice: 50,
      taxRateCode: 'IT-VAT-4',
      justification: '1',
    }),
  ];

  const itemAdjustments: EPOSPrintRecItemAdjustment[] = [
    new EPOSPrintRecItemAdjustment({
      adjustmentType: EPOSPrintRecItemAdjustmentTypeEnum.DEPOSIT,
      amount: 100,
      description: 'Res n. 7',
      justification: '1',
      taxRateCode: 'IT-VAT-4',
    }),
  ];

  const footerMessages: EPOSPrintRecMessage[] = [
    new EPOSPrintRecMessage({
      messageType: EPOSPrintRecMessageTypeEnum.TRAILER,
      font: EPOSFontEnum.DOUBLE_HEIGHT,
      message: 'dev-test',
    }),
    new EPOSPrintRecMessage({
      messageType: EPOSPrintRecMessageTypeEnum.TRAILER,
      font: EPOSFontEnum.NORMAL,
      message: '',
    }),
    new EPOSPrintRecMessage({
      messageType: EPOSPrintRecMessageTypeEnum.TRAILER,
      font: EPOSFontEnum.NORMAL,
      message: 'Cliente:',
    }),
    new EPOSPrintRecMessage({
      messageType: EPOSPrintRecMessageTypeEnum.TRAILER,
      font: EPOSFontEnum.NORMAL,
      message: '',
    }),
    new EPOSPrintRecMessage({
      messageType: EPOSPrintRecMessageTypeEnum.TRAILER,
      font: EPOSFontEnum.BOLD_AND_DOUBLE_HEIGHT,
      message: 'Budner Budner',
    }),
    new EPOSPrintRecMessage({
      messageType: EPOSPrintRecMessageTypeEnum.TRAILER,
      font: EPOSFontEnum.NORMAL,
      message: 'Arrivo 04/10/2021 - Partenza 06/10/2021',
    }),
  ];

  const subtotalAdjustment = new EPOSPrintRecSubtotalAdjustment({
    adjustmentType: EPOSPrintRecAdjustmentTypeEnum.DISCOUNT_ON_SUBTOTAL_WITH_SUBTOTAL_PRINTED,
    amount: 30,
    description: 'SCONTO EUR',
    justification: '1',
  });

  const res = await fp.printFiscalReceipt({
    items,
    paymentType: EPOSPaymentTypeEnum.CASH,
    paymentDescription: 'PAGAMENTO EUR',
    itemAdjustments,
    footerMessages,
    subtotalAdjustment,
    subtotalOption: EPOSPrintRecSubtotalOptionEnum.ONLY_PRINT,
  });

  const expectedResult: EPOSFiscalPrintReceiptResponse = {
    success: true,
    code: '',
    status: '2',
    elementList:
      'lastCommand,printerStatus,fiscalReceiptNumber,fiscalReceiptAmount,fiscalReceiptDate,fiscalReceiptTime,zRepNumber',
    lastCommand: '74',
    printerStatus: '20110',
    fiscalReceiptNumber: '1',
    fiscalReceiptAmount: '1,00',
    fiscalReceiptDate: moment().format('DD/MM/YYYY'),
    fiscalReceiptTime: moment().format('HH:MM'),
    zRepNumber: '764',
  };

  expect(res).toEqual(expectedResult);
});

test('Epson Fiscal Printer - Print Z Report', async () => {
  const fp = new EPOSFiscalPrinter('', EPOSFiscalPrinterModeEnum.TEST);

  const res = await fp.dailyClosure();

  const expectedResult: EPOSPrintZReportResponse = {
    success: true,
    code: '',
    elementList: 'lastCommand,printerStatus,zRepNumber,dailyAmount',
    lastCommand: '74',
    printerStatus: '20110',
    dailyAmount: '176,40',
    zRepNumber: '764',
  };

  expect(res).toEqual(expectedResult);
});

test('Epson Fiscal Printer - Cancel Fiscal Receipt', async () => {
  const fp = new EPOSFiscalPrinter('', EPOSFiscalPrinterModeEnum.TEST);

  const res = await fp.cancelFiscalReceipt('0123-0001', new Date(), '99MMX066111');

  const expectedResult: EPOSCancelFiscalReceiptResponse = {
    success: true,
    code: '',
    status: '2',
  };

  expect(res).toEqual(expectedResult);
});

test('Epson Fiscal Printer - Print Z Report Live error', async () => {
  const fp = new EPOSFiscalPrinter(
    ' http://0.0.0.0/cgi-bin/fpmate.cgi?devid=local_printer&timeout=10000',
    EPOSFiscalPrinterModeEnum.LIVE,
  );

  const res = await fp.dailyClosure();

  expect(res).toHaveProperty('message');
});
