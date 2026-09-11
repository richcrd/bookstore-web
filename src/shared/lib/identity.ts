// Backend identifies client by GUID CustomerId, but token only returns 'sub'

function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function customerIdFromSub(sub: string): string {
  const part = (n: number) => fnv1a(`bookstore:${sub}:${n}`).toString(16).padStart(8, '0');
  const a = part(1);
  const b = part(2);
  const c = part(3);
  const d = part(4);
  const e = part(5);
  return `${a}-${b.slice(0, 4)}-4${b.slice(4, 7)}-8${c.slice(4, 7)}-${c.slice(7)}${d}${e.slice(0, 3)}`;
}

export function formatMoney(value: number, currency: string): string {
  return new Intl.NumberFormat('es-NI', { style: 'currency', currency }).format(value);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-NI', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function shortId(id: string): string {
  return id.slice(0, 8);
}
