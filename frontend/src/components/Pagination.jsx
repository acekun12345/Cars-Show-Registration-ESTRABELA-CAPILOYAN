function getPageItems(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, 'end-ellipsis', totalPages]
  }

  if (page >= totalPages - 3) {
    return [
      1,
      'start-ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [
    1,
    'start-ellipsis',
    page - 1,
    page,
    page + 1,
    'end-ellipsis',
    totalPages,
  ]
}

function Pagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  loading,
  onPageChange,
  onPageSizeChange,
}) {
  const firstItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, totalCount)
  const pageItems = getPageItems(page, totalPages)

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p aria-live="polite" className="text-sm text-slate-600">
        Showing {firstItem}–{lastItem} of {totalCount}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="page-size"
        >
          Rows per page
        </label>
        <select
          className="rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-900 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
          id="page-size"
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          value={pageSize}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

        <nav aria-label="Registration pages" className="flex items-center gap-1">
          <button
            aria-label="Previous page"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
            disabled={loading || page <= 1}
            onClick={() => onPageChange(page - 1)}
            type="button"
          >
            Previous
          </button>

          {pageItems.map((item) =>
            typeof item === 'number' ? (
              <button
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Page ${item}`}
                className={`min-w-9 rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 disabled:cursor-not-allowed disabled:opacity-50 ${
                  item === page
                    ? 'border-blue-700 bg-blue-700 text-white'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                disabled={loading}
                key={item}
                onClick={() => onPageChange(item)}
                type="button"
              >
                {item}
              </button>
            ) : (
              <span
                aria-hidden="true"
                className="px-1 text-slate-500"
                key={item}
              >
                …
              </span>
            ),
          )}

          <button
            aria-label="Next page"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
            disabled={loading || page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            type="button"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  )
}

export default Pagination
