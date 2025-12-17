import { InvoiceData, TaxInvoiceData, InvoiceOptions } from './types';
import { formatRupiah, formatTanggal, formatNPWP } from './formatters';
import { terbilangRupiah } from './terbilang';
import { calculateInvoiceTotals, calculateTaxInvoiceTotals } from './calculator';

/**
 * Generate CSS styles untuk invoice
 */
function getInvoiceStyles(options?: InvoiceOptions): string {
  const style = options?.templateStyle || 'default';

  const baseStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 20px;
    }
    
    .invoice-container {
      max-width: 210mm;
      margin: 0 auto;
      background: #fff;
      padding: 30px;
    }
    
    .invoice-header {
      border-bottom: 3px solid #333;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .invoice-header h1 {
      font-size: 32px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
    
    .invoice-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      gap: 30px;
    }
    
    .seller-info, .buyer-info {
      flex: 1;
    }
    
    .info-section h3 {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #333;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    
    .info-section p {
      margin: 5px 0;
      font-size: 12px;
    }
    
    .invoice-details {
      margin-bottom: 30px;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .detail-label {
      font-weight: bold;
      width: 150px;
    }
    
    .detail-value {
      flex: 1;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    
    .items-table th {
      background-color: #333;
      color: #fff;
      padding: 12px;
      text-align: left;
      font-weight: bold;
      font-size: 12px;
    }
    
    .items-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #ddd;
      font-size: 12px;
    }
    
    .items-table tr:last-child td {
      border-bottom: none;
    }
    
    .items-table .text-right {
      text-align: right;
    }
    
    .items-table .text-center {
      text-align: center;
    }
    
    .summary-section {
      margin-top: 30px;
      margin-bottom: 30px;
    }
    
    .summary-table {
      width: 100%;
      max-width: 400px;
      margin-left: auto;
      border-collapse: collapse;
    }
    
    .summary-table td {
      padding: 8px 12px;
      font-size: 12px;
    }
    
    .summary-table .label {
      text-align: right;
      font-weight: bold;
      padding-right: 20px;
    }
    
    .summary-table .value {
      text-align: right;
      font-weight: bold;
    }
    
    .summary-table .total-row {
      border-top: 2px solid #333;
      border-bottom: 2px solid #333;
    }
    
    .summary-table .total-row .label,
    .summary-table .total-row .value {
      font-size: 14px;
      font-weight: bold;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    
    .terbilang {
      margin-top: 20px;
      padding: 15px;
      background-color: #f5f5f5;
      border-left: 4px solid #333;
      font-style: italic;
      font-size: 12px;
    }
    
    .terbilang strong {
      font-style: normal;
    }
    
    .payment-info {
      margin-top: 30px;
      padding: 15px;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
    }
    
    .payment-info h3 {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #333;
    }
    
    .payment-info p {
      margin: 5px 0;
      font-size: 12px;
    }
    
    .notes {
      margin-top: 30px;
      padding: 15px;
      border-top: 1px solid #ddd;
    }
    
    .notes h3 {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #333;
    }
    
    .notes p {
      font-size: 12px;
      white-space: pre-line;
    }
    
    .logo {
      max-width: 150px;
      max-height: 80px;
      margin-bottom: 20px;
    }
    
    @media print {
      body {
        padding: 0;
      }
      
      .invoice-container {
        padding: 20px;
      }
    }
  `;

  return baseStyles;
}

/**
 * Generate HTML untuk info penjual/pembeli
 */
function generateInfoSection(info: any, title: string, showLogo: boolean = false): string {
  let html = `
    <div class="info-section ${title.toLowerCase().replace(' ', '-')}">
      <h3>${title}</h3>
  `;

  if (showLogo && info.logo) {
    html += `<img src="${info.logo}" alt="Logo" class="logo" />`;
  }

  html += `<p><strong>${info.name}</strong></p>`;

  if (info.address) {
    let address = info.address;
    if (info.city) address += `, ${info.city}`;
    if (info.province) address += `, ${info.province}`;
    if (info.postalCode) address += ` ${info.postalCode}`;
    html += `<p>${address}</p>`;
  }

  if (info.phone) {
    html += `<p>Telp: ${info.phone}</p>`;
  }

  if (info.email) {
    html += `<p>Email: ${info.email}</p>`;
  }

  if (info.npwp) {
    html += `<p>NPWP: ${formatNPWP(info.npwp)}</p>`;
  }

  if (info.nik) {
    html += `<p>NIK: ${info.nik}</p>`;
  }

  html += `</div>`;

  return html;
}

/**
 * Generate HTML untuk tabel items
 */
function generateItemsTable(items: any[]): string {
  let html = `
    <table class="items-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Deskripsi Barang/Jasa</th>
          <th class="text-center">Qty</th>
          <th class="text-right">Harga Satuan</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
  `;

  items.forEach((item, index) => {
    let itemTotal = item.quantity * item.unitPrice;

    // Apply diskon per item jika ada
    if (item.discount !== undefined && item.discount > 0) {
      if (item.discountIsPercentage) {
        itemTotal = itemTotal * (1 - item.discount / 100);
      } else {
        itemTotal = itemTotal - item.discount;
      }
    }

    const unitDisplay = item.unit ? ` ${item.unit}` : '';

    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td class="text-center">${item.quantity}${unitDisplay}</td>
        <td class="text-right">${formatRupiah(item.unitPrice)}</td>
        <td class="text-right">${formatRupiah(itemTotal)}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  return html;
}

/**
 * Generate HTML untuk invoice standar
 */
export function generateInvoiceHTML(data: InvoiceData, options?: InvoiceOptions): string {
  const totals = calculateInvoiceTotals(data);
  const showTerbilang = options?.showTerbilang !== false;
  const showLogo = !!(options?.showLogo !== false && data.seller.logo);

  let html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${data.invoiceNumber}</title>
      <style>
        ${getInvoiceStyles(options)}
        ${options?.customCSS || ''}
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <h1>INVOICE</h1>
        </div>
        
        <div class="invoice-details">
          <div class="detail-row">
            <div class="detail-label">Nomor Invoice:</div>
            <div class="detail-value">${data.invoiceNumber}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Tanggal:</div>
            <div class="detail-value">${formatTanggal(data.invoiceDate)}</div>
          </div>
          ${data.dueDate ? `
          <div class="detail-row">
            <div class="detail-label">Jatuh Tempo:</div>
            <div class="detail-value">${formatTanggal(data.dueDate)}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="invoice-info">
          ${generateInfoSection(data.seller, 'Penjual', showLogo)}
          ${generateInfoSection(data.buyer, 'Pembeli')}
        </div>
        
        ${generateItemsTable(data.items)}
        
        <div class="summary-section">
          <table class="summary-table">
            <tr>
              <td class="label">Subtotal:</td>
              <td class="value">${formatRupiah(totals.subtotal)}</td>
            </tr>
            ${totals.discount > 0 ? `
            <tr>
              <td class="label">Diskon:</td>
              <td class="value">-${formatRupiah(totals.discount)}</td>
            </tr>
            ` : ''}
            ${data.additionalFees && data.additionalFees.length > 0 ? data.additionalFees.map(fee => `
            <tr>
              <td class="label">${fee.name}:</td>
              <td class="value">${formatRupiah(fee.amount)}</td>
            </tr>
            `).join('') : ''}
            ${totals.ppn > 0 ? `
            <tr>
              <td class="label">PPN (${data.ppnRate || 11}%):</td>
              <td class="value">${formatRupiah(totals.ppn)}</td>
            </tr>
            ` : ''}
            <tr class="total-row">
              <td class="label">Total:</td>
              <td class="value">${formatRupiah(totals.total)}</td>
            </tr>
          </table>
        </div>
        
        ${showTerbilang ? `
        <div class="terbilang">
          <strong>Terbilang:</strong> ${terbilangRupiah(totals.total)}
        </div>
        ` : ''}
        
        ${data.paymentInfo ? `
        <div class="payment-info">
          <h3>Instruksi Pembayaran</h3>
          ${data.paymentInfo.methods && data.paymentInfo.methods.length > 0 ? `
          <p><strong>Metode Pembayaran:</strong> ${data.paymentInfo.methods.join(', ')}</p>
          ` : ''}
          ${data.paymentInfo.bankAccounts && data.paymentInfo.bankAccounts.length > 0 ? data.paymentInfo.bankAccounts.map(account => `
          <p><strong>${account.bankName}:</strong> ${account.accountNumber} (a/n ${account.accountName})</p>
          `).join('') : ''}
          ${data.paymentInfo.notes ? `<p>${data.paymentInfo.notes}</p>` : ''}
        </div>
        ` : ''}
        
        ${data.notes ? `
        <div class="notes">
          <h3>Catatan</h3>
          <p>${data.notes}</p>
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Generate HTML untuk faktur pajak
 */
export function generateTaxInvoiceHTML(data: TaxInvoiceData, options?: InvoiceOptions): string {
  const totals = calculateTaxInvoiceTotals(data);
  const showTerbilang = options?.showTerbilang !== false;
  const showLogo = !!(options?.showLogo !== false && data.seller.logo);

  let html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Faktur Pajak ${data.nsfp || data.invoiceNumber}</title>
      <style>
        ${getInvoiceStyles(options)}
        ${options?.customCSS || ''}
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <h1>FAKTUR PAJAK</h1>
          ${data.nsfp ? `
          <div class="detail-row" style="margin-top: 10px;">
            <div class="detail-label">Kode dan Nomor Seri Faktur Pajak:</div>
            <div class="detail-value"><strong>${data.nsfp}</strong></div>
          </div>
          ` : ''}
        </div>
        
        <div class="invoice-details">
          <div class="detail-row">
            <div class="detail-label">Tanggal Faktur:</div>
            <div class="detail-value">${formatTanggal(data.invoiceDate)}</div>
          </div>
        </div>
        
        <div class="invoice-info">
          ${generateInfoSection(data.seller, 'Pengusaha Kena Pajak (PKP)', showLogo)}
          ${generateInfoSection(data.buyer, 'Pembeli Barang Kena Pajak / Penerima Jasa Kena Pajak')}
        </div>
        
        ${generateItemsTable(data.items)}
        
        <div class="summary-section">
          <table class="summary-table">
            <tr>
              <td class="label">Harga Jual/Penggantian:</td>
              <td class="value">${formatRupiah(totals.subtotal)}</td>
            </tr>
            ${totals.discount > 0 ? `
            <tr>
              <td class="label">Dikurangi Potongan Harga:</td>
              <td class="value">${formatRupiah(totals.discount)}</td>
            </tr>
            ` : ''}
            ${totals.downPayment > 0 ? `
            <tr>
              <td class="label">Dikurangi Uang Muka:</td>
              <td class="value">${formatRupiah(totals.downPayment)}</td>
            </tr>
            ` : ''}
            <tr>
              <td class="label"><strong>Dasar Pengenaan Pajak (DPP):</strong></td>
              <td class="value"><strong>${formatRupiah(totals.dpp)}</strong></td>
            </tr>
            <tr>
              <td class="label">PPN (${data.ppnRate || 11}%):</td>
              <td class="value">${formatRupiah(totals.ppn)}</td>
            </tr>
            ${totals.ppnbm > 0 ? `
            <tr>
              <td class="label">PPnBM:</td>
              <td class="value">${formatRupiah(totals.ppnbm)}</td>
            </tr>
            ` : ''}
            <tr class="total-row">
              <td class="label">Total:</td>
              <td class="value">${formatRupiah(totals.total)}</td>
            </tr>
          </table>
        </div>
        
        ${showTerbilang ? `
        <div class="terbilang">
          <strong>Terbilang:</strong> ${terbilangRupiah(totals.total)}
        </div>
        ` : ''}
        
        ${data.paymentInfo ? `
        <div class="payment-info">
          <h3>Instruksi Pembayaran</h3>
          ${data.paymentInfo.methods && data.paymentInfo.methods.length > 0 ? `
          <p><strong>Metode Pembayaran:</strong> ${data.paymentInfo.methods.join(', ')}</p>
          ` : ''}
          ${data.paymentInfo.bankAccounts && data.paymentInfo.bankAccounts.length > 0 ? data.paymentInfo.bankAccounts.map(account => `
          <p><strong>${account.bankName}:</strong> ${account.accountNumber} (a/n ${account.accountName})</p>
          `).join('') : ''}
          ${data.paymentInfo.notes ? `<p>${data.paymentInfo.notes}</p>` : ''}
        </div>
        ` : ''}
        
        <div class="notes" style="margin-top: 30px; font-size: 11px; font-style: italic;">
          <p>Sesuai dengan ketentuan yang berlaku, Direktorat Jenderal Pajak mengatur bahwa Faktur Pajak ini telah ditandatangani secara elektronik sehingga tidak diperlukan tanda tangan basah pada Faktur Pajak ini.</p>
        </div>
        
        ${data.notes ? `
        <div class="notes">
          <h3>Catatan</h3>
          <p>${data.notes}</p>
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;

  return html;
}

