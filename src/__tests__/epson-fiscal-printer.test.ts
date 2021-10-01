import { EPOSFiscalPrinterModeEnum } from '../epson-ePOS/enums/epos-fiscal-printer-mode.enum';
import { EPOSPaymentTypeEnum } from '../epson-ePOS/enums/epos-payment-type.enum';
import { EPOSFiscalPrinter } from '../epson-ePOS/index';
import { EPOSFiscalPrintReceiptResponse } from '../epson-ePOS/models/epos-fiscal-print-receipt-response';
import { EPOSPrintRecItem } from '../epson-ePOS/models/epos-print-rec-item';
import * as moment from 'moment';
import { EPOSPrintZReportResponse } from '../epson-ePOS/models/epos-print-z-report-response';
import { EPOSCancelFiscalReceiptResponse } from '../epson-ePOS/models/epos-cancel-fiscal-receipt-response';

jest.setTimeout(20000);

test('Epson Fiscal Printer - Print Fiscal Receipt', async () => {
  const fp = new EPOSFiscalPrinter('', EPOSFiscalPrinterModeEnum.TEST);

  const items: EPOSPrintRecItem[] = [
    new EPOSPrintRecItem({ description: 'Patatine fritte', quantity: 4, unitPrice: 10, taxRateCode: 'IT-VAT-22' }),
    new EPOSPrintRecItem({ description: 'Acqua naturale', quantity: 4, unitPrice: 10, taxRateCode: 'IT-VAT-22' }),
  ];

  const res = await fp.printFiscalReceipt(items, EPOSPaymentTypeEnum.CASH, 'PAGAMENTO EUR');

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

  const res = await fp.cancelFiscalReceipt('123', moment().format('DD-MM-YYYY'));

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
