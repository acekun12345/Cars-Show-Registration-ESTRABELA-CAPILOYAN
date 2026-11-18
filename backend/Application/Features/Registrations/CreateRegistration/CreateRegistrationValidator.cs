namespace Application.Features.Registrations.CreateRegistration;

using Domain.Entities;
using FluentValidation;

public class CreateRegistrationValidator : AbstractValidator<CreateRegistrationCommand>
{
    public CreateRegistrationValidator()
    {
        RuleFor(x => x.ParticipantName).NotEmpty().MaximumLength(150);

        RuleFor(x => x.ContactNumber)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .Matches(@"^09\d{9}$")
            .WithMessage("'Contact Number' must follow the 09XXXXXXXXX format (11 digits).");

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(200);

        RuleFor(x => x.Address).NotEmpty().MaximumLength(300);
        RuleFor(x => x.CarMakeModel).NotEmpty().MaximumLength(100);
        RuleFor(x => x.PlateNumber).NotEmpty().MaximumLength(15);
        RuleFor(x => x.RegistrationType).IsInEnum();

        RuleFor(x => x.AmountPaid)
            .GreaterThanOrEqualTo(0)
            .WithMessage("'Amount Paid' must be 0 or more.");

        When(x => Enum.IsDefined(x.RegistrationType), () =>
            RuleFor(x => x.AmountPaid)
                .Must((cmd, paid) => paid <= RegistrationFees.For(cmd.RegistrationType))
                .WithMessage(cmd =>
                    $"'Amount Paid' cannot be more than the fee ({RegistrationFees.For(cmd.RegistrationType):N0})."));
    }
}
