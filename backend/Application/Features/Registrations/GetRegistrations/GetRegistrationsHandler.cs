namespace Application.Features.Registrations.GetRegistrations;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationsHandler(IAppDbContext db)
    : IQueryHandler<GetRegistrationsQuery, Result<PagedResponse<RegistrationResponse>>>
{
    public async Task<Result<PagedResponse<RegistrationResponse>>> HandleAsync(
        GetRegistrationsQuery query, CancellationToken cancellationToken = default)
    {
        var q = db.Registrations.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.ParticipantName))
        {
            var pattern = $"%{query.ParticipantName.Trim()}%";
            q = q.Where(r => EF.Functions.Like(r.ParticipantName, pattern)); // case-insensitive on SQLite
        }

        if (query.Type is not null)
            q = q.Where(r => r.RegistrationType == query.Type);

        if (query.Status is not null)
            q = q.Where(r => r.Status == query.Status);

        var totalCount = await q.CountAsync(cancellationToken);

        var rows = await q
            .OrderByDescending(r => r.RegistrationDate)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        var totalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)query.PageSize);

        return Result<PagedResponse<RegistrationResponse>>.Success(
            new PagedResponse<RegistrationResponse>(
                rows.Select(RegistrationResponse.From).ToList(),
                query.Page, query.PageSize, totalCount, totalPages));
    }
}
