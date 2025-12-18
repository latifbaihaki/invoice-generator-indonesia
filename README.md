# Invoice Generator Indonesia

📄 Library lengkap untuk generate invoice dan faktur pajak Indonesia yang sesuai dengan standar dan regulasi perpajakan Indonesia. Support invoice standar dan faktur pajak formal, dengan fitur terbilang Rupiah, format tanggal Indonesia, kalkulasi PPN 11%, dan multiple export format (PDF, HTML, PNG, SVG).

## ✨ Fitur Utama

- **Invoice Standar** - Generate invoice profesional dengan semua elemen wajib
- **Faktur Pajak** - Generate faktur pajak sesuai regulasi perpajakan Indonesia
- **Terbilang Rupiah** - Otomatis generate terbilang dalam bahasa Indonesia
- **Format Indonesia** - Format Rupiah, tanggal, dan NPWP sesuai standar Indonesia
- **Kalkulasi Otomatis** - Hitung PPN 11%, diskon, DPP, dan total secara otomatis
- **Multiple Export** - Export ke PDF, HTML, PNG, dan SVG
- **TypeScript Support** - Full type definitions untuk better development experience
- **Browser & Node.js** - Works di browser dan Node.js (dengan DOM)

## 📦 Installation

Installation via package managers (npm, pip, or others) may be added in the future. For now, please clone this repository and use it directly from the source code.

## 🚀 Quick Start

### Invoice Standar

```javascript
import { InvoiceGenerator } from 'invoice-generator-indonesia';

const generator = new InvoiceGenerator();

const invoiceData = {
  invoiceNumber: 'INV-2024-001',
  invoiceDate: new Date(),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
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

// Generate HTML
const html = await generator.generate(invoiceData);

// Export sebagai PDF (browser only)
await generator.exportAsPDF(html, 'invoice.pdf');
```

### Faktur Pajak

```javascript
const taxInvoiceData = {
  invoiceNumber: 'FP-2024-001',
  invoiceDate: new Date(),
  nsfp: '010.000-24.0000001', // Kode dan Nomor Seri Faktur Pajak
  seller: {
    name: 'PT ABC Technology',
    address: 'Jl. Gatot Subroto No. 40A',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    npwp: '012345678901000'
  },
  buyer: {
    name: 'PT XYZ Corporation',
    address: 'Jl. Kuda Laut No. 1',
    city: 'Batam',
    province: 'Kepulauan Riau',
    npwp: '023456789012000'
  },
  items: [
    {
      name: 'Komputer Desktop Pro',
      quantity: 3,
      unitPrice: 5000000
    }
  ],
  discount: 1000000,
  downPayment: 2000000,
  ppnRate: 11
};

// Generate faktur pajak
const html = await generator.generateTaxInvoice(taxInvoiceData);

// Export sebagai PDF
await generator.exportAsPDF(html, 'faktur-pajak.pdf');
```

## 📖 Dokumentasi Lengkap

### Invoice Standar

Invoice standar mencakup elemen-elemen berikut:

1. **Header "INVOICE"**
2. **Nomor invoice** - Nomor unik untuk setiap invoice
3. **Tanggal invoice dan jatuh tempo** - Tanggal penerbitan dan batas waktu pembayaran
4. **Identitas penjual** - Nama, alamat, telepon, email, NPWP
5. **Identitas pembeli** - Nama, alamat, telepon, email, NPWP (opsional)
6. **Tabel item** - Daftar barang/jasa dengan kuantitas, harga satuan, dan total
7. **Subtotal** - Total sebelum diskon dan pajak
8. **Diskon** - Diskon global (opsional, bisa dalam Rupiah atau persentase)
9. **PPN 11%** - Pajak Pertambahan Nilai (opsional, bisa di-toggle)
10. **Total keseluruhan** - Total yang harus dibayar
11. **Terbilang** - Total dalam bentuk terbilang Rupiah
12. **Instruksi pembayaran** - Informasi rekening bank dan metode pembayaran
13. **Catatan tambahan** - Informasi tambahan jika diperlukan

### Faktur Pajak

Faktur pajak mencakup semua elemen invoice standar, plus:

1. **Header "FAKTUR PAJAK"**
2. **Kode dan Nomor Seri Faktur Pajak (NSFP)** - 17 digit sesuai format DJP
3. **Informasi PKP** - Pengusaha Kena Pajak
4. **DPP (Dasar Pengenaan Pajak)** - Dihitung otomatis
5. **Uang muka yang telah diterima** - Jika ada
6. **Potongan harga** - Diskon yang diberikan
7. **PPN wajib (11%)** - Wajib untuk faktur pajak
8. **PPnBM** - Pajak Penjualan atas Barang Mewah (jika ada)

