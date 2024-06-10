using MyWallet.Models.DTO;

namespace MyWallet.Interfaces;

public interface INewsService
{
    Task<List<SimplifiedNewsDTO>> GetNewsByDateAsync(int year, int month);
    Task CreateNewsAsync(NewsDTO news);
}