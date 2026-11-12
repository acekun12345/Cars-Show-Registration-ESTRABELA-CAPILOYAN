function RegistrationFilters({ filters, onFilterChange, onClear }) {
  return (
    <section
      aria-label="Filter registrations"
      className="rounded-lg border border-slate-200 bg-white p-4"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end">
        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-slate-700"
            htmlFor="participant-name"
          >
            Search participant name
          </label>
          <input
            autoComplete="off"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20"
            id="participant-name"
            onChange={(event) =>
              onFilterChange('participantName', event.target.value)
            }
            placeholder="Search participant name…"
            type="search"
            value={filters.participantName}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-slate-700"
            htmlFor="registration-type"
          >
            Registration type
          </label>
          <select
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20"
            id="registration-type"
            onChange={(event) => onFilterChange('type', event.target.value)}
            value={filters.type}
          >
            <option value="">All</option>
            <option value="Exhibitor">Exhibitor</option>
            <option value="Competitor">Competitor</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-slate-700"
            htmlFor="registration-status"
          >
            Status
          </label>
          <select
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20"
            id="registration-status"
            onChange={(event) => onFilterChange('status', event.target.value)}
            value={filters.status}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="CheckedIn">Checked In</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <button
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onClear}
          type="button"
        >
          Clear filters
        </button>
      </div>
    </section>
  )
}

export default RegistrationFilters
