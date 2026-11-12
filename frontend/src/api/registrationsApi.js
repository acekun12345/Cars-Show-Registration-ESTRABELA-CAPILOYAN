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

function getFieldErrors(problem) {
  if (!problem?.errors || typeof problem.errors !== 'object') {
    return {}
  }

  return Object.fromEntries(
    Object.entries(problem.errors).map(([field, messages]) => [
      field,
      (Array.isArray(messages) ? messages : [messages]).filter(
        (message) => typeof message === 'string' && message.trim(),
      ),
    ]),
  )
}

export class ApiError extends Error {
  constructor(message, { status, fieldErrors = {} }) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function requestJson(url, options = {}) {
  let response

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...options.headers,
      },
    })
  } catch (error) {
    throw new Error(
      'Cannot reach the API. Check that the backend is running and accessible.',
      { cause: error },
    )
  }

  const responseText = await response.text()
  let result = null

  if (responseText) {
    try {
      result = JSON.parse(responseText)
    } catch {
      if (response.ok) {
        throw new Error('The API returned an invalid JSON response.')
      }
    }
  }

  if (!response.ok) {
    let fieldErrors = getFieldErrors(result)
    let message = getProblemMessage(result, response.status)

    if (response.status === 409) {
      const plateNumberError = Object.entries(fieldErrors).find(
        ([field]) => field.toLowerCase() === 'platenumber',
      )?.[1]?.[0]
      message =
        (typeof result?.detail === 'string' && result.detail.trim()) ||
        plateNumberError ||
        'This plate number is already registered.'
      fieldErrors = { ...fieldErrors, PlateNumber: [message] }
    }

    throw new ApiError(message, { status: response.status, fieldErrors })
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

export async function createRegistration(registration) {
  return requestJson(`${getApiBaseUrl()}/api/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registration),
  })
}
