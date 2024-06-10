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
    
    public async Task<List<SimplifiedNewsDTO>> GetNewsByDateAsync(int year, int month)
    {
        var news = await _db.News.Where(x => x.Year == year && x.Month == month).ToListAsync();
        
        var newsDto = new List<SimplifiedNewsDTO>();
        
        if(news.Any())
            news.ForEach(
                x => newsDto.Add(
                    new SimplifiedNewsDTO
                    {
                        Title = x.Title,
                        Body = x.Body
                    }));
        
        return newsDto;
    }

    public async Task CreateNewsAsync(NewsDTO news)
    {
        var newToCreate = new News
        {
            Year = news.Year,
            Month = news.Month,
            Title = news.Title,
            Body = news.Body
        };
        
        await _db.News.AddAsync(newToCreate);
        await _db.SaveChangesAsync();
    }
}