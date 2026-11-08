import PaymentBadge from './components/PaymentBadge.jsx'
import StatusBadge from './components/StatusBadge.jsx'
import { formatCurrency, formatDateTime } from './utils/format.js'

function App() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-3xl font-bold">
          Car Show Registration Dashboard
        </h1>

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
