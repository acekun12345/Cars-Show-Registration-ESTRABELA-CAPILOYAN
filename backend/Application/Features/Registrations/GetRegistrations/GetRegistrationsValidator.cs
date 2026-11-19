namespace Application.Features.Registrations.GetRegistrations;

using FluentValidation;

public class GetRegistrationsValidator : AbstractValidator<GetRegistrationsQuery>
{
    public GetRegistrationsValidator()
    {
        RuleFor(x => x.ParticipantName).MaximumLength(150);
        RuleFor(x => x.Type).IsInEnum();
        RuleFor(x => x.Status).IsInEnum();

        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1)
            .WithMessage("'Page' must be 1 or more.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 50)
            .WithMessage("'Page Size' must be between 1 and 50.");
    }
}
