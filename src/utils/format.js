export function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return `Rs. ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
