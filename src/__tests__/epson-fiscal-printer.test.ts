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
} from '../epson-ePOS/enums';
import { EPOSPrintRecMessage } from '../epson-ePOS/models/epos-print-rec-message';

jest.setTimeout(20000);

test('Epson Fiscal Printer - Print Fiscal Receipt', async () => {
  const fp = new EPOSFiscalPrinter('', EPOSFiscalPrinterModeEnum.TEST);

  const items: EPOSPrintRecItem[] = [
    new EPOSPrintRecItem({
      description: 'Taxi',
      quantity: 1,
      unitPrice: 10,
      taxRateCode: 'IT-VAT-10',
      justification: '',
    }),
    new EPOSPrintRecItem({
      description: 'Champagne',
      quantity: 1,
      unitPrice: 10,
      taxRateCode: 'IT-VAT-10',
      justification: '',
    }),
  ];

  const itemAdjustments: EPOSPrintRecItemAdjustment[] = [
    new EPOSPrintRecItemAdjustment({
      adjustmentType: EPOSPrintRecItemAdjustmentTypeEnum.DEPOSIT,
      amount: 10,
      description: 'Res n. 123456',
      taxRateCode: 'IT-VAT-10',
    }),
    new EPOSPrintRecItemAdjustment({
      adjustmentType: EPOSPrintRecItemAdjustmentTypeEnum.DEPOSIT,
      amount: 10,
      description: 'Res n. 123456',
      taxRateCode: 'IT-VAT-10',
    }),
  ];

  const footerMessages: EPOSPrintRecMessage[] = [
    new EPOSPrintRecMessage({
      message: 'Ciro Immobile',
      font: EPOSFontEnum.DOUBLE_HEIGHT,
      messageType: EPOSPrintRecMessageTypeEnum.TRAILER,
    }),
    new EPOSPrintRecMessage({
      message: 'Arrivo 20/10/2021 - Partenza 25/10/2021',
      font: EPOSFontEnum.NORMAL,
      messageType: EPOSPrintRecMessageTypeEnum.TRAILER,
    }),
  ];

  const res = await fp.printFiscalReceipt({
    items,
    paymentType: EPOSPaymentTypeEnum.CASH,
    paymentDescription: 'PAGAMENTO EUR',
    itemAdjustments,
    footerMessages,
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
