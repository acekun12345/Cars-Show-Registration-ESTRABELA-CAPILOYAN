const paymentStyles = {
  Unpaid: 'bg-red-100 text-red-900',
  Partial: 'bg-amber-100 text-amber-900',
  Paid: 'bg-green-100 text-green-900',
}

function PaymentBadge({ paymentStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-sm font-medium ${paymentStyles[paymentStatus] ?? 'bg-slate-100 text-slate-900'}`}
    >
      {paymentStatus}
    </span>
  )
}

export default PaymentBadge
