namespace Application.Features.Registrations.GetRegistrationById;

using Application.Abstractions.Messaging;
using Domain.Common;

public sealed record GetRegistrationByIdQuery(Guid Id) : IQuery<Result<RegistrationResponse>>;
