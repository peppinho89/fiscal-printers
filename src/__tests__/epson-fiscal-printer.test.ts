import { EPOSFiscalPrinterModeEnum } from '../epson-ePOS/enums/epos-fiscal-printer-mode.enum';
import { EPOSPaymentTypeEnum } from '../epson-ePOS/enums/epos-payment-type.enum';
import { EPOSFiscalPrinter } from '../epson-ePOS/index';
import { EPOSFiscalPrintReceiptResponse } from '../epson-ePOS/interfaces/epos-fiscal-print-receipt-response';
import { EPOSPrintRecItem } from '../epson-ePOS/interfaces/epos-print-rec-item.interface';
import * as moment from 'moment';
import { EPOSPrintZReportResponse } from '../epson-ePOS/interfaces/epos-print-z-report-response.interface';
import { EPOSCancelFiscalReceiptResponse } from '../epson-ePOS/interfaces/epos-cancel-fiscal-receipt-response.interface';

jest.setTimeout(20000);

test('Epson Fiscal Printer - Print Fiscal Receipt', async () => {
  const fp = new EPOSFiscalPrinter('', EPOSFiscalPrinterModeEnum.TEST);

  const items: EPOSPrintRecItem[] = [
    {
      description: 'Pasta al sugo',
      department: '',
      quantity: 4,
      unitPrice: 10.0,
    },
    {
      description: 'Patatine fritte',
      department: '',
      quantity: 2,
      unitPrice: 5.5,
    },
    {
      description: 'Acqua naturale',
      department: '',
      quantity: 1,
      unitPrice: 2.5,
    },
    {
      description: 'Coca Cola',
      department: '',
      quantity: 1,
      unitPrice: 2.0,
    },
    {
      description: 'Coperto',
      department: '',
      quantity: 4,
      unitPrice: 1.0,
    },
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
  const fp = new EPOSFiscalPrinter('http://192.192.192.192', EPOSFiscalPrinterModeEnum.LIVE);

  const res = await fp.dailyClosure();

  expect(res).toHaveProperty('message');
});
