namespace Application.Features.Registrations.GetRegistrationSummary;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationSummaryHandler(IAppDbContext db)
    : IQueryHandler<GetRegistrationSummaryQuery, Result<RegistrationSummaryResponse>>
{
    public async Task<Result<RegistrationSummaryResponse>> HandleAsync(
        GetRegistrationSummaryQuery query, CancellationToken cancellationToken = default)
    {
        // SQLite cannot Sum() decimals in SQL: load 3 small columns and sum in memory
        var rows = await db.Registrations
            .AsNoTracking()
            .Select(r => new { r.Status, r.RegistrationFee, r.AmountPaid })
            .ToListAsync(cancellationToken);

        // Cancelled registrations are excluded from the money totals
        var active = rows.Where(r => r.Status != RegistrationStatus.Cancelled).ToList();
        var fees = active.Sum(r => r.RegistrationFee);
        var paid = active.Sum(r => r.AmountPaid);

        return Result<RegistrationSummaryResponse>.Success(new RegistrationSummaryResponse(
            rows.Count,
            rows.Count(r => r.Status == RegistrationStatus.Confirmed),
            rows.Count(r => r.Status == RegistrationStatus.CheckedIn),
            rows.Count(r => r.Status == RegistrationStatus.Pending),
            rows.Count(r => r.Status == RegistrationStatus.Cancelled),
            fees,
            paid,
            fees - paid));
    }
}
