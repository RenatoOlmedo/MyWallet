using MyWallet.Models.DTO;

namespace MyWallet.Interfaces;

public interface IUserService
{
    Task<List<UserViewDTO>> GetClientUsersAsync();
}