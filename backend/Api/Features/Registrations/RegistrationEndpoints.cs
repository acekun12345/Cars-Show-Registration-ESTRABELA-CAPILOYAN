namespace Api.Features.Registrations;

using Api.Common.Extensions;
using Api.Common.Filters;
using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Application.Features.Registrations.CreateRegistration;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrations;
using Application.Features.Registrations.GetRegistrationSummary;
using Domain.Common;

public static class RegistrationEndpoints
{
    public static IEndpointRouteBuilder MapRegistrationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/registrations").WithTags("Registrations");

        group.MapPost("/", async (
                CreateRegistrationCommand command,
                ICommandHandler<CreateRegistrationCommand, Result<RegistrationResponse>> handler,
                CancellationToken ct) =>
            {
                var result = await handler.HandleAsync(command, ct);
                return result.IsSuccess
                    ? Results.Created($"/api/registrations/{result.Value!.Id}", result.Value)
                    : result.ToProblemDetails();
            })
            .AddEndpointFilter<ValidationFilter<CreateRegistrationCommand>>()
            .Produces<RegistrationResponse>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status409Conflict);

        group.MapGet("/", async (
                [AsParameters] GetRegistrationsQuery query,
                IQueryHandler<GetRegistrationsQuery, Result<PagedResponse<RegistrationResponse>>> handler,
                CancellationToken ct) =>
            {
                var result = await handler.HandleAsync(query, ct);
                return result.IsSuccess ? Results.Ok(result.Value) : result.ToProblemDetails();
            })
            .AddEndpointFilter<ValidationFilter<GetRegistrationsQuery>>()
            .Produces<PagedResponse<RegistrationResponse>>()
            .ProducesProblem(StatusCodes.Status400BadRequest);

        group.MapGet("/summary", async (
                IQueryHandler<GetRegistrationSummaryQuery, Result<RegistrationSummaryResponse>> handler,
                CancellationToken ct) =>
            {
                var result = await handler.HandleAsync(new GetRegistrationSummaryQuery(), ct);
                return result.IsSuccess ? Results.Ok(result.Value) : result.ToProblemDetails();
            })
            .Produces<RegistrationSummaryResponse>();

        group.MapGet("/{id:guid}", async (
                Guid id,
                IQueryHandler<GetRegistrationByIdQuery, Result<RegistrationResponse>> handler,
                CancellationToken ct) =>
            {
                var result = await handler.HandleAsync(new GetRegistrationByIdQuery(id), ct);
                return result.IsSuccess ? Results.Ok(result.Value) : result.ToProblemDetails();
            })
            .Produces<RegistrationResponse>()
            .ProducesProblem(StatusCodes.Status404NotFound);

        return app;
    }
}
