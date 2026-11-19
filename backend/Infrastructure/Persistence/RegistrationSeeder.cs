namespace Infrastructure.Persistence;

using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public static class RegistrationSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Registrations.AnyAsync()) return;

        string[] names =
        {
            "Juan Dela Cruz", "Maria Santos", "Ana Reyes", "Pedro Garcia", "Liza Mendoza",
            "Carlo Bautista", "Ana Villanueva", "Jose Ramos", "Grace Aquino", "Mark Lim",
            "Rico Navarro", "Bea Fernandez", "Paolo Castillo", "Janine Flores", "Dennis Tan",
            "Karla Domingo", "Ramon Cruz", "Sofia Morales", "Luis Pascual", "Nina Torres",
            "Aldrin Salazar", "Cathy Ocampo", "Joel Mercado", "Tessa Rivera", "Vince Gonzales"
        };

        string[] cars =
        {
            "Toyota Supra MK4", "Nissan Skyline R34", "Honda Civic EK", "Mazda RX-7 FD",
            "Subaru WRX STI", "Mitsubishi Lancer Evo", "Ford Mustang GT", "Toyota AE86"
        };

        // 10 Confirmed, 6 CheckedIn, 6 Pending, 3 Cancelled (matches PDF summary distribution)
        RegistrationStatus[] statuses =
        {
            RegistrationStatus.Confirmed, RegistrationStatus.Confirmed, RegistrationStatus.Confirmed,
            RegistrationStatus.Confirmed, RegistrationStatus.Confirmed, RegistrationStatus.Confirmed,
            RegistrationStatus.Confirmed, RegistrationStatus.Confirmed, RegistrationStatus.Confirmed,
            RegistrationStatus.Confirmed, // 10 Confirmed
            RegistrationStatus.CheckedIn, RegistrationStatus.CheckedIn, RegistrationStatus.CheckedIn,
            RegistrationStatus.CheckedIn, RegistrationStatus.CheckedIn, RegistrationStatus.CheckedIn, // 6 CheckedIn
            RegistrationStatus.Pending, RegistrationStatus.Pending, RegistrationStatus.Pending,
            RegistrationStatus.Pending, RegistrationStatus.Pending, RegistrationStatus.Pending, // 6 Pending
            RegistrationStatus.Cancelled, RegistrationStatus.Cancelled, RegistrationStatus.Cancelled // 3 Cancelled
        };

        var types = new[] { RegistrationType.Exhibitor, RegistrationType.Competitor, RegistrationType.VIP };
        var baseDate = new DateTime(2026, 11, 1, 8, 0, 0, DateTimeKind.Utc);
        var list = new List<Registration>();

        for (var i = 0; i < 25; i++)
        {
            var type = types[i % 3];
            var fee = RegistrationFees.For(type);
            var status = statuses[i];

            // Ensure every status has a mix of Unpaid, Partial, and Paid
            decimal paid = (i % 3) switch
            {
                0 => 0m,                     // Unpaid
                1 => Math.Round(fee / 2, 2), // Partial
                _ => fee                     // Paid
            };

            list.Add(new Registration
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = $"CS27-{i + 1:D4}",
                RegistrationDate = baseDate.AddHours(i * 12),
                ParticipantName = names[i],
                ContactNumber = $"0917{1000000 + i * 137:D7}",
                Email = $"{names[i].Split(' ')[0].ToLower()}{i + 1}@example.com",
                Address = $"{100 + i} Rizal St., Sorsogon City",
                CarMakeModel = cars[i % cars.Length],
                PlateNumber = $"ABC {1000 + i + 1:D4}",
                RegistrationType = type,
                Status = status,
                RegistrationFee = fee,
                AmountPaid = paid
            });
        }

        db.Registrations.AddRange(list);
        await db.SaveChangesAsync();
    }
}