### API Reference

#### InvoiceGenerator Class

##### Constructor

```typescript
const generator = new InvoiceGenerator();
```

##### Methods

#### `generate(data, options?)`

Generate invoice standar dalam format HTML.

**Parameters:**
- `data: InvoiceData` - Data invoice lengkap
- `options?: InvoiceOptions` - Opsi untuk generate invoice

**Returns:** `Promise<string>` - HTML string dari invoice

**Example:**
```javascript
const html = await generator.generate(invoiceData, {
  format: 'html',
  showTerbilang: true,
  showLogo: true
});
```

#### `generateTaxInvoice(data, options?)`

Generate faktur pajak dalam format HTML.

**Parameters:**
- `data: TaxInvoiceData` - Data faktur pajak lengkap
- `options?: InvoiceOptions` - Opsi untuk generate faktur pajak

**Returns:** `Promise<string>` - HTML string dari faktur pajak

#### `exportAsPDF(htmlString, filename?, options?)`

Export invoice sebagai PDF (browser only).

**Parameters:**
- `htmlString: string` - HTML string dari invoice
- `filename?: string` - Nama file (default: 'invoice.pdf')
- `options?: { pageSize?: 'a4' | 'letter', orientation?: 'portrait' | 'landscape' }`

**Returns:** `Promise<void>`

**Example:**
```javascript
await generator.exportAsPDF(html, 'invoice.pdf', {
  pageSize: 'a4',
  orientation: 'portrait'
});
```

#### `exportAsHTML(htmlString, filename?)`

Export invoice sebagai HTML file (browser only).

**Parameters:**
- `htmlString: string` - HTML string dari invoice
- `filename?: string` - Nama file (default: 'invoice.html')

#### `exportAsPNG(htmlString, filename?, options?)`

Export invoice sebagai PNG (browser only).

**Parameters:**
- `htmlString: string` - HTML string dari invoice
- `filename?: string` - Nama file (default: 'invoice.png')
- `options?: { scale?: number, quality?: number }`

#### `exportAsSVG(htmlString, filename?)`

Export invoice sebagai SVG (browser only).

**Parameters:**
- `htmlString: string` - HTML string dari invoice
- `filename?: string` - Nama file (default: 'invoice.svg')

#### Utility Methods

#### `terbilang(amount: number): string`

Convert angka ke terbilang Rupiah.

**Example:**
```javascript
generator.terbilang(11433000);
// "Sebelas Juta Empat Ratus Tiga Puluh Tiga Ribu Rupiah"
```

#### `formatRupiah(amount: number, includeDecimals?: boolean): string`

Format angka ke format Rupiah Indonesia.

**Example:**
```javascript
generator.formatRupiah(1000000); // "Rp 1.000.000"
generator.formatRupiah(1000000, true); // "Rp 1.000.000,00"
```

#### `formatTanggal(date: Date, format?: 'long' | 'short' | 'medium'): string`

Format tanggal ke format Indonesia.

**Example:**
```javascript
generator.formatTanggal(new Date(2024, 11, 17), 'long'); // "17 Desember 2024"
generator.formatTanggal(new Date(2024, 11, 17), 'short'); // "17/12/2024"
generator.formatTanggal(new Date(2024, 11, 17), 'medium'); // "17 Des 2024"
```

#### `formatNPWP(npwp: string): string`

Format NPWP ke format standar Indonesia.

**Example:**
```javascript
generator.formatNPWP('012345678901000'); // "01.234.567.8-901.000"
```

### Type Definitions

#### InvoiceData

```typescript
interface InvoiceData {
  invoiceNumber: string;           // Required
  invoiceDate: Date;               // Required
  dueDate?: Date;                  // Optional
  seller: SellerInfo;              // Required
  buyer: BuyerInfo;                // Required
  items: InvoiceItem[];            // Required
  discount?: number;               // Optional
  discountIsPercentage?: boolean;  // Optional (default: false)
  ppnRate?: number;                // Optional (default: 11)
  includePPN?: boolean;            // Optional (default: true)
  paymentInfo?: PaymentInfo;       // Optional
  notes?: string;                  // Optional
  additionalFees?: Array<{         // Optional
    name: string;
    amount: number;
  }>;
}
```

#### TaxInvoiceData

