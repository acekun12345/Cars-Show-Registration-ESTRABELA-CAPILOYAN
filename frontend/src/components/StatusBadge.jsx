const statusStyles = {
  Pending: 'bg-amber-100 text-amber-900',
  Confirmed: 'bg-blue-100 text-blue-900',
  CheckedIn: 'bg-green-100 text-green-900',
  Cancelled: 'bg-red-100 text-red-900',
}

const statusLabels = {
  CheckedIn: 'Checked In',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-sm font-medium ${statusStyles[status] ?? 'bg-slate-100 text-slate-900'}`}
    >
      {statusLabels[status] ?? status}
    </span>
  )
}

export default StatusBadge
