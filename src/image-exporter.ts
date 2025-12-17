/**
 * Export HTML ke PNG menggunakan html2canvas
 * 
 * @param htmlString - HTML string dari invoice
 * @param filename - Nama file untuk export (default: 'invoice.png')
 * @param options - Opsi untuk export (scale, quality)
 */
export async function exportInvoiceAsPNG(
  htmlString: string,
  filename: string = 'invoice.png',
  options?: {
    scale?: number;
    quality?: number;
  }
): Promise<void> {
  if (typeof document === 'undefined') {
    throw new Error('PNG export is only available in browser environment');
  }

  const scale = options?.scale || 2;
  const quality = options?.quality || 1.0;
  
  // Buat temporary container untuk HTML
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '210mm'; // A4 width
  tempDiv.innerHTML = htmlString;
  document.body.appendChild(tempDiv);
  
  try {
    // Import html2canvas dynamically
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(tempDiv, {
      scale: scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create PNG blob');
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
    }, 'image/png', quality);
  } catch (error) {
    throw new Error(`Failed to export PNG: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
}

/**
 * Export HTML ke SVG (converts PNG to SVG wrapper, atau bisa generate SVG langsung)
 * Note: Untuk hasil yang lebih baik, bisa menggunakan library khusus untuk HTML to SVG
 * 
 * @param htmlString - HTML string dari invoice
 * @param filename - Nama file untuk export (default: 'invoice.svg')
 */
export async function exportInvoiceAsSVG(
  htmlString: string,
  filename: string = 'invoice.svg'
): Promise<void> {
  if (typeof document === 'undefined') {
    throw new Error('SVG export is only available in browser environment');
  }

  // Untuk saat ini, kita convert ke PNG dulu, lalu wrap dalam SVG
  // Alternatif yang lebih baik: gunakan library seperti dom-to-svg atau html-to-svg
  
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '210mm';
  tempDiv.innerHTML = htmlString;
  document.body.appendChild(tempDiv);
  
  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/png');
    
    // Create SVG dengan embedded PNG (simpler approach)
    // Untuk true vector SVG, perlu library khusus
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${canvas.width}" height="${canvas.height}">
  <image x="0" y="0" width="${canvas.width}" height="${canvas.height}" 
         xlink:href="${dataUrl}"/>
</svg>`;
    
    // Create blob dan download
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
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
  } catch (error) {
    throw new Error(`Failed to export SVG: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    document.body.removeChild(tempDiv);
  }
}

/**
 * Generate PNG data URI dari HTML (untuk preview atau custom handling)
 * 
 * @param htmlString - HTML string dari invoice
 * @param options - Opsi untuk export
 * @returns Promise<string> - Data URI PNG
 */
export async function generateInvoicePNGDataURI(
  htmlString: string,
  options?: {
    scale?: number;
  }
): Promise<string> {
  if (typeof document === 'undefined') {
    throw new Error('PNG generation is only available in browser environment');
  }

  const scale = options?.scale || 2;
  
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '210mm';
  tempDiv.innerHTML = htmlString;
  document.body.appendChild(tempDiv);
  
  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(tempDiv, {
      scale: scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    throw new Error(`Failed to generate PNG: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    document.body.removeChild(tempDiv);
  }
}

