import { useEffect, useState } from 'react'
import { getRegistrations, getSummary } from '../api/registrationsApi.js'
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
  const [retryCount, setRetryCount] = useState(0)
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
      } catch (requestError) {
        if (isCurrentRequest) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Cannot reach the API. Please check your connection and try again.',
          )
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
  }, [
    debouncedParticipantName,
    filters.type,
    filters.status,
    page,
    pageSize,
    retryCount,
  ])

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
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <h1 className="text-2xl leading-tight font-bold sm:text-3xl">
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
            {!loading && !error && (
              <p className="text-sm text-slate-600">
                {totalCount} registrations
              </p>
            )}
          </div>

          {loading ? (
            <p
              aria-live="polite"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-4 text-slate-700"
              role="status"
            >
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-700 motion-reduce:animate-none"
              />
              Loading registrations…
            </p>
          ) : error ? (
            <div
              aria-live="assertive"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-900"
              role="alert"
            >
              <span className="block font-medium">{error}</span>
              <button
                className="mt-3 rounded-md bg-red-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800/40 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
                onClick={() => setRetryCount((count) => count + 1)}
                type="button"
              >
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <p className="text-slate-700">
                No registrations match your filters.
              </p>
              <button
                className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700/40"
                onClick={handleClearFilters}
                type="button"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <RegistrationTable items={items} />
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
            </>
          )}

        </section>
      </div>
    </main>
  )
}

export default RegistrationsPage
