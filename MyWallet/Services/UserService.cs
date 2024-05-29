using Microsoft.AspNetCore.Identity;
using MyWallet.Interfaces;
using MyWallet.Models;
using MyWallet.Models.DTO;

namespace MyWallet.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
        => _userManager = userManager;
    
    public async Task<List<UserViewDTO>> GetClientUsersAsync()
    {
        var usersInRole = await _userManager.GetUsersInRoleAsync("User");

        var userDtos = usersInRole.Select(user => new UserViewDTO
        {
            UserName = user.UserName,
            UserId = user.Id
        }).ToList();

        return userDtos;
    }
}