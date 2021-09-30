import { Parser } from 'xml2js';
import { EPOSCancelFiscalReceiptResponse } from '../interfaces/epos-cancel-fiscal-receipt-response.interface';
import { EPOSFiscalPrintReceiptResponse } from '../interfaces/epos-fiscal-print-receipt-response';
import { EPOSPrintZReportResponse } from '../interfaces/epos-print-z-report-response.interface';

const envelopeKey = 'soapenv:Envelope';
const bodyKey = 'soapenv:Body';
const responseKey = 'response';

export async function parseEPOSFiscalPrintXmlResponse(data: string): Promise<EPOSFiscalPrintReceiptResponse> {
  const parser = new Parser({ explicitArray: false, mergeAttrs: true });

  const parsedResponse = await parser.parseStringPromise(data);

  const responseObject = parsedResponse[envelopeKey][bodyKey][responseKey];

  const result: EPOSFiscalPrintReceiptResponse = {
    success: responseObject?.success === 'true',
    code: responseObject?.code,
    status: responseObject?.status,
    elementList: responseObject?.addInfo?.elementList,
    lastCommand: responseObject?.addInfo?.lastCommand,
    printerStatus: responseObject?.addInfo?.printerStatus,
    fiscalReceiptNumber: responseObject?.addInfo?.fiscalReceiptNumber,
    fiscalReceiptAmount: responseObject?.addInfo?.fiscalReceiptAmount,
    fiscalReceiptDate: responseObject?.addInfo?.fiscalReceiptDate,
    fiscalReceiptTime: responseObject?.addInfo?.fiscalReceiptTime,
    zRepNumber: responseObject?.addInfo?.zRepNumber,
  };

  return result;
}

export async function parseEPOSPrintZReportXmlResponse(data: string): Promise<EPOSPrintZReportResponse> {
  const parser = new Parser({ explicitArray: false, mergeAttrs: true });

  const parsedResponse = await parser.parseStringPromise(data);

  const responseObject = parsedResponse[envelopeKey][bodyKey][responseKey];

  const result: EPOSPrintZReportResponse = {
    success: responseObject?.success === 'true',
    code: responseObject?.code,
    elementList: responseObject?.addInfo?.elementList,
    lastCommand: responseObject?.addInfo?.lastCommand,
    printerStatus: responseObject?.addInfo?.printerStatus,
    dailyAmount: responseObject?.addInfo?.dailyAmount,
    zRepNumber: responseObject?.addInfo?.zRepNumber,
  };

  return result;
}

export async function parseEPOSCancelFiscalReceiptXmlResponse(data: string): Promise<EPOSPrintZReportResponse> {
  const parser = new Parser({ explicitArray: false, mergeAttrs: true });

  const parsedResponse = await parser.parseStringPromise(data);

  const responseObject = parsedResponse[envelopeKey][bodyKey][responseKey];

  const result: EPOSCancelFiscalReceiptResponse = {
    success: responseObject?.success === 'true',
    code: responseObject?.code,
    status: responseObject?.status,
  };

  return result;
}
