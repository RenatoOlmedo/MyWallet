using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MyWallet.Models;

namespace MyWallet.Data;

public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
        : base(options, operationalStoreOptions)
    {
    }

    public DbSet<Wallet> Wallets { get; set; }
    public DbSet<Operation> Operations { get; set; }
    public DbSet<News> News { get; set; }
    public DbSet<ExpectedOutcome> ExpectedOutcomes { get; set; }
    public DbSet<PeriodResult> PeriodResult { get; set; }
}