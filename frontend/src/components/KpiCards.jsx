import { formatCurrency } from '../utils/format.js'
import KpiCard from './KpiCard.jsx'

function KpiCards({ summary }) {
  const collectionRate =
    summary.totalFees > 0
      ? `${((summary.totalPayments / summary.totalFees) * 100).toFixed(1)}%`
      : '0.0%'
  const cards = [
    { title: 'Total Registrations', value: summary.totalRegistrations },
    { title: 'Total Payments', value: formatCurrency(summary.totalPayments) },
    {
      title: 'Uncollected Payments',
      value: formatCurrency(summary.uncollectedPayments),
    },
    { title: 'Confirmed', value: summary.confirmed },
    { title: 'Checked In', value: summary.checkedIn },
    {
      title: 'Collection Rate',
      value: collectionRate,
      hint: `${formatCurrency(summary.totalPayments)} of ${formatCurrency(summary.totalFees)}`,
    },
  ]

  return (
    <section
      aria-label="Registration summary"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {cards.map((card) => (
        <KpiCard
          key={card.title}
          title={card.title}
          value={card.value}
          hint={card.hint}
        />
      ))}
    </section>
  )
}

export default KpiCards
