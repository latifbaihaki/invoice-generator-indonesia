/**
 * Export HTML string ke file HTML (browser only)
 * 
 * @param htmlString - HTML string dari invoice
 * @param filename - Nama file untuk export (default: 'invoice.html')
 */
export function exportInvoiceAsHTML(
  htmlString: string,
  filename: string = 'invoice.html'
): void {
  if (typeof document === 'undefined') {
    throw new Error('HTML export is only available in browser environment');
  }

  // Create blob dari HTML string
  const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  // Create download link
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Return HTML string (untuk penggunaan di Node.js atau custom handling)
 * 
 * @param htmlString - HTML string dari invoice
 * @returns HTML string
 */
export function getInvoiceHTML(htmlString: string): string {
  return htmlString;
}

