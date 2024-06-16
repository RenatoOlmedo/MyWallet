using MyWallet.Models.DTO;

namespace MyWallet.Interfaces;

public interface INewsService
{
    Task<List<NewsDTO>> GetNewsByDateAsync();
    Task CreateNewsAsync(NewsDTO news);
    Task UpdateNewsAsync(NewsDTO news);
    Task DeleteNewsAsync(string newsId);
}