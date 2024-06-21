using MyWallet.Models.DTO;

namespace MyWallet.Interfaces;

public interface INewsService
{
    Task<List<NewsDTO>> GetNewsAsync();
    Task<NewsDTO> GetModalNewsAsync(string newsId);
    Task CreateNewsAsync(NewsDTO news);
    Task UpdateNewsAsync(NewsDTO news);
    Task DeleteNewsAsync(string newsId);
}