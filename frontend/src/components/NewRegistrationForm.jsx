import { useState } from 'react'
import { ApiError, createRegistration } from '../api/registrationsApi.js'

const fields = [
  { name: 'participantName', label: 'Participant name', type: 'text' },
  { name: 'contactNumber', label: 'Contact number', type: 'tel' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'address', label: 'Address', type: 'text' },
  { name: 'carMakeModel', label: 'Car make and model', type: 'text' },
  { name: 'plateNumber', label: 'Plate number', type: 'text' },
]

const fieldAliases = {
  participantName: ['participantname'],
  contactNumber: ['contactnumber'],
  email: ['email'],
  address: ['address'],
  carMakeModel: ['carmakemodel'],
  plateNumber: ['platenumber'],
  registrationType: ['registrationtype'],
}

const initialForm = {
  participantName: '',
  contactNumber: '',
  email: '',
  address: '',
  carMakeModel: '',
  plateNumber: '',
  registrationType: 'Exhibitor',
}

function NewRegistrationForm({ onCancel, onCreated }) {
  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function getErrorsForField(fieldName) {
    const aliases = fieldAliases[fieldName]
    const messages = Object.entries(fieldErrors).flatMap(([name, value]) =>
      aliases.includes(name.toLowerCase())
        ? Array.isArray(value)
          ? value
          : [value]
        : [],
    )
    return messages.filter((message) => typeof message === 'string')
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
    setFieldErrors((currentErrors) => {
      const aliases = fieldAliases[name]
      return Object.fromEntries(
        Object.entries(currentErrors).filter(
          ([field]) => !aliases.includes(field.toLowerCase()),
        ),
      )
    })
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setFieldErrors({})

    try {
      await createRegistration(form)
      onCreated()
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setFieldErrors(requestError.fieldErrors)
        const hasKnownFieldErrors = Object.entries(
          requestError.fieldErrors,
        ).some(([field, messages]) => {
          const isFormField = Object.values(fieldAliases).some((aliases) =>
            aliases.includes(field.toLowerCase()),
          )
          return (
            isFormField &&
            Array.isArray(messages) &&
            messages.some((message) => message.trim())
          )
        })

        if (!hasKnownFieldErrors) {
          setError(
            requestError.status === 409
              ? 'This registration conflicts with an existing record.'
              : requestError.message,
          )
        }
      } else {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Could not create the registration. Please try again.',
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  function renderFieldError(fieldName) {
    const messages = getErrorsForField(fieldName)
    if (messages.length === 0) {
      return null
    }

    return (
      <p className="mt-1 text-sm text-red-800" id={`${fieldName}-error`}>
        {messages.join(' ')}
      </p>
    )
  }

  return (
    <section
      aria-labelledby="new-registration-heading"
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold" id="new-registration-heading">
          New registration
        </h3>
        <button
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={submitting}
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
      </div>

      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        {error && (
          <p
            className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(({ name, label, type }) => {
            const messages = getErrorsForField(name)
            const errorId = `${name}-error`

            return (
              <div key={name}>
                <label
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                  htmlFor={`new-${name}`}
                >
                  {label}
                </label>
                <input
                  aria-describedby={messages.length ? errorId : undefined}
                  aria-invalid={messages.length > 0}
                  autoComplete="off"
                  className={`w-full rounded-md border px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 ${
                    messages.length
                      ? 'border-red-600 focus-visible:ring-red-600/20'
                      : 'border-slate-300 focus-visible:border-blue-600 focus-visible:ring-blue-600/20'
                  }`}
                  id={`new-${name}`}
                  name={name}
                  onChange={handleChange}
                  required
                  type={type}
                  value={form[name]}
                />
                {renderFieldError(name)}
              </div>
            )
          })}

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="new-registrationType"
            >
              Registration type
            </label>
            <select
              aria-describedby={
                getErrorsForField('registrationType').length
                  ? 'registrationType-error'
                  : undefined
              }
              aria-invalid={getErrorsForField('registrationType').length > 0}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20"
              id="new-registrationType"
              name="registrationType"
              onChange={handleChange}
              value={form.registrationType}
            >
              <option value="Exhibitor">Exhibitor</option>
              <option value="Competitor">Competitor</option>
              <option value="VIP">VIP</option>
            </select>
            {renderFieldError('registrationType')}
          </div>
        </div>

        <button
          className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700/40 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={submitting}
          type="submit"
        >
          {submitting ? 'Submitting…' : 'Create registration'}
        </button>
      </form>
    </section>
  )
}

export default NewRegistrationForm
