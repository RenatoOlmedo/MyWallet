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
    public async Task<IActionResult> GetNews()
    {
        try
        {
            var news = await _newsService.GetNewsAsync();

            return Ok(news);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
    
    [HttpGet]
    [Route("GetNewsModal")]
    public async Task<IActionResult> GetNews([FromQuery] string newsId)
    {
        try
        {
            var news = await _newsService.GetModalNewsAsync(newsId);

            return Ok(news);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateNews([FromBody] NewsDTO news)
    {
        try
        {
            await _newsService.CreateNewsAsync(news);

            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest();
        }
    }
    
    [HttpPut]
    public async Task<IActionResult> UpdateNews([FromBody] NewsDTO news)
    {
        try
        {
            await _newsService.UpdateNewsAsync(news);

            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest();
        }
    }
    
    [HttpDelete]
    public async Task<IActionResult> DeleteNews([FromBody] string newsId)
    {
        try
        {
            await _newsService.DeleteNewsAsync(newsId);

            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest();
        }
    }
}