export interface EPOSPrintZReportResponse {
  success?: boolean;
  code?: string;
  lastCommand?: string;
  elementList?: string;
  printerStatus?: string;
  dailyAmount?: string;
  zRepNumber?: string;
}
