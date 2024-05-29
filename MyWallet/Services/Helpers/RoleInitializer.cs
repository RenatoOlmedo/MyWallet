using Microsoft.AspNetCore.Identity;
using MyWallet.Models;

namespace MyWallet.Services.Helpers;

public class RoleInitializer
{
    private readonly IServiceProvider _serviceProvider;

    public RoleInitializer(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task InitializeAsync()
    {
        var roleManager = _serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = _serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        
        string[] rolesNames = { "Admin", "User" };

        foreach (var roleName in rolesNames)
        {
            var roleExist = await roleManager.RoleExistsAsync(roleName);
            if (!roleExist)
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }
    }
}
