namespace Application.Features.Registrations.GetRegistrations;

using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Enums;

public sealed record GetRegistrationsQuery(
    string? ParticipantName = null,
    RegistrationType? Type = null,
    RegistrationStatus? Status = null,
    int Page = 1,
    int PageSize = 10) : IQuery<Result<PagedResponse<RegistrationResponse>>>;
