import { EPOSFontEnum } from '../enums/epos-font.enum';
import { EPOSPrintRecMessageTypeEnum } from '../enums/epos-print-rec-message-type.enum';

export interface IPrintRecMessage {
  messageType: EPOSPrintRecMessageTypeEnum;
  font: EPOSFontEnum;
  message: string;
}

export class EPOSPrintRecMessage {
  constructor(printRecMessageObj?: IPrintRecMessage) {
    this.messageType = printRecMessageObj?.messageType || EPOSPrintRecMessageTypeEnum.TRAILER;
    this.font = printRecMessageObj?.font || EPOSFontEnum.NORMAL;
    this.message = printRecMessageObj?.message || '';
  }
  messageType: EPOSPrintRecMessageTypeEnum;
  font: EPOSFontEnum;
  message: string;
}
