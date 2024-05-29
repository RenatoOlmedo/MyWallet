using Microsoft.AspNetCore.Mvc;
using MyWallet.Interfaces;

namespace MyWallet.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
        => _userService = userService;

    [HttpGet]
    public async Task<IActionResult> GetClientUsers()
    {
        var users = await _userService.GetClientUsersAsync();

        return Ok(users);
    }
}