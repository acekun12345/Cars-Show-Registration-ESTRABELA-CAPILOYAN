namespace Application.Features.Registrations.GetRegistrationById;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationByIdHandler(IAppDbContext db)
    : IQueryHandler<GetRegistrationByIdQuery, Result<RegistrationResponse>>
{
    public async Task<Result<RegistrationResponse>> HandleAsync(
        GetRegistrationByIdQuery query, CancellationToken cancellationToken = default)
    {
        var entity = await db.Registrations
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == query.Id, cancellationToken);

        return entity is null
            ? Result<RegistrationResponse>.Failure(Error.NotFound(
                "Registration.NotFound", $"Registration '{query.Id}' was not found."))
            : Result<RegistrationResponse>.Success(RegistrationResponse.From(entity));
    }
}
