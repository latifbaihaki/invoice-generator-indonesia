import { InvoiceItem, InvoiceData, TaxInvoiceData } from './types';

/**
 * Hitung subtotal dari items (sebelum diskon dan pajak)
 * 
 * @param items - Array of invoice items
 * @returns Subtotal dalam Rupiah
 */
export function calculateSubtotal(items: InvoiceItem[]): number {
  return items.reduce((total, item) => {
    let itemTotal = item.quantity * item.unitPrice;
    
    // Apply diskon per item jika ada
    if (item.discount !== undefined && item.discount > 0) {
      if (item.discountIsPercentage) {
        itemTotal = itemTotal * (1 - item.discount / 100);
      } else {
        itemTotal = itemTotal - item.discount;
      }
    }
    
    return total + itemTotal;
  }, 0);
}

/**
 * Hitung diskon dari subtotal
 * 
 * @param subtotal - Subtotal sebelum diskon
 * @param discount - Jumlah diskon (dalam Rupiah atau persentase)
 * @param isPercentage - Apakah diskon dalam bentuk persentase?
 * @returns Jumlah diskon dalam Rupiah
 */
export function calculateDiscount(
  subtotal: number,
  discount?: number,
  isPercentage?: boolean
): number {
  if (!discount || discount <= 0) return 0;
  
  if (isPercentage) {
    return subtotal * (discount / 100);
  }
  
  return discount;
}

/**
 * Hitung DPP (Dasar Pengenaan Pajak) untuk faktur pajak
 * DPP = Harga Jual - Potongan Harga - Uang Muka
 * 
 * @param items - Array of invoice items
 * @param discount - Diskon global (dalam Rupiah atau persentase)
 * @param discountIsPercentage - Apakah diskon dalam bentuk persentase?
 * @param downPayment - Uang muka yang telah diterima
 * @returns DPP dalam Rupiah
 */
export function calculateDPP(
  items: InvoiceItem[],
  discount?: number,
  discountIsPercentage?: boolean,
  downPayment?: number
): number {
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculateDiscount(subtotal, discount, discountIsPercentage);
  const dpp = subtotal - discountAmount - (downPayment || 0);
  
  // DPP tidak boleh negatif
  return Math.max(0, dpp);
}

/**
 * Hitung PPN (Pajak Pertambahan Nilai)
 * Default rate: 11% (tarif terkini di Indonesia)
 * 
 * @param dpp - Dasar Pengenaan Pajak
 * @param rate - Tarif PPN (default: 11)
 * @returns PPN dalam Rupiah
 */
export function calculatePPN(dpp: number, rate: number = 11): number {
  if (rate <= 0) return 0;
  return dpp * (rate / 100);
}

/**
 * Hitung total invoice lengkap
 * 
 * @param invoiceData - Data invoice
 * @returns Object berisi semua kalkulasi (subtotal, discount, ppn, total)
 */
export function calculateInvoiceTotals(invoiceData: InvoiceData): {
  subtotal: number;
  discount: number;
  ppn: number;
  additionalFees: number;
  total: number;
} {
  const subtotal = calculateSubtotal(invoiceData.items);
  const discount = calculateDiscount(
    subtotal,
    invoiceData.discount,
    invoiceData.discountIsPercentage
  );
  
  const afterDiscount = subtotal - discount;
  
  // Hitung biaya tambahan
  const additionalFees = (invoiceData.additionalFees || []).reduce(
    (sum, fee) => sum + fee.amount,
    0
  );
  
  // Hitung PPN
  let ppn = 0;
  const ppnRate = invoiceData.ppnRate ?? 11;
  const includePPN = invoiceData.includePPN !== false && ppnRate > 0;
  
  if (includePPN) {
    // DPP untuk invoice standar = afterDiscount
    ppn = calculatePPN(afterDiscount, ppnRate);
  }
  
  const total = afterDiscount + ppn + additionalFees;
  
  return {
    subtotal,
    discount,
    ppn,
    additionalFees,
    total
  };
}

/**
 * Hitung total faktur pajak lengkap
 * 
 * @param taxInvoiceData - Data faktur pajak
 * @returns Object berisi semua kalkulasi (subtotal, discount, downPayment, dpp, ppn, ppnbm, total)
 */
export function calculateTaxInvoiceTotals(taxInvoiceData: TaxInvoiceData): {
  subtotal: number;
  discount: number;
  downPayment: number;
  dpp: number;
  ppn: number;
  ppnbm: number;
  total: number;
} {
  const subtotal = calculateSubtotal(taxInvoiceData.items);
  const discount = calculateDiscount(
    subtotal,
    taxInvoiceData.discount,
    taxInvoiceData.discountIsPercentage
  );
  const downPayment = taxInvoiceData.downPayment || 0;
  
  // Hitung DPP
  const dpp = calculateDPP(
    taxInvoiceData.items,
    taxInvoiceData.discount,
    taxInvoiceData.discountIsPercentage,
    downPayment
  );
  
  // Hitung PPN (wajib untuk faktur pajak)
  const ppnRate = taxInvoiceData.ppnRate ?? 11;
  const ppn = calculatePPN(dpp, ppnRate);
  
  // Hitung PPnBM jika ada
  let ppnbm = 0;
  if (taxInvoiceData.ppnbm !== undefined && taxInvoiceData.ppnbm > 0) {
    ppnbm = taxInvoiceData.ppnbm;
  } else if (taxInvoiceData.ppnbmRate !== undefined && taxInvoiceData.ppnbmRate > 0) {
    ppnbm = dpp * (taxInvoiceData.ppnbmRate / 100);
  }
  
  const total = dpp + ppn + ppnbm;
  
  return {
    subtotal,
    discount,
    downPayment,
    dpp,
    ppn,
    ppnbm,
    total
  };
}

