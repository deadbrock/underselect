export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/** Aceita rascunho de digitação (`12,`, `12.6`) e valores colados (`1.234,56`). */
export function sanitizeBrlDraft(raw: string): string | null {
  const cleaned = raw.replace(/[^\d.,]/g, '');
  if (!cleaned) return '';

  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');
  const lastSep = Math.max(lastComma, lastDot);

  if (lastSep === -1) {
    return cleaned.length <= 9 ? cleaned : null;
  }

  const intRaw = cleaned.slice(0, lastSep).replace(/[.,]/g, '');
  const decRaw = cleaned.slice(lastSep + 1).replace(/[.,]/g, '');
  if (intRaw.length > 9 || decRaw.length > 2) return null;
  return `${intRaw},${decRaw}`;
}

export function parseBrlNumber(raw: string): number | null {
  const draft = sanitizeBrlDraft(raw);
  if (draft === null || draft === '' || draft === ',') return null;

  const n = Number(draft.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export function formatBrlNumberInput(
  value: number,
  options?: { emptyWhenZero?: boolean },
): string {
  const emptyWhenZero = options?.emptyWhenZero ?? true;
  if (!Number.isFinite(value)) return '';
  if (emptyWhenZero && value === 0) return '';

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function maskCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return '***.***.***-**';
  return `***.***.***-${digits.slice(-2)}`;
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}
