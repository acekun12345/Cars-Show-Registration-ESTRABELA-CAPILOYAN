namespace Application.Features.Registrations.CreateRegistration;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class CreateRegistrationHandler(IAppDbContext db)
    : ICommandHandler<CreateRegistrationCommand, Result<RegistrationResponse>>
{
    public async Task<Result<RegistrationResponse>> HandleAsync(
        CreateRegistrationCommand command, CancellationToken cancellationToken = default)
    {
        var plate = command.PlateNumber.Trim();

        if (await db.Registrations.AnyAsync(r => r.PlateNumber == plate, cancellationToken))
            return Result<RegistrationResponse>.Failure(Error.Conflict(
                "Registration.Conflict",
                $"A registration with plate number '{plate}' already exists."));

        // Sequential number: CS27-0001, CS27-0002, ...
        var last = await db.Registrations
            .OrderByDescending(r => r.RegistrationNumber)
            .Select(r => r.RegistrationNumber)
            .FirstOrDefaultAsync(cancellationToken);
        var next = last is null ? 1 : int.Parse(last[5..]) + 1;

        var entity = new Registration
        {
            Id = Guid.NewGuid(),
            RegistrationNumber = $"CS27-{next:D4}",
            RegistrationDate = DateTime.UtcNow,
            ParticipantName = command.ParticipantName.Trim(),
            ContactNumber = command.ContactNumber.Trim(),
            Email = command.Email.Trim(),
            Address = command.Address.Trim(),
            CarMakeModel = command.CarMakeModel.Trim(),
            PlateNumber = plate,
            RegistrationType = command.RegistrationType,
            Status = RegistrationStatus.Pending,
            RegistrationFee = RegistrationFees.For(command.RegistrationType),
            AmountPaid = command.AmountPaid
        };

        try
        {
            db.Registrations.Add(entity);
            await db.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            return Result<RegistrationResponse>.Failure(Error.Conflict(
                "Registration.Conflict",
                $"A registration with plate number '{plate}' or registration number '{entity.RegistrationNumber}' already exists."));
        }

        return Result<RegistrationResponse>.Success(RegistrationResponse.From(entity));
    }
}
