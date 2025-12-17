import { InvoiceData, TaxInvoiceData, InvoiceOptions } from './types';
import { generateInvoiceHTML, generateTaxInvoiceHTML } from './template-engine';
import { exportInvoiceAsPDF, generateInvoicePDFBlob } from './pdf-exporter';
import { exportInvoiceAsHTML, getInvoiceHTML } from './html-exporter';
import { exportInvoiceAsPNG, exportInvoiceAsSVG, generateInvoicePNGDataURI } from './image-exporter';
import { formatRupiah, formatTanggal, formatNPWP, formatPhone } from './formatters';
import { terbilangRupiah } from './terbilang';

/**
 * Indonesian Invoice Generator
 * 
 * Library untuk generate invoice dan faktur pajak Indonesia dengan format yang sesuai
 * standar perpajakan Indonesia, termasuk terbilang Rupiah, format tanggal Indonesia,
 * kalkulasi PPN 11%, dan multiple export format (PDF, HTML, PNG, SVG).
 * 
 * @example
 * ```typescript
 * const generator = new InvoiceGenerator();
 * 
 * const invoiceData = {
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   seller: {
 *     name: 'PT Contoh Sukses',
 *     address: 'Jl. Merdeka No. 123, Jakarta',
 *     npwp: '012345678901000'
 *   },
 *   buyer: {
 *     name: 'CV Maju Jaya',
 *     address: 'Jl. Sejahtera No. 45, Bandung'
 *   },
 *   items: [
 *     {
 *       name: 'Laptop XYZ',
 *       quantity: 2,
 *       unitPrice: 10000000
 *     }
 *   ]
 * };
 * 
 * const html = await generator.generate(invoiceData);
 * await generator.exportAsPDF(html, 'invoice.pdf');
 * ```
 */
export class InvoiceGenerator {
  /**
   * Generate invoice standar dalam format HTML
   * 
   * @param data - Data invoice
   * @param options - Opsi untuk generate invoice
   * @returns Promise<string> - HTML string dari invoice
   */
  async generate(data: InvoiceData, options?: InvoiceOptions): Promise<string> {
    return generateInvoiceHTML(data, options);
  }

  /**
   * Generate faktur pajak dalam format HTML
   * 
   * @param data - Data faktur pajak
   * @param options - Opsi untuk generate faktur pajak
   * @returns Promise<string> - HTML string dari faktur pajak
   */
  async generateTaxInvoice(data: TaxInvoiceData, options?: InvoiceOptions): Promise<string> {
    return generateTaxInvoiceHTML(data, options);
  }

  /**
   * Export invoice sebagai PDF (browser only)
   * 
   * @param htmlString - HTML string dari invoice (hasil dari generate() atau generateTaxInvoice())
   * @param filename - Nama file untuk export (default: 'invoice.pdf')
   * @param options - Opsi untuk PDF (pageSize, orientation)
   */
  async exportAsPDF(
    htmlString: string,
    filename?: string,
    options?: {
      pageSize?: 'a4' | 'letter';
      orientation?: 'portrait' | 'landscape';
    }
  ): Promise<void> {
    return exportInvoiceAsPDF(htmlString, filename, options);
  }

  /**
   * Generate PDF blob dari HTML (untuk custom handling atau Node.js dengan DOM)
   * 
   * @param htmlString - HTML string dari invoice
   * @param options - Opsi untuk PDF
   * @returns Promise<Blob> - PDF blob
   */
  async generatePDFBlob(
    htmlString: string,
    options?: {
      pageSize?: 'a4' | 'letter';
      orientation?: 'portrait' | 'landscape';
    }
  ): Promise<Blob> {
    return generateInvoicePDFBlob(htmlString, options);
  }

  /**
   * Export invoice sebagai HTML file (browser only)
   * 
   * @param htmlString - HTML string dari invoice
   * @param filename - Nama file untuk export (default: 'invoice.html')
   */
  exportAsHTML(htmlString: string, filename?: string): void {
    return exportInvoiceAsHTML(htmlString, filename);
  }

  /**
   * Get HTML string (untuk penggunaan di Node.js atau custom handling)
   * 
   * @param htmlString - HTML string dari invoice
   * @returns HTML string
   */
  getHTML(htmlString: string): string {
    return getInvoiceHTML(htmlString);
  }

