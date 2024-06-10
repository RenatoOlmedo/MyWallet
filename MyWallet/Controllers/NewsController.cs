using Microsoft.AspNetCore.Mvc;
using MyWallet.Interfaces;
using MyWallet.Models.DTO;

namespace MyWallet.Controllers;

[ApiController]
[Route("[controller]")]
public class NewsController : ControllerBase
{
    private readonly INewsService _newsService;

    public NewsController(INewsService newsService)
        => _newsService = newsService;

    [HttpGet]
    public async Task<List<SimplifiedNewsDTO>> GetNewsByDate([FromQuery] int year, [FromQuery] int month)
    {
        var news = await _newsService.GetNewsByDateAsync(year, month);

        return news;
    }

    [HttpPost]
    public async Task CreateNews([FromBody] NewsDTO news)
    {
        await _newsService.CreateNewsAsync(news);
    }
}