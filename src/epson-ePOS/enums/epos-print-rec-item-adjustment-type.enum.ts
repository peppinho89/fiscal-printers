/**
 * Deposit: Acconto
 * Free_of_charge: Omaggio
 * Single_use_voucher: Buono monouso
 */
export enum EPOSPrintRecItemAdjustmentTypeEnum {
  DISCOUNT_ON_LAST_SALE = '0',
  DISCOUNT_ON_A_DEPARTMENT = '3',
  SURCHARGE_ON_LAST_SALE = '5',
  SURCHARGE_ON_A_DEPARTMENT = '8',
  DEPOSIT = '10',
  FREE_OF_CHARGE = '11',
  SINGLE_USE_VOUCHER = '12',
}
