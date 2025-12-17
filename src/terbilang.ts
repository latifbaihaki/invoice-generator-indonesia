/**
 * Konversi angka ke terbilang dalam bahasa Indonesia
 * Support angka dari 0 hingga 999 triliun
 */

const bilangan = [
  '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima',
  'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh',
  'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas',
  'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas'
];

/**
 * Convert angka 1-99 ke terbilang
 */
function convertTens(num: number): string {
  if (num === 0) return '';
  if (num < 20) return bilangan[num];
  
  const tens = Math.floor(num / 10);
  const ones = num % 10;
  
  let result = '';
  switch (tens) {
    case 2:
      result = 'Dua Puluh';
      break;
    case 3:
      result = 'Tiga Puluh';
      break;
    case 4:
      result = 'Empat Puluh';
      break;
    case 5:
      result = 'Lima Puluh';
      break;
    case 6:
      result = 'Enam Puluh';
      break;
    case 7:
      result = 'Tujuh Puluh';
      break;
    case 8:
      result = 'Delapan Puluh';
      break;
    case 9:
      result = 'Sembilan Puluh';
      break;
  }
  
  if (ones > 0) {
    result += ` ${bilangan[ones]}`;
  }
  
  return result;
}

/**
 * Convert angka 1-999 ke terbilang
 */
function convertHundreds(num: number): string {
  if (num === 0) return '';
  
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;
  
  let result = '';
  
  if (hundreds > 0) {
    if (hundreds === 1) {
      result = 'Seratus';
    } else {
      result = `${bilangan[hundreds]} Ratus`;
    }
  }
  
  if (remainder > 0) {
    if (result) result += ' ';
    result += convertTens(remainder);
  }
  
  return result;
}

/**
 * Convert angka ke terbilang dengan satuan (ribu, juta, milyar, triliun)
 */
function convertWithUnit(num: number, unit: string): string {
  if (num === 0) return '';
  
  const converted = convertHundreds(num);
  
  if (!converted) return '';
  
  // Handle "satu ribu" -> "seribu"
  if (unit === 'Ribu' && num === 1) {
    return 'Seribu';
  }
  
  // Handle "satu juta" -> "satu juta" (tetap "satu")
  return `${converted} ${unit}`;
}

/**
 * Konversi angka ke terbilang Rupiah
 * 
 * @param amount - Jumlah uang dalam Rupiah
 * @returns String terbilang, contoh: "Sebelas Juta Empat Ratus Tiga Puluh Tiga Ribu Rupiah"
 * 
 * @example
 * terbilangRupiah(11433000) // "Sebelas Juta Empat Ratus Tiga Puluh Tiga Ribu Rupiah"
 * terbilangRupiah(0) // "Nol Rupiah"
 * terbilangRupiah(1000000) // "Satu Juta Rupiah"
 */
export function terbilangRupiah(amount: number): string {
  // Handle nol
  if (amount === 0) {
    return 'Nol Rupiah';
  }
  
  // Handle negatif
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Pisahkan bagian bulat dan desimal (sen)
  const parts = absAmount.toFixed(2).split('.');
  const integerPart = parseInt(parts[0], 10);
  const decimalPart = parseInt(parts[1], 10);
  
  // Array untuk menyimpan bagian-bagian terbilang
  const partsTerbilang: string[] = [];
  
  // Triliun (1-999)
  const triliun = Math.floor(integerPart / 1e12);
  if (triliun > 0) {
    partsTerbilang.push(convertWithUnit(triliun, 'Triliun'));
  }
  
  // Milyar (1-999)
  const milyar = Math.floor((integerPart % 1e12) / 1e9);
  if (milyar > 0) {
    partsTerbilang.push(convertWithUnit(milyar, 'Milyar'));
  }
  
  // Juta (1-999)
  const juta = Math.floor((integerPart % 1e9) / 1e6);
  if (juta > 0) {
    partsTerbilang.push(convertWithUnit(juta, 'Juta'));
  }
  
  // Ribu (1-999)
  const ribu = Math.floor((integerPart % 1e6) / 1e3);
  if (ribu > 0) {
    partsTerbilang.push(convertWithUnit(ribu, 'Ribu'));
  }
  
  // Ratusan (1-999)
  const ratusan = integerPart % 1e3;
  if (ratusan > 0) {
    partsTerbilang.push(convertHundreds(ratusan));
  }
  
  // Jika tidak ada bagian bulat (sangat tidak mungkin untuk Rupiah, tapi handle saja)
  if (partsTerbilang.length === 0) {
    partsTerbilang.push('Nol');
  }
  
  // Gabungkan semua bagian
  let result = partsTerbilang.join(' ');
  
  // Tambahkan "Rupiah"
  result += ' Rupiah';
  
  // Handle sen (desimal)
  if (decimalPart > 0) {
    const senTerbilang = convertHundreds(decimalPart);
    if (senTerbilang) {
      result += ` ${senTerbilang} Sen`;
    }
  }
  
  // Tambahkan tanda negatif jika ada
  if (isNegative) {
    result = `Minus ${result}`;
  }
  
  return result;
}

