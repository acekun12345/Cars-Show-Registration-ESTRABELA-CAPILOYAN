import PaymentBadge from './components/PaymentBadge.jsx'
import KpiCards from './components/KpiCards.jsx'
import RegistrationTable from './components/RegistrationTable.jsx'
import StatusBadge from './components/StatusBadge.jsx'
import { sampleRegistrations } from './api/sample-data.js'
import { formatCurrency, formatDateTime } from './utils/format.js'

const sampleSummary = {
  totalRegistrations: 30,
  confirmed: 11,
  checkedIn: 7,
  pending: 7,
  cancelled: 5,
  totalFees: 162500,
  totalPayments: 106500,
  uncollectedPayments: 56000,
}

function App() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-3xl font-bold">
          Car Show Registration Dashboard
        </h1>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Registration overview</h2>
          <KpiCards summary={sampleSummary} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Registrations</h2>
          <RegistrationTable items={sampleRegistrations.slice(0, 10)} />
        </section>

        <section className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Helper preview</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <p>
              <span className="font-medium">Registration fee:</span>{' '}
              {formatCurrency(2500)}
            </p>
            <p>
              <span className="font-medium">Registration date:</span>{' '}
              {formatDateTime('2027-02-10T08:30:00')}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Registration statuses</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="Pending" />
              <StatusBadge status="Confirmed" />
              <StatusBadge status="CheckedIn" />
              <StatusBadge status="Cancelled" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Payment statuses</h3>
            <div className="flex flex-wrap gap-2">
              <PaymentBadge paymentStatus="Unpaid" />
              <PaymentBadge paymentStatus="Partial" />
              <PaymentBadge paymentStatus="Paid" />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
