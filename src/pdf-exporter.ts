import { jsPDF } from 'jspdf';

/**
 * Download file dari blob (browser only)
 */
function downloadBlob(blob: Blob, filename: string): void {
  if (typeof document === 'undefined') {
    throw new Error('Download functionality is only available in browser environment');
  }

  const url = URL.createObjectURL(blob);
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
 * Export HTML ke PDF menggunakan jsPDF
 * 
 * @param htmlString - HTML string dari invoice
 * @param filename - Nama file untuk export (default: 'invoice.pdf')
 * @param options - Opsi untuk PDF (pageSize, orientation)
 */
export async function exportInvoiceAsPDF(
  htmlString: string,
  filename: string = 'invoice.pdf',
  options?: {
    pageSize?: 'a4' | 'letter';
    orientation?: 'portrait' | 'landscape';
  }
): Promise<void> {
  if (typeof document === 'undefined') {
    throw new Error('PDF export is only available in browser environment');
  }

  const pageSize = options?.pageSize || 'a4';
  const orientation = options?.orientation || 'portrait';
  
  // Buat temporary container untuk HTML
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = pageSize === 'a4' ? '210mm' : '8.5in';
  tempDiv.innerHTML = htmlString;
  document.body.appendChild(tempDiv);
  
  try {
    // Initialize jsPDF
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageSize
    });
    
    // Get HTML content dimensions
    const htmlElement = tempDiv.querySelector('.invoice-container') || tempDiv;
    const width = htmlElement.clientWidth || (pageSize === 'a4' ? 210 : 216);
    const height = htmlElement.scrollHeight || 297;
    
    // Convert HTML to canvas using html2canvas (will be loaded dynamically)
    // For now, we'll use a simpler approach: convert HTML to image
    
    // Note: For better PDF generation with HTML, you might want to use html2pdf.js
    // or puppeteer for server-side. For browser, we'll use html2canvas
    
    // Import html2canvas dynamically
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: width,
      height: height,
      windowWidth: width,
      windowHeight: height
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions for PDF
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgWidthFinal = imgWidth * ratio;
    const imgHeightFinal = imgHeight * ratio;
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidthFinal, imgHeightFinal);
    
    // If content is taller than one page, add additional pages
    const totalPages = Math.ceil(imgHeightFinal / pdfHeight);
    if (totalPages > 1) {
      for (let i = 1; i < totalPages; i++) {
        pdf.addPage();
        const yOffset = -i * pdfHeight;
        pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidthFinal, imgHeightFinal);
      }
    }
    
    // Save PDF
    pdf.save(filename);
  } catch (error) {
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
}

/**
 * Generate PDF dari HTML dan return sebagai blob (untuk Node.js atau custom handling)
 * 
 * @param htmlString - HTML string dari invoice
 * @param options - Opsi untuk PDF
 * @returns Promise<Blob> - PDF blob
 */
export async function generateInvoicePDFBlob(
  htmlString: string,
  options?: {
    pageSize?: 'a4' | 'letter';
    orientation?: 'portrait' | 'landscape';
  }
): Promise<Blob> {
  if (typeof document === 'undefined') {
    throw new Error('PDF generation is only available in browser environment');
  }

  const pageSize = options?.pageSize || 'a4';
  const orientation = options?.orientation || 'portrait';
  
  // Buat temporary container
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = pageSize === 'a4' ? '210mm' : '8.5in';
  tempDiv.innerHTML = htmlString;
  document.body.appendChild(tempDiv);
  
  try {
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageSize
    });
    
    const htmlElement = tempDiv.querySelector('.invoice-container') || tempDiv;
    const width = htmlElement.clientWidth || (pageSize === 'a4' ? 210 : 216);
    const height = htmlElement.scrollHeight || 297;
    
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: width,
      height: height,
      windowWidth: width,
      windowHeight: height
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgWidthFinal = imgWidth * ratio;
    const imgHeightFinal = imgHeight * ratio;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidthFinal, imgHeightFinal);
    
    const totalPages = Math.ceil(imgHeightFinal / pdfHeight);
    if (totalPages > 1) {
      for (let i = 1; i < totalPages; i++) {
        pdf.addPage();
        const yOffset = -i * pdfHeight;
        pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidthFinal, imgHeightFinal);
      }
    }
    
    // Return as blob
    return pdf.output('blob');
  } catch (error) {
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    document.body.removeChild(tempDiv);
  }
}

