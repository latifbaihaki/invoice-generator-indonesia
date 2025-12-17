# 📄 Invoice Generator Indonesia

Library buat generate invoice dan faktur pajak Indonesia yang sesuai standar perpajakan. Cocok buat developer yang butuh bikin invoice profesional tanpa ribet.

## 📑 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Instalasi](#-instalasi)
- [Quick Start](#-quick-start)
- [Dokumentasi Lengkap](#-dokumentasi-lengkap)
- [Contoh Penggunaan](#-contoh-penggunaan)
- [Format Indonesia](#-format-indonesia)
- [Customization](#-customization)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

Lihat juga contoh penggunaan di folder `examples/` untuk referensi lebih lengkap.

---

## ✨ Fitur Utama

Yang bisa kamu lakukan dengan library ini:

- **📋 Invoice Standar** - Bikin invoice profesional lengkap dengan semua elemen penting
- **🧾 Faktur Pajak** - Generate faktur pajak sesuai regulasi dengan NSFP, DPP, dan PPN
- **💰 Terbilang Rupiah** - Otomatis convert angka jadi terbilang (contoh: 11.433.000 jadi "Sebelas Juta Empat Ratus Tiga Puluh Tiga Ribu Rupiah")
- **🇮🇩 Format Indonesia** - Format Rupiah, tanggal, dan NPWP sesuai standar Indonesia
- **🧮 Kalkulasi Otomatis** - Hitung PPN 11%, diskon, DPP, dan total otomatis, gak perlu hitung manual
- **📤 Multiple Export** - Export ke PDF, HTML, PNG, atau SVG
- **💻 TypeScript Support** - Full type definitions, jadi lebih enak pas coding
- **🌐 Browser & Node.js** - Bisa dipake di browser atau Node.js (untuk export butuh browser)

---

## 📦 Instalasi

Pastikan Node.js udah terinstall (versi 16 ke atas lebih bagus).

Install pake npm:

```bash
npm install invoice-generator-indonesia
```

Atau kalo pake yarn:

```bash
yarn add invoice-generator-indonesia
```

---

## 🚀 Quick Start

### Bikin Invoice Standar

Ini contoh sederhana buat bikin invoice:

```javascript
import { InvoiceGenerator } from 'invoice-generator-indonesia';

const generator = new InvoiceGenerator();

const invoiceData = {
  invoiceNumber: 'INV-2024-001',
  invoiceDate: new Date(),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari dari sekarang
  seller: {
    name: 'PT Contoh Sukses',
    address: 'Jl. Merdeka No. 123',
    city: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    postalCode: '10110',
    phone: '021-12345678',
    email: 'info@contohsukses.co.id',
    npwp: '012345678901000'
  },
  buyer: {
    name: 'CV Maju Jaya',
    address: 'Jl. Sejahtera No. 45',
    city: 'Bandung',
    province: 'Jawa Barat',
    postalCode: '40111',
    phone: '022-87654321',
    email: 'contact@majujaya.co.id'
  },
  items: [
    {
      name: 'Laptop XYZ Pro',
      quantity: 2,
      unitPrice: 10000000,
      unit: 'unit'
    },
    {
      name: 'Mouse Wireless',
      quantity: 5,
      unitPrice: 150000,
      unit: 'pcs'
    }
  ],
  discount: 500000,
  discountIsPercentage: false,
  ppnRate: 11,
  includePPN: true,
  paymentInfo: {
    methods: ['Transfer Bank'],
    bankAccounts: [
      {
        bankName: 'Bank ABC',
        accountNumber: '123-456-7890',
        accountName: 'PT Contoh Sukses'
      }
    ]
  }
};

// Generate HTML invoice
const html = await generator.generate(invoiceData);

// Export jadi PDF (cuma bisa di browser)
await generator.exportAsPDF(html, 'invoice.pdf');
```

### Bikin Faktur Pajak

Kalo butuh faktur pajak, pake method `generateTaxInvoice()`:

```javascript
const taxInvoiceData = {
  invoiceNumber: 'FP-2024-001',
  invoiceDate: new Date(),
  nsfp: '010.000-24.0000001', // Kode dan Nomor Seri Faktur Pajak (17 digit)
  seller: {
    name: 'PT ABC Technology',
    address: 'Jl. Gatot Subroto No. 40A',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    npwp: '012345678901000' // Wajib untuk faktur pajak
  },
  buyer: {
    name: 'PT XYZ Corporation',
    address: 'Jl. Kuda Laut No. 1',
    city: 'Batam',
    province: 'Kepulauan Riau',
    npwp: '023456789012000' // Wajib untuk faktur pajak
  },
  items: [
    {
      name: 'Komputer Desktop Pro',
      quantity: 3,
      unitPrice: 5000000
    }
  ],
  discount: 1000000,
  downPayment: 2000000, // Uang muka yang udah diterima
  ppnRate: 11 // PPN wajib 11% untuk faktur pajak
};

// Generate faktur pajak
const html = await generator.generateTaxInvoice(taxInvoiceData);

// Export jadi PDF
await generator.exportAsPDF(html, 'faktur-pajak.pdf');
```

---

## 📖 Dokumentasi Lengkap

### Invoice Standar

Invoice standar yang dihasilkan punya elemen-elemen berikut:

1. **Header "INVOICE"** - Header utama
2. **Nomor Invoice** - Nomor unik buat setiap invoice
3. **Tanggal Invoice dan Jatuh Tempo** - Tanggal bikin dan deadline pembayaran
4. **Identitas Penjual** - Nama, alamat lengkap, telepon, email, dan NPWP
5. **Identitas Pembeli** - Nama, alamat lengkap, telepon, email, dan NPWP (opsional)
6. **Tabel Item** - Daftar barang/jasa dengan kolom: No, Deskripsi, Qty, Harga Satuan, dan Total
7. **Subtotal** - Total sebelum diskon dan pajak
8. **Diskon** - Diskon global (opsional, bisa dalam Rupiah atau persentase)
9. **PPN 11%** - Pajak Pertambahan Nilai (opsional, bisa di-toggle)
10. **Total Keseluruhan** - Total akhir yang harus dibayar
11. **Terbilang** - Total dalam bentuk terbilang Rupiah (contoh: "Dua Puluh Tiga Juta Rupiah")
12. **Instruksi Pembayaran** - Info rekening bank dan metode pembayaran
13. **Catatan Tambahan** - Info tambahan kalo perlu

### Faktur Pajak

Faktur pajak punya semua elemen invoice standar, plus:

1. **Header "FAKTUR PAJAK"** - Header khusus faktur pajak
2. **Kode dan Nomor Seri Faktur Pajak (NSFP)** - 17 digit sesuai format DJP
3. **Informasi PKP** - Pengusaha Kena Pajak (penjual)
4. **DPP (Dasar Pengenaan Pajak)** - Dihitung otomatis: Harga Jual - Potongan Harga - Uang Muka
5. **Uang Muka yang Telah Diterima** - Kalo ada pembayaran uang muka sebelumnya
6. **Potongan Harga** - Diskon yang diberikan
7. **PPN Wajib (11%)** - PPN wajib dikenakan untuk faktur pajak
8. **PPnBM** - Pajak Penjualan atas Barang Mewah (kalo ada)

### API Reference

#### InvoiceGenerator Class

##### Constructor

```typescript
const generator = new InvoiceGenerator();
```

Bikin instance baru dari InvoiceGenerator. Gak perlu parameter apapun.

##### Methods Utama

#### `generate(data, options?)`

Generate invoice standar dalam format HTML.

**Parameter:**
- `data: InvoiceData` - Data invoice lengkap (wajib)
- `options?: InvoiceOptions` - Opsi untuk generate invoice (opsional)

**Return:** `Promise<string>` - HTML string dari invoice

**Contoh:**
```javascript
const html = await generator.generate(invoiceData, {
  showTerbilang: true,
  showLogo: true,
  customCSS: '.invoice-header { color: blue; }'
});
```

#### `generateTaxInvoice(data, options?)`

Generate faktur pajak dalam format HTML.

**Parameter:**
- `data: TaxInvoiceData` - Data faktur pajak lengkap (wajib)
- `options?: InvoiceOptions` - Opsi untuk generate faktur pajak (opsional)

**Return:** `Promise<string>` - HTML string dari faktur pajak

#### `exportAsPDF(htmlString, filename?, options?)`

Export invoice jadi file PDF. **Cuma bisa di browser.**

**Parameter:**
- `htmlString: string` - HTML string dari invoice (hasil dari `generate()` atau `generateTaxInvoice()`)
- `filename?: string` - Nama file (default: 'invoice.pdf')
- `options?: { pageSize?: 'a4' | 'letter', orientation?: 'portrait' | 'landscape' }` - Opsi untuk PDF

**Return:** `Promise<void>`

**Contoh:**
```javascript
await generator.exportAsPDF(html, 'invoice.pdf', {
  pageSize: 'a4',
  orientation: 'portrait'
});
```

#### `exportAsHTML(htmlString, filename?)`

Export invoice jadi file HTML. **Cuma bisa di browser.**

**Parameter:**
- `htmlString: string` - HTML string dari invoice
- `filename?: string` - Nama file (default: 'invoice.html')

**Return:** `void`

#### `exportAsPNG(htmlString, filename?, options?)`

Export invoice jadi file PNG. **Cuma bisa di browser.**

**Parameter:**
- `htmlString: string` - HTML string dari invoice
- `filename?: string` - Nama file (default: 'invoice.png')
- `options?: { scale?: number, quality?: number }` - Opsi untuk export

**Return:** `Promise<void>`

#### `exportAsSVG(htmlString, filename?)`

Export invoice jadi file SVG. **Cuma bisa di browser.**

**Parameter:**
- `htmlString: string` - HTML string dari invoice
- `filename?: string` - Nama file (default: 'invoice.svg')

**Return:** `Promise<void>`

##### Utility Methods

#### `terbilang(amount: number): string`

Convert angka jadi terbilang Rupiah dalam bahasa Indonesia.

**Contoh:**
```javascript
generator.terbilang(11433000);
// Output: "Sebelas Juta Empat Ratus Tiga Puluh Tiga Ribu Rupiah"

generator.terbilang(1000000);
// Output: "Satu Juta Rupiah"
```

#### `formatRupiah(amount: number, includeDecimals?: boolean): string`

Format angka jadi format Rupiah Indonesia standar.

**Parameter:**
- `amount: number` - Jumlah uang dalam Rupiah
- `includeDecimals?: boolean` - Include desimal? (default: false)

**Contoh:**
```javascript
generator.formatRupiah(1000000);
// Output: "Rp 1.000.000"

generator.formatRupiah(1234567.89, true);
// Output: "Rp 1.234.567,89"
```

#### `formatTanggal(date: Date, format?: 'long' | 'short' | 'medium'): string`

Format tanggal jadi format Indonesia.

**Parameter:**
- `date: Date` - Date object
- `format?: 'long' | 'short' | 'medium'` - Format yang diinginkan (default: 'long')

**Contoh:**
```javascript
const tanggal = new Date(2024, 11, 17); // 17 Desember 2024

generator.formatTanggal(tanggal, 'long');
// Output: "17 Desember 2024"

generator.formatTanggal(tanggal, 'short');
// Output: "17/12/2024"

generator.formatTanggal(tanggal, 'medium');
// Output: "17 Des 2024"
```

#### `formatNPWP(npwp: string): string`

Format NPWP jadi format standar Indonesia (XX.XXX.XXX.X-XXX.XXX).

**Contoh:**
```javascript
generator.formatNPWP('012345678901000');
// Output: "01.234.567.8-901.000"

generator.formatNPWP('01.234.567.8-901.000');
// Output: "01.234.567.8-901.000" (udah diformat)
```

### Type Definitions

#### InvoiceData

```typescript
interface InvoiceData {
  invoiceNumber: string;           // Wajib - Nomor invoice unik
  invoiceDate: Date;               // Wajib - Tanggal invoice
  dueDate?: Date;                  // Opsional - Tanggal jatuh tempo
  seller: SellerInfo;              // Wajib - Info penjual
  buyer: BuyerInfo;                // Wajib - Info pembeli
  items: InvoiceItem[];            // Wajib - Daftar item barang/jasa
  discount?: number;               // Opsional - Diskon global
  discountIsPercentage?: boolean;  // Opsional - Diskon dalam persentase? (default: false)
  ppnRate?: number;                // Opsional - Tarif PPN (default: 11)
  includePPN?: boolean;            // Opsional - Include PPN? (default: true)
  paymentInfo?: PaymentInfo;       // Opsional - Info pembayaran
  notes?: string;                  // Opsional - Catatan tambahan
  additionalFees?: Array<{         // Opsional - Biaya tambahan
    name: string;
    amount: number;
  }>;
}
```

#### TaxInvoiceData

```typescript
interface TaxInvoiceData extends InvoiceData {
  nsfp?: string;                   // Kode dan Nomor Seri Faktur Pajak (17 digit)
  downPayment?: number;            // Uang muka yang udah diterima
  ppnbm?: number;                  // PPnBM (kalo ada)
  ppnbmRate?: number;              // Tarif PPnBM (kalo ada)
  itemCodes?: string[];            // Kode barang/jasa sesuai e-Faktur
}
```

#### InvoiceItem

```typescript
interface InvoiceItem {
  name: string;                    // Wajib - Nama barang/jasa
  quantity: number;                // Wajib - Kuantitas
  unitPrice: number;               // Wajib - Harga satuan (dalam Rupiah)
  discount?: number;               // Opsional - Diskon per item
  discountIsPercentage?: boolean;  // Opsional - Diskon dalam persentase?
  unit?: string;                   // Opsional - Satuan (pcs, kg, jam, dll)
}
```

#### SellerInfo / BuyerInfo

```typescript
interface SellerInfo {
  name: string;                    // Wajib - Nama perusahaan/individu
  address: string;                 // Wajib - Alamat lengkap
  city?: string;                   // Opsional - Kota
  province?: string;               // Opsional - Provinsi
  postalCode?: string;             // Opsional - Kode pos
  phone?: string;                  // Opsional - Nomor telepon
  email?: string;                  // Opsional - Email
  npwp?: string;                   // Opsional - NPWP (wajib untuk faktur pajak)
  logo?: string;                   // Opsional - URL atau data URI untuk logo
}
```

#### InvoiceOptions

```typescript
interface InvoiceOptions {
  format?: 'html' | 'pdf' | 'png' | 'svg';
  customCSS?: string;              // CSS kustom buat styling
  templateStyle?: 'default' | 'modern' | 'minimal';
  language?: 'id' | 'en';
  showTerbilang?: boolean;         // default: true
  showLogo?: boolean;              // default: true
  pageSize?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}
```

---

## 💻 Contoh Penggunaan

### Node.js

Di Node.js, kamu bisa generate HTML invoice terus simpan atau pake library lain buat convert ke PDF:

```javascript
const { InvoiceGenerator } = require('invoice-generator-indonesia');

const generator = new InvoiceGenerator();

const invoiceData = {
  invoiceNumber: 'INV-2024-001',
  invoiceDate: new Date(),
  seller: {
    name: 'PT Contoh',
    address: 'Jl. Contoh No. 123, Jakarta'
  },
  buyer: {
    name: 'CV Contoh',
    address: 'Jl. Contoh No. 456, Bandung'
  },
  items: [
    {
      name: 'Produk A',
      quantity: 2,
      unitPrice: 1000000
    }
  ]
};

const html = await generator.generate(invoiceData);
// html adalah string HTML, bisa disimpan ke file atau pake puppeteer buat convert ke PDF
```

### React

Contoh pake di React:

```tsx
import React, { useState } from 'react';
import { InvoiceGenerator, InvoiceData } from 'invoice-generator-indonesia';

function InvoiceComponent() {
  const [html, setHtml] = useState<string | null>(null);
  const generator = new InvoiceGenerator();

  const invoiceData: InvoiceData = {
    invoiceNumber: 'INV-2024-001',
    invoiceDate: new Date(),
    seller: {
      name: 'PT Contoh',
      address: 'Jl. Contoh No. 123'
    },
    buyer: {
      name: 'CV Contoh',
      address: 'Jl. Contoh No. 456'
    },
    items: [
      {
        name: 'Produk A',
        quantity: 2,
        unitPrice: 1000000
      }
    ]
  };

  const handleGenerate = async () => {
    const result = await generator.generate(invoiceData);
    setHtml(result);
  };

  const handleExportPDF = async () => {
    if (html) {
      await generator.exportAsPDF(html, 'invoice.pdf');
    }
  };

  return (
    <div>
      <button onClick={handleGenerate}>Generate Invoice</button>
      {html && (
        <>
          <iframe srcDoc={html} style={{ width: '100%', height: '800px' }} />
          <button onClick={handleExportPDF}>Export PDF</button>
        </>
      )}
    </div>
  );
}
```

### Vanilla JavaScript (Browser)

Kalo pake vanilla JavaScript di browser:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Invoice Generator</title>
</head>
<body>
  <button id="generate">Generate Invoice</button>
  <button id="export">Export PDF</button>
  <div id="preview"></div>

  <script type="module">
    import { InvoiceGenerator } from './node_modules/invoice-generator-indonesia/dist/esm/index.js';
    
    const generator = new InvoiceGenerator();
    let currentHTML = '';

    document.getElementById('generate').addEventListener('click', async () => {
      const invoiceData = {
        invoiceNumber: 'INV-2024-001',
        invoiceDate: new Date(),
        seller: {
          name: 'PT Contoh',
          address: 'Jl. Contoh No. 123'
        },
        buyer: {
          name: 'CV Contoh',
          address: 'Jl. Contoh No. 456'
        },
        items: [
          {
            name: 'Produk A',
            quantity: 2,
            unitPrice: 1000000
          }
        ]
      };

      currentHTML = await generator.generate(invoiceData);
      document.getElementById('preview').innerHTML = currentHTML;
    });

    document.getElementById('export').addEventListener('click', async () => {
      if (currentHTML) {
        await generator.exportAsPDF(currentHTML, 'invoice.pdf');
      }
    });
  </script>
</body>
</html>
```

---

## 📝 Format Indonesia

Library ini dirancang khusus buat format Indonesia, jadi semua format udah sesuai standar yang berlaku.

### Format Rupiah

Format Rupiah pake standar Indonesia:
- **Separator ribuan**: titik (.)
- **Separator desimal**: koma (,)
- **Contoh**: Rp 1.000.000,00

### Format Tanggal

Format tanggal Indonesia yang didukung:
- **Long**: "17 Desember 2024" - Format lengkap dengan nama bulan penuh
- **Medium**: "17 Des 2024" - Format dengan nama bulan singkat
- **Short**: "17/12/2024" - Format numerik

### Format NPWP

Format NPWP standar Indonesia: **XX.XXX.XXX.X-XXX.XXX**
- **Contoh**: 01.234.567.8-901.000
- Library bakal otomatis format NPWP yang diinput tanpa format

### Terbilang Rupiah

Library support terbilang buat angka 0 sampai 999 triliun:
- **Contoh**: 11.433.000 → "Sebelas Juta Empat Ratus Tiga Puluh Tiga Ribu Rupiah"
- **Contoh**: 1.000.000 → "Satu Juta Rupiah"
- **Contoh**: 0 → "Nol Rupiah"

### PPN (Pajak Pertambahan Nilai)

- **Default rate**: 11% (tarif terkini di Indonesia)
- Bisa di-customize lewat parameter `ppnRate`
- Bisa di-toggle pake `includePPN` (default: true)

### Faktur Pajak

Buat faktur pajak, pastikan:
1. **NSFP** (Nomor Seri Faktur Pajak) sesuai format DJP (17 digit)
2. **NPWP penjual dan pembeli** wajib diisi
3. **DPP** dihitung otomatis: Harga Jual - Potongan Harga - Uang Muka
4. **PPN wajib** dikenakan (11%)

---

## 🎨 Customization

### Custom CSS

Kamu bisa tambahin custom CSS buat styling invoice sesuai kebutuhan:

```javascript
const html = await generator.generate(invoiceData, {
  customCSS: `
    .invoice-container {
      background-color: #f5f5f5;
      padding: 40px;
    }
    .invoice-header h1 {
      color: #007bff;
      font-size: 36px;
    }
    .items-table th {
      background-color: #007bff;
      color: white;
    }
  `
});
```

### Template Style

Saat ini tersedia template style default. Template style lainnya (modern, minimal) bakal ditambahin di versi selanjutnya.

---

## 🔧 Troubleshooting

### Export tidak berfungsi di Node.js

Export ke PDF/PNG/SVG butuh DOM (Document Object Model), jadi cuma bisa di browser. Buat Node.js, ada beberapa solusi:

- Pake `generate()` buat dapetin HTML string, terus pake library kayak `puppeteer` buat convert ke PDF
- Atau pake service kayak API buat convert HTML ke PDF

### Logo tidak muncul

Kalo logo gak muncul di invoice:
- Pastikan logo URL accessible dan CORS-enabled
- Buat local file, pake data URI atau pastikan file accessible dari browser
- Format yang didukung: URL (http/https) atau data URI (data:image/png;base64,...)

### Format tidak sesuai ekspektasi

Kalo format invoice gak sesuai yang diharapkan:
- Pastikan pake format data yang benar sesuai type definitions
- Cek browser console buat liat error messages
- Pastikan semua required fields terisi dengan benar

### Module tidak ditemukan di browser

Kalo pake ES modules di browser:
- Pastikan path import benar (pake `dist/esm/index.js`)
- Pastikan server HTTP berjalan (gak bisa pake `file://`)
- Pastikan project udah di-build dengan `npm run build`

---

## 🤝 Contributing

Kontribusi sangat diterima! Kalo kamu mau berkontribusi:

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan kamu (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

---

## 📝 License

Library ini pake **MIT License**, jadi kamu bebas pake library ini buat project personal maupun komersial.

---

## 🙏 Acknowledgments

Library ini dibuat dengan menggunakan:
- [jsPDF](https://www.npmjs.com/package/jspdf) - Buat generate PDF
- [html2canvas](https://www.npmjs.com/package/html2canvas) - Buat convert HTML ke image

---

## 📞 Support

Kalo ada pertanyaan, masalah, atau saran, silakan buat issue di repository ini. Kita bakal bantu dengan senang hati!

---

**Dibuat dengan ❤️ untuk komunitas developer Indonesia. Happy coding! 🚀**