  /**
   * Export invoice sebagai PNG (browser only)
   * 
   * @param htmlString - HTML string dari invoice
   * @param filename - Nama file untuk export (default: 'invoice.png')
   * @param options - Opsi untuk export (scale, quality)
   */
  async exportAsPNG(
    htmlString: string,
    filename?: string,
    options?: {
      scale?: number;
      quality?: number;
    }
  ): Promise<void> {
    return exportInvoiceAsPNG(htmlString, filename, options);
  }

  /**
   * Export invoice sebagai SVG (browser only)
   * 
   * @param htmlString - HTML string dari invoice
   * @param filename - Nama file untuk export (default: 'invoice.svg')
   */
  async exportAsSVG(htmlString: string, filename?: string): Promise<void> {
    return exportInvoiceAsSVG(htmlString, filename);
  }

  /**
   * Generate PNG data URI dari HTML (untuk preview atau custom handling)
   * 
   * @param htmlString - HTML string dari invoice
   * @param options - Opsi untuk export
   * @returns Promise<string> - Data URI PNG
   */
  async generatePNGDataURI(
    htmlString: string,
    options?: {
      scale?: number;
    }
  ): Promise<string> {
    return generateInvoicePNGDataURI(htmlString, options);
  }

  /**
   * Convert angka ke terbilang Rupiah
   * 
   * @param amount - Jumlah uang dalam Rupiah
   * @returns String terbilang, contoh: "Sebelas Juta Empat Ratus Tiga Puluh Tiga Ribu Rupiah"
   * 
   * @example
   * generator.terbilang(11433000) // "Sebelas Juta Empat Ratus Tiga Puluh Tiga Ribu Rupiah"
   */
  terbilang(amount: number): string {
    return terbilangRupiah(amount);
  }

  /**
   * Format angka ke format Rupiah Indonesia
   * 
   * @param amount - Jumlah uang dalam Rupiah
   * @param includeDecimals - Apakah include desimal? (default: false)
   * @returns String format Rupiah, contoh: "Rp 1.000.000" atau "Rp 1.000.000,00"
   * 
   * @example
   * generator.formatRupiah(1000000) // "Rp 1.000.000"
   * generator.formatRupiah(1000000, true) // "Rp 1.000.000,00"
   */
  formatRupiah(amount: number, includeDecimals?: boolean): string {
    return formatRupiah(amount, includeDecimals);
  }

  /**
   * Format tanggal ke format Indonesia
   * 
   * @param date - Date object
   * @param format - Format yang diinginkan: 'long' (17 Desember 2024), 'short' (17/12/2024), atau 'medium' (17 Des 2024)
   * @returns String tanggal yang sudah diformat
   * 
   * @example
   * generator.formatTanggal(new Date(2024, 11, 17), 'long') // "17 Desember 2024"
   */
  formatTanggal(date: Date, format?: 'long' | 'short' | 'medium'): string {
    return formatTanggal(date, format);
  }

  /**
   * Format NPWP ke format standar Indonesia
   * 
   * @param npwp - Nomor NPWP
   * @returns String NPWP yang sudah diformat, contoh: "01.234.567.8-901.000"
   * 
   * @example
   * generator.formatNPWP("012345678901000") // "01.234.567.8-901.000"
   */
  formatNPWP(npwp: string): string {
    return formatNPWP(npwp);
  }

  /**
   * Format nomor telepon Indonesia (helper utility)
   * 
   * @param phone - Nomor telepon
   * @returns String nomor telepon yang sudah diformat
   * 
   * @example
   * generator.formatPhone("081234567890") // "0812-3456-7890"
   */
  formatPhone(phone: string): string {
    return formatPhone(phone);
  }
}

// Export types
export * from './types';

// Export utility functions
export { formatRupiah, formatTanggal, formatNPWP, formatPhone } from './formatters';
export { terbilangRupiah } from './terbilang';
export { 
  calculateSubtotal, 
  calculateDiscount, 
  calculatePPN, 
  calculateDPP,
  calculateInvoiceTotals,
  calculateTaxInvoiceTotals
} from './calculator';

// Default export
export default InvoiceGenerator;

