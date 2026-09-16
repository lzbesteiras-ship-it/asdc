// PIX BR Code (BR Code) generator — "Copia e Cola" string for static PIX
// Reference: BCB PIX BR Code specification

const PIX_KEY = 'arena.wb@gmail.com';
const MERCHANT_NAME = 'ARENA WB FUTVOLEI';
const MERCHANT_CITY = 'CARUARU';

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .toUpperCase()
    .trim();
}

function formatField(id: string, value: string): string {
  const length = String(value.length).padStart(2, '0');
  return `${id}${length}${value}`;
}

function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function generatePixCode(amount: number): string {
  const name = normalizeText(MERCHANT_NAME).substring(0, 25);
  const city = normalizeText(MERCHANT_CITY).substring(0, 15);
  const amountStr = amount.toFixed(2);

  const gui = formatField('00', 'br.gov.bcb.pix');
  const key = formatField('01', PIX_KEY);
  const merchantAccount = formatField('26', gui + key);

  const additionalData = formatField('62', formatField('05', '***'));

  const payloadNoCrc =
    formatField('00', '01') +
    merchantAccount +
    formatField('52', '0000') +
    formatField('53', '986') +
    formatField('54', amountStr) +
    formatField('58', 'BR') +
    formatField('59', name) +
    formatField('60', city) +
    additionalData +
    '6304';

  const crc = calculateCRC16(payloadNoCrc);
  return payloadNoCrc + crc;
}
