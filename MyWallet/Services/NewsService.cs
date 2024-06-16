using Microsoft.EntityFrameworkCore;
using MyWallet.Data;
using MyWallet.Interfaces;
using MyWallet.Models;
using MyWallet.Models.DTO;

namespace MyWallet.Services;

public class NewsService : INewsService
{
    private readonly ApplicationDbContext _db;

    public NewsService(ApplicationDbContext db)
        => _db = db;
    
    public async Task<List<NewsDTO>> GetNewsByDateAsync()
    {
        var news = await _db.News.ToListAsync();
        
        var newsDto = new List<NewsDTO>();
        
        if(news.Any())
            news.ForEach(
                x => newsDto.Add(
                    new NewsDTO
                    {
                        NewsId = x.Id,
                        Title = x.Title,
                        Body = x.Body
                    }));
        
        return newsDto;
    }

    public async Task CreateNewsAsync(NewsDTO news)
    {
        var newToCreate = new News
        {
            Title = news.Title,
            Body = news.Body
        };
        
        await _db.News.AddAsync(newToCreate);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateNewsAsync(NewsDTO news)
    {
        var newsToUpdate = await _db.News.FindAsync(news.NewsId);

        if (newsToUpdate is null)
            throw new KeyNotFoundException("Informação não encontrada.");
        
        newsToUpdate.Body = news.Body;
        newsToUpdate.Title = news.Title;

        _db.News.Update(newsToUpdate);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteNewsAsync(string newsId)
    {
        var news = await _db.News.FindAsync(newsId);
        
        if(news is null)
            throw new KeyNotFoundException("Informação não encontrada.");

        _db.News.Remove(news);
        await _db.SaveChangesAsync();
    }
}