```typescript
interface TaxInvoiceData extends InvoiceData {
  nsfp?: string;                   // Kode dan Nomor Seri Faktur Pajak
  downPayment?: number;            // Uang muka yang telah diterima
  ppnbm?: number;                  // PPnBM (jika ada)
  ppnbmRate?: number;              // Tarif PPnBM (jika ada)
  itemCodes?: string[];            // Kode barang/jasa sesuai e-Faktur
}
```

#### InvoiceItem

```typescript
interface InvoiceItem {
  name: string;                    // Required
  quantity: number;                // Required
  unitPrice: number;               // Required
  discount?: number;               // Optional
  discountIsPercentage?: boolean;  // Optional
  unit?: string;                   // Optional (pcs, kg, jam, dll)
}
```

#### SellerInfo / BuyerInfo

```typescript
interface SellerInfo {
  name: string;                    // Required
  address: string;                 // Required
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  npwp?: string;                   // Required untuk faktur pajak
  logo?: string;                   // URL atau data URI
}
```

#### InvoiceOptions

```typescript
interface InvoiceOptions {
  format?: 'html' | 'pdf' | 'png' | 'svg';
  customCSS?: string;
  templateStyle?: 'default' | 'modern' | 'minimal';
  language?: 'id' | 'en';
  showTerbilang?: boolean;         // default: true
  showLogo?: boolean;              // default: true
  pageSize?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}
```

## 💻 Usage Examples

### Node.js

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
// html adalah string HTML, bisa disimpan atau digunakan sesuai kebutuhan
```

### React

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

## 🎨 Customization

### Custom CSS

Anda bisa menambahkan custom CSS untuk styling invoice:

```javascript
const html = await generator.generate(invoiceData, {
  customCSS: `
    .invoice-container {
      background-color: #f5f5f5;
    }
    .invoice-header h1 {
      color: #007bff;
    }
  `
});
```

### Template Style

Saat ini tersedia template style default. Template style lainnya (modern, minimal) bisa ditambahkan di versi selanjutnya.

## 📝 Format Invoice Indonesia

### Format Rupiah

Library ini menggunakan format Rupiah Indonesia standar:
- Separator ribuan: titik (.)
- Separator desimal: koma (,)
- Contoh: Rp 1.000.000,00

### Format Tanggal

Format tanggal Indonesia yang didukung:
- **Long**: "17 Desember 2024"
- **Medium**: "17 Des 2024"
- **Short**: "17/12/2024"

### Format NPWP

Format NPWP standar: XX.XXX.XXX.X-XXX.XXX
- Contoh: 01.234.567.8-901.000

### Terbilang Rupiah

Library mendukung terbilang untuk angka 0 hingga 999 triliun:
- Contoh: 11433000 → "Sebelas Juta Empat Ratus Tiga Puluh Tiga Ribu Rupiah"

### PPN (Pajak Pertambahan Nilai)

- Default rate: 11% (tarif terkini di Indonesia)
- Bisa di-customize melalui `ppnRate`
- Bisa di-toggle menggunakan `includePPN`

### Faktur Pajak

Untuk faktur pajak, pastikan:
1. NSFP (Nomor Seri Faktur Pajak) sesuai format DJP (17 digit)
2. NPWP penjual dan pembeli wajib diisi
3. DPP dihitung otomatis: Harga Jual - Potongan Harga - Uang Muka
4. PPN wajib dikenakan (11%)

## 🔧 Troubleshooting

### Export tidak berfungsi di Node.js

Export ke PDF/PNG/SVG memerlukan DOM (Document Object Model), jadi hanya berfungsi di browser. Untuk Node.js:
- Gunakan `generate()` untuk mendapatkan HTML string, lalu gunakan library seperti `puppeteer` untuk convert ke PDF
- Atau gunakan service seperti API untuk convert HTML ke PDF

### Logo tidak muncul

- Pastikan logo URL accessible dan CORS-enabled
- Untuk local file, gunakan data URI atau pastikan file accessible

### Format tidak sesuai ekspektasi

- Pastikan menggunakan format data yang benar sesuai type definitions
- Check console untuk error messages
- Pastikan semua required fields terisi

## 📚 Examples

Lihat folder `examples/` untuk contoh penggunaan lengkap:
- `examples/basic-invoice/` - Contoh invoice standar
- `examples/tax-invoice/` - Contoh faktur pajak

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use this library in personal or commercial projects.

## 🙏 Acknowledgments

Built with:
- [jsPDF](https://www.npmjs.com/package/jspdf) - PDF generation
- [html2canvas](https://www.npmjs.com/package/html2canvas) - HTML to image conversion

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

Made with ❤️ for the Indonesian developer community. Happy coding!

