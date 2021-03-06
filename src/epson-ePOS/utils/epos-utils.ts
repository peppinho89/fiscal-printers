import { EPOSPaymentTypeEnum } from '../enums/epos-payment-type.enum';
import * as moment from 'moment';

export function getDepartmentByTaxrateCode(taxrateCode: string) {
  switch (taxrateCode) {
    case 'IT-VAT-0':
      return '1';
    case 'IT-VAT-4':
      return '9';
    case 'IT-VAT-5':
      return '11';
    case 'IT-VAT-10':
      return '13';
    case 'IT-VAT-22':
      return '15';
    default:
      return '13';
  }
}

export function getPrintRecTotalIndexByPaymentType(paymentType: EPOSPaymentTypeEnum): string {
  switch (paymentType) {
    case EPOSPaymentTypeEnum.CASH:
      return '0';
    case EPOSPaymentTypeEnum.CREDIT_CARD:
      return '1';
    default:
      return '0';
  }
}

export function setXmlParameters(body: any) {
  return {
    's:Envelope': {
      $: {
        'xmlns:s': 'http://schemas.xmlsoap.org/soap/envelope',
      },
      's:Body': {
        ...body,
      },
    },
  };
}

export const SEND_AVAILABLE_COMMANDS = {
  PRINT_FISCAL_RECEIPT: {
    fakeResponse: `
        <?xml version="1.0" encoding="utf-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
          <soapenv:Body>
              <response success="true" code="" status="2">
                <addInfo>
                    <elementList>lastCommand,printerStatus,fiscalReceiptNumber,fiscalReceiptAmount,fiscalReceiptDate,fiscalReceiptTime,zRepNumber</elementList>
                    <lastCommand>74</lastCommand>
                    <printerStatus>20110</printerStatus>
                    <fiscalReceiptNumber>1</fiscalReceiptNumber>
                    <fiscalReceiptAmount>1,00</fiscalReceiptAmount>
                    <fiscalReceiptDate>${moment().format('DD/MM/YYYY')}</fiscalReceiptDate>
                    <fiscalReceiptTime>${moment().format('HH:MM')}</fiscalReceiptTime>
                    <zRepNumber>764</zRepNumber>
                </addInfo>
              </response>
            </soapenv:Body>
      </soapenv:Envelope>`,
  },
  PRINT_Z_REPORT: {
    fakeResponse: `
    <?xml version="1.0" encoding="utf-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Body>
          <response success="true" code="" status="2">
            <addInfo>
                <elementList>lastCommand,printerStatus,zRepNumber,dailyAmount</elementList>
                <lastCommand>74</lastCommand>
                <printerStatus>20110</printerStatus>
                <zRepNumber>764</zRepNumber>
                <dailyAmount>176,40</dailyAmount>
            </addInfo>
          </response>
        </soapenv:Body>
    </soapenv:Envelope>`,
  },
  CANCEL_FISCAL_RECEIPT: {
    fakeResponse: `
    <?xml version="1.0" encoding="utf-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Body>
          <response success="true" code="" status="2">
            <addInfo>
                <elementList>lastCommand,printerStatus,fiscalReceiptNumber,fiscalReceiptAmount,fiscalReceiptDate,fiscalReceiptTime,zRepNumber</elementList>
                <lastCommand>74</lastCommand>
                <printerStatus>20110</printerStatus>
                <fiscalReceiptNumber>1</fiscalReceiptNumber>
                <fiscalReceiptAmount>1,00</fiscalReceiptAmount>
                <fiscalReceiptDate>${moment().format('DD/MM/YYYY')}</fiscalReceiptDate>
                <fiscalReceiptTime>${moment().format('HH:MM')}</fiscalReceiptTime>
                <zRepNumber>764</zRepNumber>
            </addInfo>
          </response>
        </soapenv:Body>
  </soapenv:Envelope>`,
  },
};
