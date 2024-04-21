using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Microsoft.Extensions.Options;
using MyWallet.Models;

namespace MyWallet.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {
            var modelBuilder = new ModelBuilder(new ConventionSet());
            
            modelBuilder.Entity<Wallet>().HasIndex(w => w.User);
            modelBuilder.Entity<Operation>().HasIndex(o => o.User);
            modelBuilder.Entity<ExpectedOutcome>().HasIndex(e => e.User);
            modelBuilder.Entity<PeriodResult>().HasIndex(e => e.User);

            OnModelCreating(modelBuilder);
        }
        
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<Operation> Operations { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<ExpectedOutcome> ExpectedOutcomes { get; set; }
        public DbSet<PeriodResult> PeriodResult { get; set; }
    }
}