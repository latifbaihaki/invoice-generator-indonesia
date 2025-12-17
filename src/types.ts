/**
 * Invoice Item - Representasi item barang/jasa dalam invoice
 */
export interface InvoiceItem {
  /** Nama atau deskripsi barang/jasa */
  name: string;
  /** Kuantitas/jumlah */
  quantity: number;
  /** Harga satuan (dalam Rupiah) */
  unitPrice: number;
  /** Diskon per item (opsional, dalam Rupiah atau persentase) */
  discount?: number;
  /** Apakah diskon dalam bentuk persentase? */
  discountIsPercentage?: boolean;
  /** Unit/satuan (opsional, seperti: pcs, kg, jam, dll) */
  unit?: string;
}

/**
 * Informasi Penjual
 */
export interface SellerInfo {
  /** Nama perusahaan atau individu penjual */
  name: string;
  /** Alamat lengkap */
  address: string;
  /** Kota */
  city?: string;
  /** Provinsi */
  province?: string;
  /** Kode pos */
  postalCode?: string;
  /** Nomor telepon */
  phone?: string;
  /** Email */
  email?: string;
  /** Nomor Pokok Wajib Pajak (NPWP) */
  npwp?: string;
  /** Logo perusahaan (URL atau data URI) */
  logo?: string;
}

/**
 * Informasi Pembeli
 */
export interface BuyerInfo {
  /** Nama perusahaan atau individu pembeli */
  name: string;
  /** Alamat lengkap */
  address: string;
  /** Kota */
  city?: string;
  /** Provinsi */
  province?: string;
  /** Kode pos */
  postalCode?: string;
  /** Nomor telepon */
  phone?: string;
  /** Email */
  email?: string;
  /** Nomor Pokok Wajib Pajak (NPWP) - wajib untuk faktur pajak */
  npwp?: string;
  /** Nomor Induk Kependudukan (NIK) - untuk orang pribadi jika tidak ada NPWP */
  nik?: string;
}

/**
 * Informasi Pembayaran
 */
export interface PaymentInfo {
  /** Metode pembayaran yang diterima */
  methods?: string[];
  /** Informasi rekening bank */
  bankAccounts?: Array<{
    bankName: string;
    accountNumber: string;
    accountName: string;
  }>;
  /** Catatan tambahan tentang pembayaran */
  notes?: string;
}

/**
 * Data Invoice Standar
 */
export interface InvoiceData {
  /** Nomor invoice (unik) */
  invoiceNumber: string;
  /** Tanggal invoice */
  invoiceDate: Date;
  /** Tanggal jatuh tempo pembayaran */
  dueDate?: Date;
  /** Informasi penjual */
  seller: SellerInfo;
  /** Informasi pembeli */
  buyer: BuyerInfo;
  /** Daftar item barang/jasa */
  items: InvoiceItem[];
  /** Diskon global (dalam Rupiah atau persentase) */
  discount?: number;
  /** Apakah diskon global dalam bentuk persentase? */
  discountIsPercentage?: boolean;
  /** PPN rate (default 11%, set 0 jika tidak dikenakan PPN) */
  ppnRate?: number;
  /** Apakah PPN dikenakan? (default: true jika ppnRate > 0) */
  includePPN?: boolean;
  /** Informasi pembayaran */
  paymentInfo?: PaymentInfo;
  /** Catatan tambahan */
  notes?: string;
  /** Biaya tambahan lainnya (opsional) */
  additionalFees?: Array<{
    name: string;
    amount: number;
  }>;
}

/**
 * Data Faktur Pajak (extend InvoiceData)
 */
export interface TaxInvoiceData extends InvoiceData {
  /** Kode dan Nomor Seri Faktur Pajak (NSFP) - 17 digit */
  nsfp?: string;
  /** Uang muka yang telah diterima (jika ada) */
  downPayment?: number;
  /** Pajak Penjualan atas Barang Mewah (PPnBM) */
  ppnbm?: number;
  /** Tarif PPnBM (jika ada) */
  ppnbmRate?: number;
  /** Kode barang/jasa sesuai e-Faktur (opsional) */
  itemCodes?: string[];
}

/**
 * Opsi untuk generate invoice
 */
export interface InvoiceOptions {
  /** Format export yang diinginkan */
  format?: 'html' | 'pdf' | 'png' | 'svg';
  /** Custom CSS untuk styling invoice */
  customCSS?: string;
  /** Template style (default, modern, minimal) */
  templateStyle?: 'default' | 'modern' | 'minimal';
  /** Bahasa (default: 'id' untuk Indonesia) */
  language?: 'id' | 'en';
  /** Apakah show terbilang? (default: true) */
  showTerbilang?: boolean;
  /** Apakah show logo? (default: true jika logo ada) */
  showLogo?: boolean;
  /** Page size untuk PDF (default: 'a4') */
  pageSize?: 'a4' | 'letter';
  /** Orientation untuk PDF (default: 'portrait') */
  orientation?: 'portrait' | 'landscape';
}

