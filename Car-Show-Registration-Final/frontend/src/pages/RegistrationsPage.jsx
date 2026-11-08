import { useEffect, useState } from 'react'
import { getRegistrations, getSummary } from '../api/sample-data.js'
import KpiCards from '../components/KpiCards.jsx'
import Pagination from '../components/Pagination.jsx'
import RegistrationFilters from '../components/RegistrationFilters.jsx'
import RegistrationTable from '../components/RegistrationTable.jsx'
import useDebounce from '../hooks/useDebounce.js'

function RegistrationsPage() {
  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    participantName: '',
    type: '',
    status: '',
  })
  const debouncedParticipantName = useDebounce(filters.participantName, 400)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    let isCurrentRequest = true

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const [registrationData, summaryData] = await Promise.all([
          getRegistrations({
            participantName: debouncedParticipantName,
            type: filters.type,
            status: filters.status,
            page,
            pageSize,
          }),
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
  }, [debouncedParticipantName, filters.type, filters.status, page, pageSize])

  function handleFilterChange(name, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
    setPage(1)
  }

  function handleClearFilters() {
    setFilters({ participantName: '', type: '', status: '' })
    setPage(1)
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-3xl font-bold">
          Car Show Registration Dashboard
        </h1>

        {summary && <KpiCards summary={summary} />}

        <section aria-labelledby="registrations-heading" className="space-y-4">
          <RegistrationFilters
            filters={filters}
            onClear={handleClearFilters}
            onFilterChange={handleFilterChange}
          />

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

          {totalPages > 0 && (
            <Pagination
              loading={loading}
              onPageChange={setPage}
              onPageSizeChange={(nextPageSize) => {
                setPageSize(nextPageSize)
                setPage(1)
              }}
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              totalPages={totalPages}
            />
          )}
        </section>
      </div>
    </main>
  )
}

export default RegistrationsPage
