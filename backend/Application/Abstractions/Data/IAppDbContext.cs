namespace Application.Abstractions.Data;

using Domain.Entities;
using Microsoft.EntityFrameworkCore;

public interface IAppDbContext
{
    DbSet<Registration> Registrations { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
