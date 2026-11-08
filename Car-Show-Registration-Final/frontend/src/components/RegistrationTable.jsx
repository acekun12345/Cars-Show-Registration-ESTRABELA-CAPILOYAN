import { formatCurrency, formatDateTime } from '../utils/format.js'
import PaymentBadge from './PaymentBadge.jsx'
import StatusBadge from './StatusBadge.jsx'

function RegistrationTable({ items }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-[1100px] w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3" scope="col">
              Registration No.
            </th>
            <th className="px-4 py-3" scope="col">
              Date
            </th>
            <th className="px-4 py-3" scope="col">
              Participant
            </th>
            <th className="px-4 py-3" scope="col">
              Car
            </th>
            <th className="px-4 py-3" scope="col">
              Type
            </th>
            <th className="px-4 py-3" scope="col">
              Status
            </th>
            <th className="px-4 py-3 text-right" scope="col">
              Fee / Paid
            </th>
            <th className="px-4 py-3" scope="col">
              Payment
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((registration) => (
            <tr
              key={registration.id}
              className="transition-colors hover:bg-slate-50"
            >
              <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">
                {registration.registrationNumber}
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                {formatDateTime(registration.registrationDate)}
              </td>
              <td className="px-4 py-4">
                <p className="whitespace-nowrap font-medium text-slate-900">
                  {registration.participantName}
                </p>
                <p className="mt-1 whitespace-nowrap text-xs text-slate-500">
                  {registration.contactNumber || registration.email}
                </p>
              </td>
              <td className="px-4 py-4">
                <p className="whitespace-nowrap font-medium text-slate-900">
                  {registration.carMakeModel}
                </p>
                <p className="mt-1 whitespace-nowrap text-xs text-slate-500">
                  {registration.plateNumber}
                </p>
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                {registration.registrationType}
              </td>
              <td className="whitespace-nowrap px-4 py-4">
                <StatusBadge status={registration.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-right tabular-nums text-slate-700">
                {formatCurrency(registration.registrationFee)} /{' '}
                {formatCurrency(registration.amountPaid)}
              </td>
              <td className="whitespace-nowrap px-4 py-4">
                <PaymentBadge paymentStatus={registration.paymentStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RegistrationTable
