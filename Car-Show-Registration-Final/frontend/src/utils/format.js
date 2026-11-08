const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})

export function formatCurrency(amount) {
  return currencyFormatter.format(amount)
}

export function formatDateTime(dateTime) {
  const date = new Date(dateTime)
  return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`
}
