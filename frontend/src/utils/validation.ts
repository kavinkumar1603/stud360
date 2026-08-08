/**
 * Validates drive links according to section 4.3 rule:
 * Every drive-link input must be non-empty and start with "https://"
 */
export function isValidDriveLink(url: string | undefined | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return trimmed.length > 8 && trimmed.startsWith('https://');
}

/**
 * Validates date range To >= From
 */
export function isValidDateRange(fromDateStr: string, toDateStr: string): boolean {
  if (!fromDateStr || !toDateStr) return false;
  const from = new Date(fromDateStr);
  const to = new Date(toDateStr);
  return !isNaN(from.getTime()) && !isNaN(to.getTime()) && to.getTime() >= from.getTime();
}

/**
 * Formats date string to readable format e.g. "12 Oct 2025"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

/**
 * Formats date range string
 */
export function formatDateRange(fromStr: string, toStr: string): string {
  if (fromStr === toStr) {
    return formatDate(fromStr);
  }
  return `${formatDate(fromStr)} - ${formatDate(toStr)}`;
}
