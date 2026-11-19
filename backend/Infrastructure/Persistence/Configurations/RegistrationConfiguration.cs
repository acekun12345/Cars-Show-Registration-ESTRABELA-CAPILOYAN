namespace Infrastructure.Persistence.Configurations;

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class RegistrationConfiguration : IEntityTypeConfiguration<Registration>
{
    public void Configure(EntityTypeBuilder<Registration> b)
    {
        b.ToTable("Registrations");
        b.HasKey(x => x.Id);

        b.Property(x => x.RegistrationNumber).IsRequired().HasMaxLength(20);
        b.Property(x => x.ParticipantName).IsRequired().HasMaxLength(150);
        b.Property(x => x.ContactNumber).IsRequired().HasMaxLength(11);
        b.Property(x => x.Email).IsRequired().HasMaxLength(200);
        b.Property(x => x.Address).IsRequired().HasMaxLength(300);
        b.Property(x => x.CarMakeModel).IsRequired().HasMaxLength(100);
        b.Property(x => x.PlateNumber).IsRequired().HasMaxLength(15);

        b.Property(x => x.RegistrationType).HasConversion<string>().HasMaxLength(20);
        b.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(x => x.RegistrationFee).HasPrecision(18, 2);
        b.Property(x => x.AmountPaid).HasPrecision(18, 2);
        b.Property(x => x.RegistrationDate).HasConversion(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        b.Ignore(x => x.PaymentStatus); // computed, not stored

        b.HasIndex(x => x.PlateNumber).IsUnique();
        b.HasIndex(x => x.RegistrationNumber).IsUnique();
    }
}
