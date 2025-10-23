export function formatMoney(value: number, decimals?: number) {
  if (typeof value !== 'number' || !isFinite(value)) {
    return String(value); // NaN, Infinity -> trả về string tương ứng
  }

  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);

  // Helper: format phần nguyên với dấu phẩy
  const formatInteger = (intStr: any) =>
    intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (decimals === undefined || decimals === null) {
    // Nếu là số nguyên -> chỉ in phần nguyên
    if (Number.isInteger(abs)) {
      return sign + formatInteger(String(Math.trunc(abs)));
    }

    // Nếu là số thập phân -> giữ nguyên các chữ số thập phân hiện có
    // Chuyển sang chuỗi; xử lý exponential case
    let s = abs.toString();
    if (s.includes('e') || s.includes('E')) {
      // chuyển số dạng exponential về dạng thập phân đầy đủ (đủ nhiều chữ số), sau đó trim
      s = abs.toFixed(20).replace(/\.?0+$/, '');
    }
    const [intPart, fracPart] = s.split('.');
    return sign + formatInteger(intPart) + (fracPart ? '.' + fracPart : '');
  }

  // Nếu decimals được truyền -> ép về số nguyên >= 0
  const n = Math.max(0, Math.floor(Number(decimals) || 0));
  const fixed = abs.toFixed(n); // làm tròn
  const [intPart, fracPart] = fixed.split('.');
  return sign + formatInteger(intPart) + (n > 0 ? '.' + fracPart : '');
}
