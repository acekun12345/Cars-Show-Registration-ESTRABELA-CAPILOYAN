import { useEffect, useState } from 'react'
import { getRegistrations, getSummary } from '../api/sample-data.js'
import KpiCards from '../components/KpiCards.jsx'
import RegistrationTable from '../components/RegistrationTable.jsx'

function RegistrationsPage() {
  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters] = useState({
    participantName: '',
    type: '',
    status: '',
  })
  const [page] = useState(1)
  const [pageSize] = useState(10)

  useEffect(() => {
    let isCurrentRequest = true

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const [registrationData, summaryData] = await Promise.all([
          getRegistrations({ ...filters, page, pageSize }),
          getSummary(),
        ])

        if (!isCurrentRequest) {
          return
        }

        setItems(registrationData.items)
        setTotalCount(registrationData.totalCount)
        setTotalPages(registrationData.totalPages)
        setSummary(summaryData)
      } catch {
        if (isCurrentRequest) {
          setError('Unable to load registrations. Please try again later.')
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isCurrentRequest = false
    }
  }, [filters, page, pageSize])

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-3xl font-bold">
          Car Show Registration Dashboard
        </h1>

        {summary && <KpiCards summary={summary} />}

        <section aria-labelledby="registrations-heading" className="space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2
              className="text-xl font-semibold"
              id="registrations-heading"
            >
              Registrations
            </h2>
            {!loading && (
              <p className="text-sm text-slate-600">
                {totalCount} registrations
              </p>
            )}
          </div>

          {loading && (
            <p aria-live="polite" className="text-sm text-slate-600">
              Loading registrations...
            </p>
          )}

          {error && (
            <p
              aria-live="assertive"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-900"
              role="alert"
            >
              {error}
            </p>
          )}

          {!loading && !error && items.length === 0 && (
            <p className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
              No registrations found.
            </p>
          )}

          {!error && <RegistrationTable items={items} />}

          {!loading && totalPages > 0 && (
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages} ({pageSize} per page)
            </p>
          )}
        </section>
      </div>
    </main>
  )
}

export default RegistrationsPage
