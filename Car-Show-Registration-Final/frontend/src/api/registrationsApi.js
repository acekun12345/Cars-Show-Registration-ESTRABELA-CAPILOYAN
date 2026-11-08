function getApiBaseUrl() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured.')
  }

  return baseUrl.replace(/\/+$/, '')
}

function getProblemMessage(problem, status) {
  if (problem?.errors && typeof problem.errors === 'object') {
    const validationMessages = Object.entries(problem.errors).flatMap(
      ([field, messages]) => {
        const values = Array.isArray(messages) ? messages : [messages]
        return values
          .filter((message) => typeof message === 'string' && message.trim())
          .map((message) => `${field}: ${message}`)
      },
    )

    if (validationMessages.length > 0) {
      return validationMessages.join('; ')
    }
  }

  if (typeof problem?.detail === 'string' && problem.detail.trim()) {
    return problem.detail
  }

  if (typeof problem?.title === 'string' && problem.title.trim()) {
    return problem.title
  }

  return `The API request failed with status ${status}.`
}

async function requestJson(url) {
  let response

  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
    })
  } catch (error) {
    throw new Error(
      'Cannot reach the API. Check that the backend is running and accessible.',
      { cause: error },
    )
  }

  let result
  try {
    result = await response.json()
  } catch {
    if (response.ok) {
      throw new Error('The API returned an invalid JSON response.')
    }
  }

  if (!response.ok) {
    throw new Error(getProblemMessage(result, response.status))
  }

  return result
}

export async function getRegistrations({
  participantName = '',
  type = '',
  status = '',
  page = 1,
  pageSize = 10,
} = {}) {
  const params = new URLSearchParams()

  for (const [name, value] of Object.entries({ participantName, type, status })) {
    const filterValue = String(value ?? '').trim()
    if (filterValue && filterValue.toLowerCase() !== 'all') {
      params.set(name, filterValue)
    }
  }

  params.set('page', String(page))
  params.set('pageSize', String(pageSize))

  return requestJson(
    `${getApiBaseUrl()}/api/registrations?${params.toString()}`,
  )
}

export async function getSummary() {
  return requestJson(`${getApiBaseUrl()}/api/registrations/summary`)
}
