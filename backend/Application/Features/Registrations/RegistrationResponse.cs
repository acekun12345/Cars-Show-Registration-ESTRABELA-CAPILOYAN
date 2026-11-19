namespace Application.Features.Registrations;

using Domain.Entities;
using Domain.Enums;

public sealed record RegistrationResponse(
    Guid Id,
    string RegistrationNumber,
    DateTime RegistrationDate,
    string ParticipantName,
    string ContactNumber,
    string Email,
    string Address,
    string CarMakeModel,
    string PlateNumber,
    RegistrationType RegistrationType,
    RegistrationStatus Status,
    decimal RegistrationFee,
    decimal AmountPaid,
    PaymentStatus PaymentStatus)
{
    public static RegistrationResponse From(Registration r) => new(
        r.Id, r.RegistrationNumber, r.RegistrationDate,
        r.ParticipantName, r.ContactNumber, r.Email, r.Address,
        r.CarMakeModel, r.PlateNumber,
        r.RegistrationType, r.Status,
        r.RegistrationFee, r.AmountPaid, r.PaymentStatus);
}
