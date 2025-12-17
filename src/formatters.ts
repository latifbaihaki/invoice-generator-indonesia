/**
 * Format angka ke format Rupiah Indonesia
 * 
 * @param amount - Jumlah uang dalam Rupiah
 * @param includeDecimals - Apakah include desimal? (default: false)
 * @returns String format Rupiah, contoh: "Rp 1.000.000" atau "Rp 1.000.000,00"
 * 
 * @example
 * formatRupiah(1000000) // "Rp 1.000.000"
 * formatRupiah(1000000, true) // "Rp 1.000.000,00"
 * formatRupiah(1234567.89, true) // "Rp 1.234.567,89"
 */
export function formatRupiah(amount: number, includeDecimals: boolean = false): string {
  // Handle angka negatif
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Pisahkan bagian bulat dan desimal
  const parts = absAmount.toFixed(2).split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Format bagian bulat dengan titik sebagai separator ribuan
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Gabungkan dengan desimal jika diperlukan
  let result = formattedInteger;
  if (includeDecimals) {
    result = `${formattedInteger},${decimalPart}`;
  }
  
  // Tambahkan prefix Rp dan tanda negatif jika ada
  return `${isNegative ? '-' : ''}Rp ${result}`;
}

/**
 * Format tanggal ke format Indonesia
 * 
 * @param date - Date object
 * @param format - Format yang diinginkan: 'long' (17 Desember 2024) atau 'short' (17/12/2024) atau 'medium' (17 Des 2024)
 * @returns String tanggal yang sudah diformat
 * 
 * @example
 * formatTanggal(new Date(2024, 11, 17), 'long') // "17 Desember 2024"
 * formatTanggal(new Date(2024, 11, 17), 'short') // "17/12/2024"
 * formatTanggal(new Date(2024, 11, 17), 'medium') // "17 Des 2024"
 */
export function formatTanggal(date: Date, format: 'long' | 'short' | 'medium' = 'long'): string {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const namaBulanSingkat = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  
  switch (format) {
    case 'short':
      // Format: DD/MM/YYYY
      const monthNum = (month + 1).toString().padStart(2, '0');
      const dayNum = day.toString().padStart(2, '0');
      return `${dayNum}/${monthNum}/${year}`;
    
    case 'medium':
      // Format: DD BulanSingkat YYYY
      return `${day} ${namaBulanSingkat[month]} ${year}`;
    
    case 'long':
    default:
      // Format: DD Bulan YYYY
      return `${day} ${namaBulan[month]} ${year}`;
  }
}

/**
 * Format NPWP ke format standar Indonesia
 * Format: XX.XXX.XXX.X-XXX.XXX
 * 
 * @param npwp - Nomor NPWP (dengan atau tanpa format)
 * @returns String NPWP yang sudah diformat
 * 
 * @example
 * formatNPWP("012345678901000") // "01.234.567.8-901.000"
 * formatNPWP("01.234.567.8-901.000") // "01.234.567.8-901.000" (already formatted)
 */
export function formatNPWP(npwp: string): string {
  if (!npwp) return '';
  
  // Hapus semua karakter non-digit
  const digits = npwp.replace(/\D/g, '');
  
  // NPWP harus 15 digit
  if (digits.length !== 15) {
    // Jika tidak 15 digit, return as-is (mungkin sudah diformat atau invalid)
    return npwp;
  }
  
  // Format: XX.XXX.XXX.X-XXX.XXX
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}.${digits.slice(8, 9)}-${digits.slice(9, 12)}.${digits.slice(12, 15)}`;
}

/**
 * Format nomor telepon Indonesia (opsional helper)
 * 
 * @param phone - Nomor telepon
 * @returns String nomor telepon yang sudah diformat
 * 
 * @example
 * formatPhone("081234567890") // "0812-3456-7890"
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  
  // Hapus semua karakter non-digit
  const digits = phone.replace(/\D/g, '');
  
  // Format nomor Indonesia (10-13 digit)
  if (digits.length >= 10 && digits.length <= 13) {
    if (digits.startsWith('0')) {
      // Format: 0XXX-XXXX-XXXX
      if (digits.length === 11) {
        return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
      } else if (digits.length === 12) {
        return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
      } else if (digits.length === 13) {
        return `${digits.slice(0, 4)}-${digits.slice(4, 9)}-${digits.slice(9)}`;
      }
      return digits;
    } else if (digits.startsWith('62')) {
      // Format internasional: +62 XXX-XXXX-XXXX
      const localDigits = '0' + digits.slice(2);
      return formatPhone(localDigits);
    }
  }
  
  return phone;
}

